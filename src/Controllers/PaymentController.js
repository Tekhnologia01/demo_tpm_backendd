// const sql = require("../config/database");
//  const axios = require("axios");
import CryptoJS from "crypto-js";
import Razorpay from "razorpay";
import { query } from '../utils/database.js';




const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

const initiatePayment = async (req, res) => {
  const { amount, currency } = req.body;
  console.log('passed amount from frameElement', amount, currency)
  const options = {
    amount: amount,                                               // Amount in paisa
    currency: currency,
    receipt: `order_rcptid_${Date.now()}`,
  };
console.log(options)
  try {
    const order = await razorpay.orders.create(options);
    console.log(order);
    console.log("Order ID", order.id);

    return res.status(200).json({ status: true, orderId: order.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Razorpay order creation failed", error: error.message });
  }
}

const insertInitialPaymentData = async (req, res) => {
  try {
    const { user_id, amount, currency, order_id } = req.body;

    if (!user_id || !amount || !currency || !order_id) {
      return res.status(404).json({ status: false, message: ' user_id, amount, currency, order_id, all fields are required' });
    }

    // Insert data into tbl_payment_details using a Stored Procedure (SP)
  
    const response = await query("CALL Insert_payment_details(?, ?, ?, ?)", [user_id, amount, currency, order_id]);
    console.log("Ini data inserted :", response);
    return res.status(200).json({ status: true, message: "Payment details stored successfully.", response: response[0][0] });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to store payment details", error });
  }
};

const updatePaymentDetails = async (req, res) => {
  try {
    const { razorpay_payment_id, payment_method, payment_status, razorpay_signature, plan_type_id, order_id, payment_detail_id } = req.body;


    if (!razorpay_payment_id || !payment_method || !payment_status || !razorpay_signature || !plan_type_id || !order_id || !payment_detail_id) {
      return res.status(404).json({ status: false, message: 'razorpay_payment_id, payment_method, payment_status, razorpay_signature, plan_type_id, order_id, payment_detail_id, all fields are required' });
    }
    console.log("data req collected ");

    // Fetch the order from DB
    const [payment] = await query("SELECT * FROM tbl_payment_details WHERE order_id = ?", [order_id]);

    if (!payment.length) {
      return res.status(400).json({ status: false, message: "Invalid Order ID" });
    }
    console.log("order_id exists", payment);

    // order_id = "order_PtzmpbqC587Y5H";
    // razorpay_payment_id = "pay_PtzoB3guy3QIXc";
    console.log("Order id :", order_id);
    console.log("Raz_Payment id :", razorpay_payment_id);

    // Verify Razorpay Signature
    const expectedSignature = CryptoJS.HmacSHA256(
      order_id + "|" + razorpay_payment_id,
      process.env.key_secret
    ).toString(CryptoJS.enc.Hex);

    console.log("Expected Signa :", expectedSignature);


    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ status: false, message: "Invalid Payment Signature" });
    }
    console.log("Signature verified");

    // Update Payment Details
    const response = await query("CALL UpdatePaymentDetails(?, ?, ?, ?, ?, ?, ?)", [razorpay_payment_id, payment_method, payment_status, razorpay_signature, order_id, payment_detail_id, plan_type_id]);
    console.log("Data updated :", response);

    // Insert into `tbl_plan_book`
    // await db.execute("CALL insert_plan_book(?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))", [user_id, plan_type_id, razorpay_payment_id]);

    return res.status(200).json({ status: true, message: "Payment successful and plan booked.", response: response[0][3][0] });
  } catch (error) {
    console.log("jgdjvjhgfcjeb ", error)
    return res.status(500).json({ status: false, message: "Payment update failed", error });
  }
}

const getRazpayPaymentDetailsBy_PaymentId = async (req, res) => {

  try {
    const { payment_id } = req.params;

    const response = await axios.get(`https://api.razorpay.com/v1/payments/${payment_id}`, {
      auth: {
        username: process.env.key_id,
        password: process.env.key_secret
      }
    });
    console.log(response);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



const getBookedPlan = async (req, res) => {
  try {
    const { user_id } = req.params;
    const [planData] = await db.execute("CALL get_plan_and_payment_details(?)", [user_id]);

    return res.status(200).json({ status: true, planData });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to fetch details", error });
  }
}

// Get All Exam Results
const getAllPaymentDetails = async (req, res) => {
  try {
    const result = await query('CALL GetAllPaymentDetails()');
    const paymentDetails = result[0];
    if (!paymentDetails || paymentDetails.length === 0) {
      return res.status(404).json({ status: false, message: 'No payment details found', data: null });
    }

    return res.status(200).json({ status: true, message: 'Payment details successfully', data: paymentDetails[0] });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Internal Server Error', error: error.message || 'An unexpected error occurred' });
  }
};

// module.exports = {
//   initiatePayment, insertInitialPaymentData,
//   updatePaymentDetails,
//   getRazpayPaymentDetailsBy_PaymentId,
//   getBookedPlan, getAllPaymentDetails
// };

export default { initiatePayment}
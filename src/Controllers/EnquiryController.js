import { query } from '../utils/database.js';
import { getEpochTime } from '../utils/epochtime.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()


// Create enquiry API
// const createEnquiry = async (req, res) => {
//     try {
//         const { enquiry_Name, institute_Name, email, contact, product, plan, message, enquiry_Date } = req.body;

//         if (!enquiry_Name || !institute_Name || !email || !contact || !product || !plan || !message || !enquiry_Date) {
//             return res.status(400).send({ status: false, message: "Please provide all enquiry fields" });
//         }

//         const createEnquiryQuery = 'CALL PostEnquiry(?, ?, ?, ?, ?, ?, ?, ?, ?)';
       
//         const CreatedAt = getEpochTime();                              // created at 
//         const result = await query(createEnquiryQuery, [
//             enquiry_Name, institute_Name, email, contact, 
//             product, plan, message, enquiry_Date, CreatedAt
//         ]);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ status: false, message: "Enquiry not added or no changes made" });
//         }

//         return res.status(200).send({ status: true, data: result.InsertedID, message: "Enquiry Added Successfully" });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).send({ status: false, message: err.message });
//     }
// };

// 1111

const getProductAndPackageNameById = async (productId, packageId) => {
    try {
      const queryText = 'CALL GetProductAndPackageNameById(?, ?)';
      const result = await query(queryText, [productId, packageId]);
  
      const names = result?.[0]?.[0]; // because CALL returns [ [rows], [metadata] ]
      console.log("Product & Package Names:", names);
  
      return {
        productName: names?.product_name || "Unknown Product",
        packageName: names?.package_name || "Unknown Package"
      };
    } catch (error) {
      console.error("Error fetching product and package names:", error);
      return {
        productName: "Unknown Product",
        packageName: "Unknown Package"
      };
    }
};

  
const createEnquiry = async (req, res) => {
    try {
      const { enquiry_Name, institute_Name, email, contact, product, plan, message, enquiry_Date } = req.body;
  
      if (!enquiry_Name || !institute_Name || !email || !contact || !product || !plan || !message || !enquiry_Date) {
        return res.status(400).send({ status: false, message: "Please provide all enquiry fields" });
      }
  
      const CreatedAt = getEpochTime();
      const createEnquiryQuery = "CALL PostEnquiry(?, ?, ?, ?, ?, ?, ?, ?, ?)";
      
      const result = await query(createEnquiryQuery, [
        enquiry_Name,
        institute_Name,
        email,
        contact,
        product,
        plan,
        message,
        enquiry_Date,
        CreatedAt,
      ]);
  
      // Fetch product and package names using SP
      const { productName, packageName } = await getProductAndPackageNameById(product, plan);
      console.log(`Product ID: ${product}, Name: ${productName}`);
      console.log(`Package ID: ${plan}, Name: ${packageName}`);
  
      // Send Email to Admin
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: `"${enquiry_Name}" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        replyTo: email,
        subject: `New Enquiry from ${enquiry_Name}`,
        text: `
          Name: ${enquiry_Name}
          Email: ${email}
          Institute: ${institute_Name}
          Contact: ${contact}
          Product: ${productName}
          Package: ${packageName}
          Message: ${message}
          Enquiry Date: ${enquiry_Date}
        `,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).send({
            status: true,
            message: "Enquiry saved but email failed to send",
          });
        }
  
        return res.status(200).send({
          status: true,
          data: result?.[0]?.InsertedID || null,
          message: "Enquiry added and email sent to admin",
        });
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).send({ status: false, message: err.message });
    }
};  


// 1111
// Fetch Enquiry  API
const fetchEnquiryData = async (req, res) => {
    try {

        // const { page, limit } = req.body;
                                                                 
        // if (!page || !limit ) {                       // Validate required fields      
        //     return res.status(400).send({ status: false, message: "please Provide fields" });
        // }

        const getenquiryQuery = `CALL GetEnquiry1()`                                    // Call stored procedure 
        const [result] = await query(getenquiryQuery);

       // const row = result[0]

        if (!result || result.length === 0) {
            return res.status(200).json({ status: false, message: "No Enquiry available right now." });
        }

        return res.status(200).json({ status: true, data: result, message: "Enquiries get successfully." });

    } catch (error) {
        console.error("Error fetching exam data:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
}

// Update Enquiry API
const updatdeEnquiryData = async (req, res)=>{
    try {
        const { enquiry_Id,product,plan,en_Status} = req.body;                                               // Validate required fields
    
        // console.log(req.body);                                                                    //debug
    
        if (!enquiry_Id ||!product ||!plan || !en_Status) {
            return res.status(400).json({ status: false, message: "Enquiry ID and status are required" });
        }

        console.log(enquiry_Id)
      
        const updateenquiryQuery = 'CALL updateEnquiry(?, ?, ?, ?, ?, ?)';
        const admin_Id = req.user.adminId;                        // updated by
        const UpdatedAt = getEpochTime();                        // Update at 
        const result = await query(updateenquiryQuery, [enquiry_Id,product,plan,en_Status,admin_Id,UpdatedAt]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: false, message: "Enquiry not found or no changes made" });
        }

        return res.status(200).json({ status: true, message: "Enquiry updated successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }

}

//Remove Enquiry API
const deleteEnquiryData = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ status: false, message: "Email is required" });
        }

        const deleteEnquiryQuery = 'CALL deleteEnquiry(?, ?, ?)';
        const admin_Id = req.user.adminId;                               // Deleted by admin
        // const deletedAt = new Date();                               
        const deletedAt = getEpochTime();                               // Current timestamp
        const result = await query(deleteEnquiryQuery, [email, deletedAt, admin_Id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: false, message: "Enquiry not found" });
        }

        return res.status(200).json({ status: true, message: "Enquiry deleted successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

// Convert Enquiry to Client
const convertEnquirytoClient = async (req, res) => {
    try {

        const {enquiry_Id} = req.params;                                 //check enquiry 

        if (!enquiry_Id) {
            return res.status(400).json({ status: false, message: "Enquiry Id required" });
        }

        const {start_date,plan}  = req.body;                                 //check enquiry 

        if (!start_date || !plan) {
            return res.status(400).json({ status: false, message: "Start Date and plan validity required" });
        }
           
        // const convertenquiryQuery = `CALL ConvertEnquiryToClient1(?,?,?)`;   // call stored procedure with enduiry id
        const convertenquiryQuery = `CALL ConvertEnquiryToClient_autofilldate(?,?,?,?,?)`;   // call stored procedure with enduiry id
        const admin_Id = req.user.adminId;                        // updated by
        const UpdatedAt = getEpochTime();                        // Update at 
        const rows = await query(convertenquiryQuery,[enquiry_Id,admin_Id,UpdatedAt,start_date,plan]);
        

        return res.status(200).json({ status: true, data: rows, message: "Enquiries converted successfully."});

    } catch (error) {
        console.error("Error fetching exam data:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
}




export default { createEnquiry,fetchEnquiryData,updatdeEnquiryData,deleteEnquiryData,convertEnquirytoClient}



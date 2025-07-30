import { query } from '../utils/database.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getEpochTime } from '../utils/epochtime.js';
// import { text } from 'body-parser';

dotenv.config()


const getServiceNameById = async (serviceId) => {
    console.log('service id',serviceId)
    try {
      const result = await query("SELECT service_name FROM tbl_service WHERE service_id = ?;", [serviceId]);

      console.log('result service ',result)
      
      return result?.[0]?.service_name   // Ensure correct access pattern
    } catch (error) {
      console.error("Error fetching service name:", error);
      return "Unknown Service";  // Fallback value in case of error
    }
  };
  
  const createTekhEnquiry = async (req, res) => {
    try {
      const { enquiry_Name, institute_Name, email, contact, services, message, enquiry_Date } = req.body;
  
      if (!enquiry_Name || !institute_Name || !email || !contact || !services || !message || !enquiry_Date) {
        return res.status(400).send({ status: false, message: "Please provide all enquiry fields" });
      }

      const CreatedAt = getEpochTime();
      const createEnquiryQuery = "CALL PostEnquiry3(?, ?, ?, ?, ?, ?, ?, ?)";
      
      const result = await query(createEnquiryQuery, [
        enquiry_Name,
        institute_Name,
        email,
        contact,
        services,
        message,
        enquiry_Date,
        CreatedAt,
      ]);
 
      // Fetch the service name using SP
      const serviceName = await getServiceNameById(services);
      console.log(`Service ID: ${services}, Service Name: ${serviceName}`);  
  
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
          Service: ${serviceName}
          Message: ${message}
          Enquiry Date: ${enquiry_Date}
        `,

      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
          return res.status(500).send({ status: true, 
            message: "Enquiry saved but email failed to send" });
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
  

  export default {createTekhEnquiry } 
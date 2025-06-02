import { query } from '../utils/database.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// import { getEpochTime } from '../utils/epochtime.js';
// import { text } from 'body-parser';

dotenv.config()
// import twilio from 'twilio';



// These are the credentials used to authenticate with Gmail’s SMTP server. 

// const EMAIL_USER = "priti.tekhnologia@gmail.com";    // E-mail
// const EMAIL_PASS = "yypi jidi wvnh futq";           // Generate E-mail Passkey



// Uses a regular expression to check if the input follows a valid email format
const isEmail = (input) => /\S+@\S+\.\S+/.test(input);


//  Setting Up Nodemailer for Sending Emails
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Gmail SMTP service
    auth: {
        user: process.env.EMAIL_USER,       // Use EMAIL_USER from .env
        pass: process.env.EMAIL_PASS        // Use EMAIL_PASS from .env
    }
});






//   const createTekhEnquiry = async (req, res) => {
//     try {
//         const { enquiry_Name, institute_Name, email, contact, services, message, enquiry_Date } = req.body;
//         if (!enquiry_Name || !institute_Name || !email || !contact || !services || !message || !enquiry_Date) {
//             return res.status(400).send({ status: false, message: "Please provide all enquiry fields" });
//         }

//         const createEnquiryQuery = 'CALL PostEnquiry3(?, ?, ?, ?, ?, ?, ?, ?)';
//         // console.log("Input:", enquiry_Name, institute_Name, email, contact, services, message, enquiry_Date);

       
//         const CreatedAt = getEpochTime();                              // created at 
//         const result = await query(createEnquiryQuery, [
//             enquiry_Name, institute_Name, email, contact, 
//             services,message, enquiry_Date, CreatedAt
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



// const mailOptions = {
//     from: `"${process.env.EMAIL_USER_Name}" <${process.env.EMAIL_USER}>`,  // looks like it's from Sarah
//     to: process.env.ADMIN_EMAIL,
//     replyTo: email,                                 // so admin can reply to user
//     subject: `New Enquiry from ${enquiry_Name}`,
//     text: `
//       Name: ${enquiry_Name}
//       Email: ${email}
//       Message: ${message}
//     `
//   };
  
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error sending email:', error);
//       return res.status(500).json({ error: 'Failed to send email' });
//     }
//     res.status(200).json({ message: 'Enquiry submitted and email sent to admin' });
//   });

// 11111111

// const getServiceNameById = async (serviceId) => {
//     try {
//       const result = await query("CALL GetServiceNameById(?)", [serviceId]);
      
//       return result?.[0]?.[0]?.service_name || "Unknown Service";  // Ensure correct access pattern
//     } catch (error) {
//       console.error("Error fetching service name:", error);
//       return "Unknown Service";  // Fallback value in case of error
//     }
//   };
  
//   const createTekhEnquiry = async (req, res) => {
//     try {
//       const { enquiry_Name, institute_Name, email, contact, services, message, enquiry_Date } = req.body;
  
//       if (!enquiry_Name || !institute_Name || !email || !contact || !services || !message || !enquiry_Date) {
//         return res.status(400).send({ status: false, message: "Please provide all enquiry fields" });
//       }

  
//       const CreatedAt = getEpochTime();
//       const createEnquiryQuery = "CALL PostEnquiry3(?, ?, ?, ?, ?, ?, ?, ?)";
      

//       const result = await query(createEnquiryQuery, [
//         enquiry_Name,
//         institute_Name,
//         email,
//         contact,
//         services,
//         message,
//         enquiry_Date,
//         CreatedAt,
//       ]);
  
//       // Fetch the service name using SP
//       const serviceName = await getServiceNameById(services);
  
//       // Send Email to Admin
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });
  
//       const mailOptions = {
//         from: `"${enquiry_Name}" <${process.env.EMAIL_USER}>`,
//         to: process.env.ADMIN_EMAIL,
//         replyTo: email,
//         subject: `New Enquiry from ${enquiry_Name}`,
//         text: `
//           Name: ${enquiry_Name}
//           Email: ${email}
//           Institute: ${institute_Name}
//           Contact: ${contact}
//           Service: ${serviceName}
//           Message: ${message}
//           Enquiry Date: ${enquiry_Date}
//         `,

//       };

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.log("Error sending email:", error);
//           return res.status(500).send({ status: true, message: "Enquiry saved but email failed to send" });
//         }
  
//         return res.status(200).send({
//           status: true,
//           data: result?.[0]?.InsertedID || null,
//           message: "Enquiry added and email sent to admin",
//         });
//       });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).send({ status: false, message: err.message });
//     }
//   };
  
//   111111


// OTP Storage (In-Memory)
const codes = {};


//  OTP Generation
const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code
};


// User SendOTP API
const sendOtp = async (req, res) => {
    const { email } = req.body;

    // Validate input
    if (!email) {
        return res.status(400).json({ status: false, error: 'Email is required' });
    }

    const code = generateCode(); // Generate a new code for each request
    console.log('OTP code is:', code);

    // Determine if input is email or phone
    const isEmailInput = isEmail(email);

    try {
        // Call the stored procedure
        const result = await query('CALL SendOTPByEmailOrPhone(?)', [email]);

        if (!result || !Array.isArray(result) || (result[0] && result[0].length === 0)) {
            return res.status(404).json({ status: false, error: 'Email not found in user records' });
        }
        

        // Send verification code
        if (isEmailInput) {
            const mailOptions = {
                from: process.env.EMAIL_USER,                                       // Sender email from .env
                to: email,                                                          // Recipient email
                subject: '🔑 Your Tekhno Product Management Portal Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; text-align: center; background-color: #f8f9fa; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #0A2E73;">🔐 Verify Your Account</h2>
                        <p style="font-size: 16px; color: #333;">Thank you for connecting with <strong>Tekhno Product Management</strong>.</p>
                        <p style="font-size: 16px; color: #333;">Your one-time verification code is:</p>
                       
                        <div style="display: inline-block; background-color: #0A2E73; color: #ffffff; font-size: 22px; font-weight: bold; padding: 12px 24px; border-radius: 5px; margin: 15px 0;">
                            ${code}
                        </div>
                       
                        <p style="font-size: 14px; color: #555;">This code is valid for a limited time. Please do not share it with anyone.</p>
                        <hr style="border: 0; height: 1px; background-color: #ddd; margin: 20px 0;">
                        <p style="font-size: 14px; color: #555;">Best Regards, <br> <strong>Tekhno Product Management TEAM</strong></p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            codes[email] = code;                                       // Store the code in the in-memory store
            console.log('Verification email sent with OTP:', code);
            return res.status(200).json({ status: true, message: 'Verification code sent to email' });
        } 
        
    } catch (error) {
        console.error('Error querying database:', error);
        return res.status(500).json({ status: false, error: 'Failed to query database' });
    }
};

// User verifyOTP API

const verifyOtp = async (req, res) => {
    const { email, enteredCode } = req.body;
    // console.log(enteredCode)                                           // debug

    console.log("Entered Code Type:", typeof enteredCode, "Value:", enteredCode);
    
    if (!email) {                                                         // Validate input
        return res.status(400).json({ status: false, error: 'Email or phone number is required' });
    }
    if (!enteredCode) {
        return res.status(400).json({ status: false, error: 'Entered code is required' });
    }
   
    const storedCode = codes[email];                                        // Check if a code exists for this email or phone number
    console.log("Stored Code Type:", typeof storedCode, "Value:", storedCode);
    if (!storedCode) {
        return res.status(400).json({ status: false, error: 'No code found for this email' });
    }
    
    if (String(enteredCode).trim() === String(storedCode).trim()) {                           // Verify the entered code against the stored code
        delete codes[email]; // Remove the code from the in-memory store after successful verification
        return res.status(200).json({ status: true, message: 'Verification successful' });
    } else {
        return res.status(400).json({ status: false, error: 'Verification failed', message: 'Please Enter correct OTP' });
    }
}

// Validate Password

const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return { isValid: false, message: "Password must be at least 8 characters long." };
    }
    if (!hasUpperCase) {
        return { isValid: false, message: "Password must contain at least one uppercase letter." };
    }
    if (!hasLowerCase) {
        return { isValid: false, message: "Password must contain at least one lowercase letter." };
    }
    if (!hasNumber) {
        return { isValid: false, message: "Password must contain at least one number." };
    }
    if (!hasSpecialChar) {
        return { isValid: false, message: "Password must contain at least one special character." };
    }

    return { isValid: true, message: "Valid password." };
};

// Validate Updated E-mail

const validateAndFormatEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, message: "Invalid email format." };
    }
    return { isValid: true, formattedEmail: email.trim().toLowerCase() };
};


// User forgetPassword API

const forgetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ status: false, message: 'Email and new password are required' });
    }

    const passwordValidation = validatePassword(newPassword);               // Validate the new password
    if (!passwordValidation.isValid) {
        return res.status(400).json({ status: false, message: passwordValidation.message });
    }

    try {
        const validatedEmail = validateAndFormatEmail(email);               // Validate and format the email
        if (!validatedEmail.isValid) {
            return res.status(400).json({ status: false, message: validatedEmail.message });
        }

        const [userResult] = await query('SELECT user_id FROM tbl_user WHERE user_email = ?', [validatedEmail.formattedEmail]);       // Check if the user exists
        if (userResult.length === 0) {
            return res.status(404).json({ status: false, message: 'No user found with this email address' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);            // Hash the new password
        if (!hashedPassword) {
            return res.status(500).json({ status: false, message: 'Password hashing failed' });
        }

        const updateResult = await query('CALL UpdateUserPassword(?, ?)', [validatedEmail.formattedEmail, hashedPassword]);     // Call the stored procedure to update the password

        if (updateResult.affectedRows === 0) {                                                                       // Check if the password was actually updated
            return res.status(400).json({ status: false, message: 'Password update failed. User may not exist.' });
        }

        return res.status(200).json({ status: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Error processing password reset:', error);
        return res.status(500).json({ status: false, message: 'An error occurred while processing your request', error: error.message || 'Unknown error' });
    }
};


// User Send Payment Link API

// const sendPaymentLink = async (req, res) => {
//     const { email, amount } = req.body;

//     // Validate input
//     if (!email || !amount) {
//         return res.status(400).json({ status: false, error: 'Email and amount are required' });
//     }

//     try {
//         // Check if email exists in user records
//         const result = await query('CALL SendOTPByEmailOrPhone(?)', [email]);

//         if (!result || !Array.isArray(result) || (result[0] && result[0].length === 0)) {
//             return res.status(404).json({ status: false, error: 'Email not found in user records' });
//         }

//         // Generate a payment link (Example using Razorpay)
//         // const paymentLink = await generatePaymentLink(email, amount);     // Implement this function based on your payment gateway

//         // const paymentLink

//         if (!paymentLink) {
//             return res.status(500).json({ status: false, error: 'Failed to generate payment link' });
//         }

//         // Email content with payment link
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: '💳 Secure Payment Link - Tekhno Product Management',
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; text-align: center; background-color: #f8f9fa; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
//                     <h2 style="color: #0A2E73;">💰 Complete Your Payment</h2>
//                     <p style="font-size: 16px; color: #333;">You have a pending payment of <strong>₹${amount}</strong> for Tekhno Product Management.</p>
//                     <p style="font-size: 16px; color: #333;">Click the link below to complete your payment:</p>
                    
//                     <a href="${paymentLink}" target="_blank" 
//                        style="display: inline-block; background-color: #28a745; color: #ffffff; font-size: 18px; font-weight: bold; padding: 12px 24px; border-radius: 5px; text-decoration: none; margin: 15px 0;">
//                         Pay Now
//                     </a>

//                     <p style="font-size: 14px; color: #555;">This link is valid for a limited time. Please complete your payment as soon as possible.</p>
//                     <hr style="border: 0; height: 1px; background-color: #ddd; margin: 20px 0;">
//                     <p style="font-size: 14px; color: #555;">Best Regards, <br> <strong>Tekhno Product Management TEAM</strong></p>
//                 </div>
//             `
//         };

//         await transporter.sendMail(mailOptions);
//         console.log('Payment link sent to email:', email);

//         return res.status(200).json({ status: true, message: 'Payment link sent to email', paymentLink });

//     } catch (error) {
//         console.error('Error sending payment link:', error);
//         return res.status(500).json({ status: false, error: 'Failed to send payment link' });
//     }
// };



//     from: `"Your Service" <${process.env.EMAIL_USER}>`,  // Your email
//     to: process.env.ADMIN_EMAIL,                         // Admin email
//     replyTo: email,                                      // User's email
//     subject: `New Enquiry from ${name}`,
//     text: `
//       Name: ${name}
//       Email: ${email}
//       Message: ${enquiry}
//     `
//   };

  



export default { sendOtp, verifyOtp, forgetPassword} 
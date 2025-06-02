import { query } from '../utils/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
import { getEpochTime } from '../utils/epochtime.js';


// UserLogin 
const userLogins = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        console.log(password);


        // console.log(req.body)                                  // debug

        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Email and Password are required' });
        }

        const selectUserQuery = 'SELECT * FROM tbl_user WHERE user_email = ? AND user_status = 1';
        const users = await query(selectUserQuery, [email]);
        if (!users || users.length === 0) {
            return res.status(401).json({ status: false, message: 'Invalid email' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.user_password);           // Check password with bcrypt
        if (!isMatch) {
            return res.status(401).json({ status: false, message: 'Invalid password' });
        }

        console.log(isMatch)

        const token = jwt.sign(
            { adminId: user.user_id, roleId: user.user_role_id, name: user.user_name },      // JWT token key
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY }
        );

        return res.status(200).json({
            status: true,
            message: 'Login successful',
            token,
            adminId: user.user_id
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
}


// User Registration API
const registerUser = async (req, res) => {
    try {
        const { name, email, contact, password } = req.body;
        // console.log(req.body);                              // debug

        if (!name || !email || !contact || !password) {
            return res.status(400).send({ status: false, message: "Please provide name, email, contact, and password (they are mandatory)" });
        }

        const checkUserQuery = 'SELECT user_name, user_email, user_contact FROM tbl_user WHERE user_email = ?';    // Check if the user already exists
        const [existingUser] = await query(checkUserQuery, [email]);

        if (existingUser) {
            return res.status(400).send({ status: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);         // Hash the password before storing it

        const insertUserQuery = 'INSERT INTO tbl_user (user_name, user_email, user_contact, user_password) VALUES (?, ?, ?, ?)';      // Insert user with hashed password
        const result = await query(insertUserQuery, [name, email, contact, hashedPassword]);

        const insertedId = result.insertId;
        return res.status(200).send({ status: true, data: insertedId, message: "User registered successfully" });
    } catch (err) {
        console.error("Error in user registration:", err);
        return res.status(500).send({ status: false, message: "Internal server error" });
    }
};


// Update MyProfile API
const updatemyprofile = async (req, res) => {
    try {
        const { name, email, contact } = req.body;
        console.log(req.body);

        if (!name || !email || !contact) {
            return res.status(400).send({ status: false, message: "Please provide name, email, contact, and password (they are mandatory)" });
        }
        // updated at
        const updateQuery = 'CALL updateMyprofile(?,?,?,?,?,?)';             // Call stored 
        const adminId = req.user.adminId;                                    // updated By
        const UpdatedAt = getEpochTime();                                    // updated At

        const result = await query(updateQuery, [adminId, name, email, contact, adminId, UpdatedAt]);
        console.log(result)
        if (!result || result.length === 0) {
            return res.status(200).json({ status: false, message: "No data available right now." });
        }

        return res.status(200).json({ status: true, message: "User profile updated successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};


// update MyPassword API
const updatemypassword = async (req, res) => {
    try {
        const { password } = req.body;
        console.log(req.body);

        if (!password) {
            return res.status(400).send({ status: false, message: "Please password (they are mandatory)" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const adminId = req.user.adminId;
        const UpdatedAt = getEpochTime();

        const updateQuery = 'CALL updateMypassword(?,?,?,?)';                  // Call stored procedure
        const result = await query(updateQuery, [adminId,hashedPassword, adminId, UpdatedAt]);
        
        if (!result || result.length === 0) {
            return res.status(404).json({ status: false, message: "No available right now." });

        }

        return res.status(200).json({ status: true, message: "User password updated successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};


// Fetch MyProfile API
const fetchmyprofile = async (req, res) => {
    try {

        const admin_Id = req.user.adminId;

        if (!admin_Id) {
            return res.status(400).send({ status: false, message: "Please provide adminId)" });
        }

        const myprofileQuery = `CALL Getmyprofile(?)`
        const [result] = await query(myprofileQuery, [admin_Id]);

        console.log(result)

        const row = result[0]

        if (!row || row.length === 0) {
            return res.status(404).json({ status: false, message: "No available right now." });

        }

        return res.status(200).json({ status: true, data: row, message: "profile  get successfully." });

    } catch (error) {
        console.error("Error fetching exam data:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
}



export default { registerUser, userLogins, fetchmyprofile, updatemyprofile, updatemypassword } 

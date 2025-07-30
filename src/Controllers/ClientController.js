import { query } from '../utils/database.js';
import { getEpochTime } from '../utils/epochtime.js';

// Create Client API
const createClientSp = async (req, res) => {
    try {
        const {user_Name, institute_Name, contact, email, product,Package,plan, start_Date } = req.body;

         console.log(req.body)                     //debug

        if (!user_Name || !institute_Name || !contact || !email || !product || !Package || !plan || !start_Date ) {
            return res.status(400).json({ status: false, message: "All fields are required." });                      // Validate required fields
        }
        
        const postClientQuery = `CALL postAutofillDate(?, ?, ?, ?, ?, ?, ?, ?,?,?)`;                             // SQL Query: Call stored procedure with parameters

        const admin_Id = req.user.adminId;
        const CreatedAt = getEpochTime()
        
        const result = await query(postClientQuery, [admin_Id,user_Name,institute_Name, contact, email, product,Package, plan, start_Date ,CreatedAt ]);

        // console.log(result)                            //debug

        return res.status(201).json({ status: true, message: "Client added successfully.", data: result });

    } catch (error) {
        console.error("Error adding client:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};


// Fetch Client API
const getClientsSp = async (req, res) => {
    try {
        // const { page, limit } = req.body;

        // console.log(req.body);                      //debug
                                                                 
        // if (!page || !limit ) {                       // Validate required fields      
        //     return res.status(400).send({ status: false, message: "please Provide fields" });
        // }
        
        const examDataQuery = `CALL GetClient1()`;                // SQL Query: Call stored procedure with userStatus
        const [rows] = await query(examDataQuery);
        
        if (!rows || rows.length === 0) {
            return res.status(200).json({ status: true, message: "No client available right now."});
        }

        return res.status(200).json({ status: true, data: rows, message: "client fetched successfully." });

    } catch (error) {
        console.error("Error fetching exam data:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};


// Update Client API
const updateClientDataSp = async (req, res) => {
    try {
        const { user_Id, user_Name, contact, institute_Name, email, product, Package, plan, start_Date } = req.body;

        // Validate required fields
        if (!user_Id || !user_Name || !contact || !institute_Name || !email || !product || !Package || !plan || !start_Date) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        // Call stored procedure
        const updateQuery = 'CALL updateClient(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const admin_Id = req.user.adminId;
        const UpdatedAt = getEpochTime();
        const result = await query(updateQuery, [user_Id, user_Name, institute_Name, contact, email, product, Package, plan, start_Date, admin_Id, UpdatedAt]);

        // Check if the result contains data
        if (!result || !result[0] || result[0].length === 0) {
            return res.status(404).json({ status: false, message: "No data available or update failed." });
        }

        // Extract the end date from the result
        const end_date = result[0][0].end_date || null;

        return res.status(200).json({ 
            status: true, 
            message: "User updated successfully", 

        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};


//Remove Client API
const deleteClientData = async (req, res) => {
    try {
        const { user_Id } = req.body;

        if (!user_Id) {
            return res.status(400).json({ status: false, message: "UserId is required" });
        }

        const deleteQuery = 'CALL deleteClient(?,?,?)';
        const admin_Id = req.user.adminId;                               // Deleted by admin                            
        const deletedAt = getEpochTime();                               // Current timestamp
        const result = await query(deleteQuery, [user_Id,deletedAt, admin_Id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        return res.status(200).json({ status: true, message: "User deleted successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};



export default { createClientSp, getClientsSp, updateClientDataSp,deleteClientData}
import { query } from '../utils/database.js';
import { getEpochTime } from '../utils/epochtime.js';


// API to Create Package as per Product 
// const createBasicPackage = async (req, res) => {
//     try {
//         const { package_Name} = req.body;                            // input fields
        
//         if ( !package_Name ) {                           // validate fields
//             return res.status(400).send({ status: false, message: "Please provide all package details" });
//         }

//         const postClientQuery = `CALL postBasicPackage(?,?,?)`;                                                      // Call stored procedure with parameters
        
//         console.log(package_Name)
       
//         const admin_Id = req.user.adminId;
//         const CreatedAt = getEpochTime()
//         const result = await query(postClientQuery, [package_Name,admin_Id,CreatedAt]);



//         // console.log(result)                                        // debug                                                                        //debug

//         return res.status(201).json({ status: true, message: "Package added successfully.", data: result });

//     } catch (error) {
//         console.error("Error adding package:", error);
//         return res.status(500).json({ status: false, message: "Internal server error." });
//     }
// };
const createBasicPackage = async (req, res) => {
    try {
        const { package_Name } = req.body;

        if (!package_Name) {
            return res.status(400).send({ status: false, message: "Please provide all package details" });
        }

        // Check if package already exists
        const checkQuery = `SELECT * FROM tbl_package1 WHERE package_name = ? AND package_status = 1`;
        const existing = await query(checkQuery, [package_Name]);

        if (existing.length > 0) {
            return res.status(409).send({ status: false, message: "This package already exists." });
        }

        const postClientQuery = `CALL postBasicPackage(?,?,?)`;
        const admin_Id = req.user.adminId;
        const CreatedAt = getEpochTime();
        const result = await query(postClientQuery, [package_Name, admin_Id, CreatedAt]);

        return res.status(201).json({ status: true, message: "Package added successfully.", data: result });

    } catch (error) {
        console.error("Error adding package:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};

const createPackageSp = async (req, res) => {
    try {
        const { product_Id, package_Id, package_Price, pack_Val_Id, max_users, storage_Limit } = req.body;                            // input fields

        if (!product_Id || !package_Id || !package_Price || !pack_Val_Id || !max_users || !storage_Limit) {                           // validate fields
            return res.status(400).send({ status: false, message: "Please provide all package details" });
        }

        // Check if package already exists
        const checkQuery = `SELECT * FROM tbl_product_package1 WHERE pr_product_id = ? AND pr_package_id = ? AND pr_pack_status = 1`;
        const existing = await query(checkQuery, [product_Id,package_Id]);

        if (existing.length > 0) {
            return res.status(409).send({ status: false, message: "This package is already exists." });
        }


        const postClientQuery = `CALL postPackagebyProduct1(?, ?, ?, ?, ?, ?,?,?)`;                                                      // Call stored procedure with parameters
        console.log(product_Id);
        console.log(package_Id)
        console.log(package_Price)
        console.log(pack_Val_Id)
        console.log(max_users)
        console.log(storage_Limit)


        const admin_Id = req.user.adminId;
        const CreatedAt = getEpochTime()
        const result = await query(postClientQuery, [product_Id,package_Id,package_Price,pack_Val_Id,max_users,storage_Limit,admin_Id,CreatedAt]);

        // console.log(result)                                        // debug                                                                        //debug

        return res.status(201).json({ status: true, message: "Package added successfully.", data: result });

    } catch (error) {
        console.error("Error adding package:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};

// Fetch Package  API

// const getPackage = async (req, res) => {
//     try {
//         const {product_Id} = req.params;
        
//         if (!product_Id) {
//             return res.status(400).send({ status: false, message: "Please Select product" });
//         }

//         const examDataQuery = `CALL GetProductPackage1(?)`;
//         const rows = await query(examDataQuery,[product_Id]);

//         // console.log(rows);                                     // debug

//         if (!rows || rows.length === 0) {
//             return res.status(200).json({ status: true, message: "No Package available right now." });
//         }

//         return res.status(200).json({ status: true, data: rows, message: "Package  get successfully." });

//     } catch (error) {
//         console.error("Error fetching exam data:", error);
//         return res.status(500).json({ status: false, message: "Internal server error." });
//     }

// }

const getPackage = async (req, res) => {
    try {
        let { product_Id } = req.params;

        if (!product_Id) {
            return res.status(400).send({ status: false, message: "Please Select product" });
        }

        // Convert 'all' to NULL to pass into the stored procedure
        if (product_Id === 'all') {
            product_Id = null;
        } else {
            product_Id = parseInt(product_Id);
        }

        const examDataQuery = `CALL GetProductPackage2(?)`;
        const [rows] = await query(examDataQuery, [product_Id]); // adjust for mysql2's [rows, fields]

        if (!rows || rows.length === 0) {
            return res.status(200).json({ status: true, message: "No Package available right now." });
        }

        return res.status(200).json({ status: true, data: rows, message: "Package get successfully." });

    } catch (error) {
        console.error("Error fetching exam data:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
}

// Update Package API
// 24-03-2025
// const updatePackage = async (req, res) => {
//     try {
//         const { pack_Id,package_Name,package_Price,max_users,storage_Limit } = req.body;
    
//         // console.log(req.body);                                               // debug
    
//         if (!pack_Id ||!package_Name|| !package_Price|| !max_users|| !storage_Limit) {              //validate  input fields
//             return res.status(400).json({ status: false, message: "Fields are required" });
//         }

//         const updateQuery = 'UPDATE tbl_package SET package_name=?, package_price= ?,package_max_users=?,package_storage_limit=? WHERE package_id=?';
//         const result = await query(updateQuery, [package_Name,package_Price,max_users,storage_Limit,pack_Id]);                            // Update query

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ status: false, message: "Package not found or no changes made" });
//         }

//         return res.status(200).json({ status: true, message: "Package updated successfully" });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ status: false, message: err.message });
//     }

// }
// 24-03-2025

const updatePackage = async (req, res) => {
    try {
        const {product_Id, package_Id, package_Price, max_users, storage_Limit } = req.body;

        if (!product_Id ||!package_Id || !package_Price || !max_users || !storage_Limit) {
            return res.status(400).json({ status: false, message: "Please provide all required package details" });
        }

        const updatePackageQuery = `CALL updatePackage(?, ?, ?, ?, ?, ?,?)`; 

        const updatedBy = req.user.adminId;                  // Assuming adminId is stored in req.user
        const updatedAT = getEpochTime()

        await query(updatePackageQuery, [product_Id,package_Id, package_Price, max_users, storage_Limit,updatedBy,updatedAT]);

        return res.status(200).json({ status: true, message: "Package updated successfully." });

    } catch (error) {
        console.error("Error updating package:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};

//Remove Package API

// const deletePackageData = async (req, res) => {
//     try {
//         const { package_Id } = req.body;

//         if (!package_Id) {
//             return res.status(400).json({ status: false, message: "Package id is required" });
//         }
        
//         const deleteQuery = 'UPDATE tbl_package SET package_status = 0 WHERE package_id = ?';

//         const result = await query(deleteQuery, [package_Id]);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ status: false, message: "Package is not found" });
//         }

//         return res.status(200).json({ status: true, message: "Package deleted successfully" });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ status: false, message: err.message });
//     }

// }


const deletePackageData = async (req, res) => {
    try {
        const { product_Id , package_Id } = req.body;

        if (!product_Id ||!package_Id) {
            return res.status(400).json({ status: false, message: "Product id and Package id are required" });
        }

        const deletePackageQuery = 'CALL deletePackage(?,?,?,?)';
        
        const deletedAt = getEpochTime()                       // Current timestamp
        const admin_Id = req.user.adminId;                     // Deleted by

        const result = await query(deletePackageQuery, [product_Id,package_Id, deletedAt, admin_Id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: false, message: "Package not found" });
        }

        return res.status(200).json({ status: true, message: "Package deleted successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};



export default { createBasicPackage,createPackageSp, getPackage, updatePackage, deletePackageData};
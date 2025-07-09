import { query } from '../utils/database.js';
import jwt from 'jsonwebtoken';
import { getEpochTime } from '../utils/epochtime.js';

// Create Product API
const createProduct = async (req, res) => {
    try {
        const { product_Name, plat_Form, release_Date, website } = req.body;

        if (!product_Name || !plat_Form || !release_Date || !website) {
            return res.status(400).send({ status: false, message: "Please provide all product details" });
        }

        const CheckProductQuery = 'SELECT * FROM tbl_product WHERE product_name = ?';
        const [ExistingProduct] = await query(CheckProductQuery, [product_Name]);

        if (ExistingProduct && ExistingProduct.product_status === 1) {
            return res.status(400).send({ status: false, message: "Product already exists" });
        }

        const CheckWebsiteQuery = 'SELECT * FROM tbl_product WHERE website = ? AND product_name != ?';
        const [ExistingWebsite] = await query(CheckWebsiteQuery, [website, product_Name]);

        if (ExistingWebsite) {
            return res.status(400).send({ status: false, message: "This website URL is already used for another product" });
        }

        const formattedDate = new Date(release_Date).toISOString().split('T')[0];
        const CallSPQuery = 'CALL postProduct(? ,?, ?, ?, ?,?)';

        const admin_Id = req.user.adminId;
        const CreatedAt = getEpochTime();
        const platformIdsJson = JSON.stringify(plat_Form);

        const result = await query(CallSPQuery, [admin_Id, product_Name, formattedDate, website, platformIdsJson, CreatedAt]);

        return res.status(200).send({
            status: true,
            message: "Product added successfully",
            data: result
        });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).send({ status: false, message: err.message });
    }
};

// Fetch Product API
const getProducts = async (req, res) => {
    try {
        const examDataQuery = `CALL GetProduct()`;
        const [rows] = await query(examDataQuery);

        if (!rows || rows.length === 0) {
            return res.status(200).json({ status: true, message: "No Product available right now." });
        }

        return res.status(200).json({ status: true, data: rows, message: "Product get successfully." });

    } catch (error) {
        console.error("Error fetching exam data:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};

// Update Product API
const updateProductSp = async (req, res) => {
    try {
        const { product_Id, product_Name, release_Date, website, platform_Ids } = req.body;

        if (!product_Id || !product_Name || !release_Date || !website || !platform_Ids) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        const platformIdsString = platform_Ids.join(",");
        const updateQuery = 'CALL sp_update_product_platforms( ?, ?, ?, ?, ?,?,?)';
        const admin_Id = req.user.adminId;
        const UpdatedAt = getEpochTime();

        await query(updateQuery, [product_Id, product_Name, release_Date, website, platformIdsString, UpdatedAt, admin_Id]);

        return res.status(200).json({ status: true, message: "Product and platform updated successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

// Delete Product API
const deleteProductData = async (req, res) => {
    try {
        const { product_Id } = req.body;

        if (!product_Id) {
            return res.status(400).json({ status: false, message: "ProductId is required" });
        }

        const deleteProductQuery = 'CALL deleteProduct(?,?,?)';
        const admin_Id = req.user.adminId;
        const deletedAt = getEpochTime();

        const result = await query(deleteProductQuery, [product_Id, admin_Id, deletedAt]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }

        return res.status(200).json({ status: true, message: "Product deleted successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

// 🔐 New: Get Product Category (Dropdown Data)
const getProductCategory = async (req, res) => {
    try {
        const result = await query('SELECT * FROM tbl_product_category WHERE status = 1');
        return res.status(200).json({ status: true, data: result });
    } catch (err) {
        console.error("Dropdown Error:", err);
        return res.status(500).json({ status: false, message: "Failed to fetch product category" });
    }
};

export default {
    getProducts,
    createProduct,
    updateProductSp,
    deleteProductData,
    getProductCategory // <== export this too
};

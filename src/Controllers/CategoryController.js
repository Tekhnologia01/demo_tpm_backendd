import { query } from '../utils/database.js';

// Fetch Product Category API

const getProductList = async (req, res) => {
    try {

        const examDataQuery = `CALL GetProductCategory()`;
        const [rows] = await query(examDataQuery);

        console.log(rows);

        if (!rows || rows.length === 0) {
            return res.status(200).json({ status: true, message: "No Product  available right now." });
        }

        return res.status(200).json({ status: true, data: rows, message: "Products get successfully." });

    } catch (error) {
        console.error("Error fetching exam data:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
}

// Fetch Product PlatForm Category API

const getPlatFormList = async (req, res) => {
    try {

        const examDataQuery = `CALL GetPlatFormCategory()`;
        const [rows] = await query(examDataQuery);

        console.log(rows);

        if (!rows || rows.length === 0) {
            return res.status(200).json({ status: true, message: "No Product  available right now." });
        }

        return res.status(200).json({ status: true, data: rows, message: "Products get successfully." });

    } catch (error) {
        console.error("Error fetching exam data:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
}


// Fetch Package Category API

const getPackageList = async (req, res) => {
    try {
   
        const examDataQuery = `CALL GetPackageCategory()`;
        const [rows] = await query(examDataQuery);

        console.log(rows);

        if (!rows || rows.length === 0) {
            return res.status(200).json({ status: true, message: "No Product  available right now." });
        }

        return res.status(200).json({ status: true, data: rows, message: "Products get successfully." });

    } catch (error) {
        console.error("Error fetching exam data:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
}

// Fetch Package validity Category API's

const getPackageValidityList = async (req, res) => {
    try {
   
        const examDataQuery = `CALL GetPackageValidityCategory()`;
        const [rows] = await query(examDataQuery);

        console.log(rows);

        if (!rows || rows.length === 0) {
            return res.status(200).json({ status: true, message: "No Product  available right now." });
        }

        return res.status(200).json({ status: true, data: rows, message: "Products get successfully." });

    } catch (error) {
        console.error("Error fetching exam data:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
}




export default { getProductList, getPlatFormList,getPackageList,getPackageValidityList };
import { query } from '../utils/database.js';
import { getEpochTime } from '../utils/epochtime.js';


// Fetch Revenue API

const getDashboardMetrics = async (req, res) => {
    try {
        const metricsQuery = `CALL GetDashboardMetrics1();`;
        const [rows] = await query(metricsQuery);
        const row = rows[0]

        // console.log(rows);                                  // debug

        if (!row || row.length === 0) {
            return res.status(200).json({ status: false, message: "No data available right now." });
        }

        return res.status(200).json({
            status: true,
            data: row,                                     // Extracts the result from the first query result set
            message: "Dashboard metrics retrieved successfully."
        });

    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};

// Fetch Monthly Revenue  API

const getMonthlyRevenue = async (req, res) => {
    try {
        const metricsQuery = `CALL GetMonthlyRevenue1();`;

        const [rows] = await query(metricsQuery);

        // console.log(rows);                              // debug

        if (!rows || rows.length === 0) {
            return res.status(200).json({ status: true, message: "No revenue data available." });
        }

        return res.status(200).json({
            status: true,
            data: rows,                                  // Extract the result set
            message: "Monthly revenue retrieved successfully."
        });

    } catch (error) {
        console.error("Error fetching monthly revenue:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};

// Fetch Monthly Enquiry API

const getMonthlyEnquiries = async (req, res) => {
    try {
        const metricsQuery = `CALL GetMonthlyEnquiries();`;
        const [rows] = await query(metricsQuery);

        // console.log(rows);                                //debug

        if (!rows || rows.length === 0) {
            return res.status(200).json({ status: true, message: "No enquiry data available." });
        }

        return res.status(200).json({
            status: true,
            data: rows,  // Extract the result set
            message: "Monthly enquiry count retrieved successfully."
        });

    } catch (error) {
        console.error("Error fetching monthly enquiries:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};

// Fetch ActiveInactiveClient API

const getClientStatusPercentage = async (req, res) => {
    try {
        const metricsQuery = `CALL GetClientStatusPercentage();`;
        const [rows] = await query(metricsQuery);

        // console.log(rows);                                             // debug

        if (!rows || rows.length === 0) {
            return res.status(200).json({ status: true, message: "No client data available." });
        }

        return res.status(200).json({
            status: true,
            data: rows,                                                  // Extract the result set
            message: "Client status percentage retrieved successfully."
        });

    } catch (error) {
        console.error("Error fetching client status percentage:", error);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};


export default {getDashboardMetrics,getMonthlyRevenue,getMonthlyEnquiries,getClientStatusPercentage}
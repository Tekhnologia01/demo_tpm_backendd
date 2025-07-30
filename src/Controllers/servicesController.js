import { query } from '../utils/database.js';
import { getEpochTime } from '../utils/epochtime.js';


const createService = async (req, res) => {
    try {
        const { service_name } = req.body;

        if (!service_name ) {
            return res.status(400).send({ status: false, message: "Please provide service name"});
        }

        const createServiceQuery = 'CALL PostService(?, ?)';
       
        const CreatedAt = getEpochTime();                              // created at 
        const result = await query(createServiceQuery, [
            service_name, CreatedAt
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: false, message: "Service not added or no changes made" });
        }

        return res.status(200).send({ status: true, data: result.InsertedID, message: "Services Added Successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, message: err.message });
    }
};








export default {createService}


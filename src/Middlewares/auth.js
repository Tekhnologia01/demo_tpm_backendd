// import express from 'express';
// import jwt from 'jsonwebtoken';
// import { query } from '../utils/database.js';

// const authRouter = express.Router();

// const authentication = async (req, res, next) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) return res.status(400).send({ status: false, message: "Please provide a Bearer Token" });

//         if (token.startsWith("Bearer ")) {
//             token = token.substring(7, token.length);
//         }

//         jwt.verify(token, "ProductMnagementGroup24", (err, decode) => {
//             if (err) {
//                 let msg = err.message === "jwt expired" ? "Token is expired" : "Token is Invalid";
//                 return res.status(400).send({ status: false, message: msg });
//             }
//             req.pass = decode;
//             next();
//         });
//     } catch (error) {
//         return res.status(500).send({ status: false, error: error.message });
//     }
// };

// export { authRouter, authentication };


// const crypto = require("crypto");
import CryptoJS from "crypto-js";


// Function to generate an RSA key pair
function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });

    return { publicKey, privateKey };
}

// Function to read messages from Chrome extension
function readMessage() {
    return new Promise((resolve, reject) => {
        let input = "";
        process.stdin.on("data", chunk => { input += chunk; });
        process.stdin.on("end", () => {
            try {
                let message = JSON.parse(input);
                resolve(message);
            } catch (error) {
                reject(error);
            }
        });
    });
}

// Function to send a message back to Chrome
function sendMessage(message) {
    const jsonString = JSON.stringify(message);
    const messageLength = Buffer.byteLength(jsonString);
    process.stdout.write(Buffer.from([messageLength, 0, 0, 0]));
    process.stdout.write(jsonString);
}

// Main function to handle messages from Chrome
async function handleRequest() {
    try {
        const request = await readMessage();
        if (request.action === "generate_key") {
            const { publicKey } = generateKeyPair();
            sendMessage({ key: publicKey });
        }
    } catch (error) {
        sendMessage({ error: error.message });
    }
}

handleRequest();

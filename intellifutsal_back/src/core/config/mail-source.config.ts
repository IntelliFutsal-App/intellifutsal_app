import * as dotenv from "dotenv";


dotenv.config();

export const MailDataSource = {
    host: process.env.SMTP_HOST || "",
    port: parseInt(process.env.SMTP_PORT || ""),
    secure: process.env.SMTP_PORT === "465",
    auth: {
        user: process.env.SMTP_USERNAME || "",
        pass: process.env.SMTP_PASSWORD || ""
    },
    tls: {
        rejectUnauthorized: false 
    },
    requireTLS: true, 
    connectionTimeout: 60000, 
    greetingTimeout: 30000, 
    socketTimeout: 60000 
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
var nodemailer_1 = require("nodemailer");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var config = function () {
    return {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    };
};
exports.transporter = nodemailer_1.default.createTransport(config());

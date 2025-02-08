"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var generateJWT = function (payload) {
    var token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '180d' });
    return token;
};
exports.generateJWT = generateJWT;

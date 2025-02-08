"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var tokenSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        expires: "10m"
    },
});
var Token = mongoose_1.default.model('Token', tokenSchema);
exports.default = Token;

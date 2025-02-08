"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
var generateToken = function () { return Math.floor(100000 + Math.random() * 900000).toString(); };
exports.generateToken = generateToken;

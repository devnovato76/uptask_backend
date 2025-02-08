"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("colors");
var server_ts_1 = require("./server.ts");
var port = process.env.PORT || 4000;
server_ts_1.default.listen(port, function () { return console.log(colors_1.default.cyan.bold("REST API funcionando en http://localhost:".concat(port))); });

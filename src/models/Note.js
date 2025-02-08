"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var NoteSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    createBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    task: {
        type: mongoose_1.Types.ObjectId,
        ref: "Task",
        required: true,
    },
}, { timestamps: true });
var Note = mongoose_1.default.model('Note', NoteSchema);
exports.default = Note;

import mongoose from "mongoose";

export const CodeSchema = mongoose.Schema({
    language: {
        type: String,
        required: true,
        enum: ["cpp", "py", "java", "c"],
    },
    filepath: {
        type: String,
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    startedAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "success", "error"],
    },
    output: {
        type: String,
    },
});

const CodeFile = mongoose.model('CodeFile', CodeSchema);
export default CodeFile;
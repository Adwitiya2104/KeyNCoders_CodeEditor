// import mongoose from "mongoose";

// export const CourseSchema = mongoose.Schema({
//     C_id: {
//         type: String,
//         required: true,
//         enum: ["cpp", "py", "java", "c"],
//     },
//     C_title: {
//         type: String,
//         required: true,
//     },
//     C_description:{
//         type: String,
//         required: true,
//         min: 10,
//         max: 300,
//     },
//     createdBy: {
//         type: String,
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
//     completedAt: {
//         type: Date,
//     },
//     status: {
//         type: String,
//         default: "pending",
//         enum: ["pending", "success", "error"],
//     },
//     output: {
//         type: String,
//     },
// });

// const Course = mongoose.model('Course', CourseSchema);
// export default Course;
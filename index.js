import express from 'express';
import { generateFile } from './CompilerFiles/generateFiles.js';
import { executeCpp } from './CompilerFiles/execCpp.js';
import { executePy } from './CompilerFiles/execPy.js';
import { executeC } from './CompilerFiles/execC.js';
import { executeJava } from './CompilerFiles/execJava.js';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import CodeFile from './models/CodeFile.js';

config();

const app = express();

app.use(cors());

// json parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    return res.end("Hello, world!");
});

app.get("/status", async (req, res) => {
    const codeId = req.query.id;

    if (!codeId) {
        res.status(400).json({ success: false, error: "missing id query param" })
    }
    try {
        const codeDoc = await CodeFile.findById(codeId);
        console.log(codeDoc);
        if (!codeDoc) {
            return res.status(404).json({ success: false, error: "Code File not Found. Probably wrong param query Id" })
        }
        return res.status(200).json({ success: true, codeDoc })

    } catch (err) {
        return res.status(400).json({ success: false, error: JSON.stringify(err) })
    }

})

app.post("/run", async (req, res) => {
    const { language, code } = req.body;
    if (code === undefined) return res.status(400).json({ success: false, error: "empty code body" });

    let newCode;

    try {
        const filePath = await generateFile(language, code);
        // console.log("file Path: ", filePath);

        newCode = new CodeFile({ language, filepath: filePath });
        const codeId = newCode["_id"];
        const saveCode = await newCode.save();

        console.log(newCode);
        // console.log(codeId);

        res.status(201).json({ success: true, codeId });

        let output;
        newCode["startedAt"] = new Date();

        switch (language) {
            case "cpp":
                output = await executeCpp(filePath);
                break;
            case "py":
                output = await executePy(filePath);
                break;
            case "java":
                output = await executeJava(filePath);
                break;
            case "c":
                output = await executeC(filePath);
                break;
            default:
            // return res.status(400).json({ success: false, error: "Unsupported language" });
        }
        newCode["completedAt"] = new Date();
        newCode["status"] = "success";
        newCode["output"] = output;

        const savedCode = await newCode.save();
        console.log("Saved code:", savedCode);

        console.log({ filePath, output });
        // return res.json({ filePath, output });

    } catch (err) {
        newCode["completedAt"] = new Date();
        newCode["status"] = "error";
        newCode["output"] = JSON.stringify(err);
        const savedCode = await newCode.save();
        console.log(savedCode);
        // console.log(err.message);
        // res.status(500).json({ "err": err.message });
    }
});


mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Server running at ${process.env.PORT}.`))

    }).catch((error) => console.log(`${error} did not connect`))

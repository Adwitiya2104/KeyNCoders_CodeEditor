const express = require("express");
const { generateFile } = require("./generateFiles");
const { executeCpp } = require("./execCpp"); 

const app = express();

app.get("/", (req,res) => {
    return res.end("Hello, world!");
});

app.post("/run", async (req,res) => {
    const { language = "cpp", code } = res.body;
    if (code === undefined) return res.status(400).json({ success: false, error: "empty code body" });

    try {
        const filePath = await generateFile(language, code);
        const output = await executeCpp(filePath);
    } catch (err) {
        res.status(500).json({ err });
    }

    return res.json({ filePath, output });
});

app.listen(5000, () => {
    console.log("Listening on 5000");
});
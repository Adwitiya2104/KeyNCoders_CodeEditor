const { exec } = require("child_process");
const fs = require("fs");

const outPath = path.join(__dirname, "outputs");
if(!fs.existsSync(outPath)){
    fs.mkdirSync(outPath, { recursive: true });
}

const executeCpp = async (filePath) => {
    const jobID = path.basename(filePath).split(".")[0];
    const oPath = path.join(outPath,`${jobID}.out`);

    return new Promise = (resolve, reject) => {
        exec(`g++ ${filePath} -o ${oPath} && cd ${outPath} && ./${jobID}.out`);
        (error, stdout, stderr) => {
            error && reject ({error, stderr});
            stderr && reject (stderr);

            resolve(stdout);
        }
    }
};

module.exports = {
    executeCpp,
};
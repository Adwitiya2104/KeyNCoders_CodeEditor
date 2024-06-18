import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath, { recursive: true });
}

export const executePy = async (filePath) => {
    const jobID = path.basename(filePath).split(".")[0];
    const oPath = path.join(outPath, `${jobID}.py`);

    console.log(jobID, oPath);

    return new Promise((resolve, reject) => {
        exec(`python ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                return reject({ error, stderr });
            }
            if (stderr) {
                console.log(stderr);
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
};


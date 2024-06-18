import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath, { recursive: true });
}

export const executeC = async (filePath) => {
    const jobID = path.basename(filePath).split(".")[0];
    const oPath = path.join(outPath, `${jobID}.out`);

    console.log(jobID, oPath);

    return new Promise((resolve, reject) => {
        exec(`gcc ${filePath} -o ${oPath} && ${oPath}`, (error, stdout, stderr) => {
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


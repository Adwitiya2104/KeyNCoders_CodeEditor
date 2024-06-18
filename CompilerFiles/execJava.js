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

export const executeJava = async (filePath) => {
    try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const classNameMatch = fileContent.match(/public\s+class\s+(\w+)/);
        if (!classNameMatch) {
            throw new Error("No public class found in the file");
        }

        const className = classNameMatch[1];
        const newFilePath = path.join(path.dirname(filePath), `${className}.java`);

        // Rename the file to match the public class name
        fs.renameSync(filePath, newFilePath);

        return new Promise((resolve, reject) => {
            exec(`javac ${newFilePath} -d ${outPath} && java -cp ${outPath} ${className}`, (error, stdout, stderr) => {
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
    } catch (error) {
        return Promise.reject(error);
    }
};


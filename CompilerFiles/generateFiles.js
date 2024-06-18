import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

export const generateFile = async (format, code) => {
    const jobID = uuid();
    const fileName = `${jobID}.${format}`;
    const filePath = path.join(dirCodes, fileName);

    await fs.writeFileSync(filePath, code);
    return filePath;
};


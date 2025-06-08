import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, '.eslintrc.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export default config;

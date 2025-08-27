import { log } from 'console';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://192.168.0.107:8001';

/**
 * Returns the full HTTP URL of a file if it exists in local storage, else null.
 * @param {string} relativePath - Path relative to storage folder (e.g., 'profile/filename.jpg')
 * @returns {string|null} Full URL if file exists, otherwise null
 */
export function getImageUrlIfExists(relativePath, folder) {
    const STORAGE_PATH = path.join(process.cwd(), `src/${folder}`);
    if (!relativePath) return null;

    const fullPath = path.join(STORAGE_PATH, relativePath);

    try {
        if (fs.existsSync(fullPath)) {
            const urlPath = relativePath.replace(/\\/g, '/');
            return `${BASE_URL}/${folder}/${urlPath}`;
        }
        return null;
    } catch (error) {
        console.error('Error checking file existence:', error);
        return null;
    }
}

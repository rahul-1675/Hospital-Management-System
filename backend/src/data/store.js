import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialData } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

class Store {
    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        try {
            if (fs.existsSync(DB_FILE)) {
                const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
                return JSON.parse(fileContent);
            }
        } catch (err) {
            console.error('Error reading db.json, initializing from default seed data:', err.message);
        }
        this.saveData(initialData);
        return JSON.parse(JSON.stringify(initialData));
    }

    saveData(dataToSave) {
        try {
            fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
        } catch (err) {
            console.error('Error saving db.json:', err.message);
        }
    }

    get(collection) {
        return this.data[collection];
    }

    set(collection, value) {
        this.data[collection] = value;
        this.saveData();
        return this.data[collection];
    }

    update(collection, updaterFn) {
        this.data[collection] = updaterFn(this.data[collection]);
        this.saveData();
        return this.data[collection];
    }
}

export const db = new Store();

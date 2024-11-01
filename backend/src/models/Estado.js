import { openDb } from "../config/configDB.js";

export async function createTableEstado() {
    openDb().then(db => {
        db.exec(`
            CREATE TABLE IF NOT EXISTS estado (
                id INTEGER PRIMARY KEY, 
                sigla TEXT, 
                nome TEXT
            );
        `);
    })
}
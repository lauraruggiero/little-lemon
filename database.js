import * as SQLite from 'expo-sqlite';

// The modern API approach
const getDb = async () => await SQLite.openDatabaseAsync('little_lemon');

export async function createTable() {
    const db = await getDb();
    
    // TEMPORARY: Keep this uncommented for ONE run to wipe the broken table!
    //await db.execAsync('DROP TABLE IF EXISTS menu;');
    
    // FIXED: Added "category TEXT" at the end of this string!
    await db.execAsync(
        'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY NOT NULL, name TEXT, price REAL, description TEXT, image TEXT, category TEXT);'
    );
}

export async function getMenuItems() {
    const db = await getDb();
    return await db.getAllAsync('SELECT * FROM menu');
}

export async function saveMenuItems(menuItems) {
    const db = await getDb();
    for (const item of menuItems) {
        await db.runAsync(
            'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
            item.name, item.price, item.description, item.image, item.category
        );
    }
}

export async function filterByQueryAndCategories(query, activeCategories) {
    const db = await getDb();
    
    const placeholders = activeCategories.map(() => '?').join(',');
    const sql = `SELECT * FROM menu WHERE name LIKE ? AND category IN (${placeholders})`;
    const params = [`%${query}%`, ...activeCategories];
    
    return await db.getAllAsync(sql, ...params);
}
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

export class DatabaseService {
    private db: Database | null = null;

    async initialize() {
        const dbPath = path.join(__dirname, '../../data/smartcart.db');
        
        // Ensure data directory exists
        const dataDir = path.dirname(dbPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        this.db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        // Read and execute schema
        const schema = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
        await this.db.exec(schema);

        // Check if database is empty
        const count = await this.db.get('SELECT COUNT(*) as count FROM products');
        if (count.count === 0) {
            // Read and execute seed data
            const seed = fs.readFileSync(path.join(__dirname, '../database/seed.sql'), 'utf8');
            await this.db.exec(seed);
        }
    }

    async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
        if (!this.db) throw new Error('Database not initialized');
        return this.db.all<T[]>(sql, params);
    }

    async getOne<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
        if (!this.db) throw new Error('Database not initialized');
        return this.db.get<T>(sql, params);
    }

    async run(sql: string, params: any[] = []): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.run(sql, params);
    }
}

export const db = new DatabaseService(); 
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const initDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'postgres', // Connect to default database first
        password: process.env.DB_PASSWORD || 'your_password',
        port: parseInt(process.env.DB_PORT || '5432'),
    });
    try {
        // Read and execute the database setup SQL file
        const dbSetupFile = path_1.default.join(__dirname, 'database.sql');
        const dbSetupSql = fs_1.default.readFileSync(dbSetupFile, 'utf8');
        // Read and execute the seed data SQL file
        const seedDataFile = path_1.default.join(__dirname, 'seed-data.sql');
        const seedDataSql = fs_1.default.readFileSync(seedDataFile, 'utf8');
        // Combine both SQL files
        const combinedSql = dbSetupSql + '\n' + seedDataSql;
        // Split the SQL file into individual statements
        const statements = combinedSql
            .split(';')
            .filter(statement => statement.trim() !== '');
        // Execute each statement
        for (const statement of statements) {
            yield pool.query(statement);
        }
        console.log('Database initialized successfully with seed data');
    }
    catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
    finally {
        yield pool.end();
    }
});
// Run the initialization if this file is executed directly
if (require.main === module) {
    initDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
exports.default = initDatabase;

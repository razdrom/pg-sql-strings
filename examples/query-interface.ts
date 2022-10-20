import { Pool } from 'pg'
import {Statement} from "../lib";

// create postgres pool
const pool = new Pool({
    connectionString: 'postgres://user:pass@localhost:5432/database'
});

// prepare your own query interface
export async function query<T>(statement: Statement) {
    const { rows, rowCount } = await pool.query<T>(statement);
    return [rows, rowCount];
}

// prepare your own transaction interface
export async function transaction() {
    const connection = await pool.connect();
    return {
        begin: () => connection.query('BEGIN'),
        commit: () => connection.query('COMMIT'),
        rollback: () => connection.query('ROLLBACK'),
        release: () => connection.release(),
        query: async <T>(statement: Statement) => {
            const { rows, rowCount } = await connection.query<T>(statement);
            return [rows, rowCount];
        },
    };
}
# Postgres parametrized query builder

## Usage:

#### At first, let`s create simple wrapper, that provides convenient query interface
```typescript
// create postgres pool
import { Statement } from "pg-sql-strings";

const pool = new Pool({
    connectionString: 'postgres://user:pass@localhost:5432/db'
});

// prepare your own query interface
async function query<T>(statement: Statement) {
    const { rows, rowCount } = await pool.query<T>(statement);
    return [rows, rowCount];
}

// also, we can create handy interface to interact with transactions
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
```

#### Simple statement:
```typescript
import { sql } from "pg-sql-strings";

const number = 99
const statement = sql`SELECT 1 + ${number} AS sum`

const [rows] = await query(statement)
console.log(rows) // returns [ { sum: 100 } ]

```

#### Append statement:
```typescript
import { sql, query } from "pg-sql-strings";
const params = { age: 18 }

const statement = sql`SELECT name, age FROM users`

if (params.age) {
    statement.append(sql`WHERE age > ${params.age}`)
}

const [rows] = await query(statement)
console.log(rows) // returns [ { name: 'Mary', age: 39 }, { name: 'Ingvar', age: 27 } ]
```

#### Join statement:
```typescript
import { sql, transaction } from "pg-sql-strings";

const params = { age: 18, name: 'Lo' }

const statement = sql`SELECT name, age FROM users`
const conditions = []

if (params.age) {
    conditions.push(sql`age > ${params.age}`)
}

if (params.name) {
    conditions.push(sql`name iLike ${params.name + '%'}`)
}

if (conditions.length) {
    statement.append(sql`WHERE`)
    statement.join(conditions, 'AND')
}

const [rows] = await query(statement)
console.log(rows) // returns [ { name: 'Lotar', age: 19 } ]
```

#### Transactional statement:
```typescript
import { sql, transaction } from "pg-sql-strings";

const { begin, rollback, release, query } = await transaction()

try {
    await begin()
    const params = {
        id: 1,
        age: 30
    }
    const statement = sql`UPDATE users SET age = ${params.age}`

    if (params.id) {
        statement.append(sql`WHERE id = ${params.id}`)
    }

    statement.append(sql`RETURNING *`)

    const [rows] = await query(statement)
    console.log(rows) // returns [ { id: 1, name: 'John', age: 30 } ]
} catch (error) {
    // handle error
    await rollback()
} finally {
    await release()
}
```
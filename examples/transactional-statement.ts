import { transaction } from "./query-interface";
import { sql } from "../lib";

async function run() {
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
}

run().catch()
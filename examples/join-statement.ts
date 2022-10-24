import { query } from "./query-interface";
import {sql} from "../lib";

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

query(statement).then(([rows]) => {
    console.log(rows) // returns [ { name: 'Mary', age: 39 }, { name: 'Ingvar', age: 27 } ]
})
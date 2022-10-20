import { query } from "./query-interface";
import {sql} from "../lib";

const params = { age: 18 }

const statement = sql`SELECT name, age FROM users`

if (params.age) {
    statement.append(sql`WHERE age > ${params.age}`)
}

query(statement).then(([rows]) => {
    console.log(rows) // returns [ { name: 'Mary', age: 39 }, { name: 'Ingvar', age: 27 } ]
})
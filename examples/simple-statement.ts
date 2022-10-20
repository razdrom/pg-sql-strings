import { query } from "./query-interface";
import { sql } from "../";


const number = 99
const statement = sql`SELECT 1 + ${number} AS sum`

query(statement).then(([rows]) => {
    console.log(rows) // returns [ { sum: 100 } ]
})
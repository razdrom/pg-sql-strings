import {Statement} from "./statement";

export function sql(strings, ...args) {
    return new Statement(strings, args);
}
export class Statement {
    parts = []; // statement parts
    replacements = []; // parametrized query values

    constructor(private strings: string[], private args: any[]) {
        this.parts.push(strings);
        this.replacements.push(args);
    }

    // returns parametrized sql
    get text(): string {
        for (let p = 0, n = 0; p < this.parts.length; p++) {
            const part = this.parts[p];
            this.parts[p] = part
                .map((element, i) => {
                    if (i < part.length - 1) {
                        n++;
                        element += '$' + n;
                    }
                    return element;
                })
                .join('');
        }

        return this.parts.join(' ');
    }

    // returns parametrized query arguments
    get values(): any[] {
        return this.replacements.flat();
    }

    // appends statement to current statement
    public append(statement: Statement) {
        this.parts.push(statement.strings);
        this.replacements.push(statement.args);
    }

    // join statements with separator
    public join(statements: Statement[], separator: string) {
        for (const [index, statement] of statements.entries()) {
            // Add statement
            this.parts.push(statement.strings);
            this.replacements.push(statement.args);

            // Add separator
            if (statements.length - 1 !== index) {
                this.parts.push([separator]);
                this.replacements.push([]);
            }
        }
    }
}
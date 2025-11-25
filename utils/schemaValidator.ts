import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";

const SCHEMA_BASE_PATH = path.resolve("schemas");

class SchemaValidator {
    private ajv: Ajv;
    private initialized = false;

    constructor() {
        this.ajv = new Ajv({ allErrors: true });
        addFormats(this.ajv);
    }

    private loadAllSchemas(): void {
        if (this.initialized) return;

        const files = fs.readdirSync(SCHEMA_BASE_PATH);

        for (const file of files) {
            if (file.endsWith(".json")) {
                const schemaPath = path.join(SCHEMA_BASE_PATH, file);
                const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
                this.ajv.addSchema(schema, file);
            }
        }

        this.initialized = true;
    }

    public validate(schemaName: string, data: unknown): { valid: boolean; errors: string | null } {
        this.loadAllSchemas();

        const validate: ValidateFunction | undefined = this.ajv.getSchema(schemaName);

        if (!validate) {
            throw new Error(`Schema "${schemaName}" not found in ${SCHEMA_BASE_PATH}`);
        }

        const valid = validate(data);

        return {
            valid: !!valid,
            errors: valid ? null : JSON.stringify(validate.errors, null, 2)
        };
    }
}

export default new SchemaValidator();
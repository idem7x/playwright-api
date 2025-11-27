export const Schema = {
    USER : "userSchema.json",
    USERS : "usersSchema.json",
    ERROR : "errorSchema.json"
} as const;

export type Schema = typeof Schema[keyof typeof Schema];

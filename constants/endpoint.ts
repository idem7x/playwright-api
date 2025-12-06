export const  Endpoint = {
    USERS : "/users",
    POSTS : "/posts",
    COMMENTS : "/comments",
    TODOS : "/todos",
} as const;

export type Endpoint = typeof Endpoint[keyof typeof Endpoint];
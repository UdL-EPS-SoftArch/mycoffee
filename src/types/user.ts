import { Resource } from "halfred";

// Entity fields
export interface UserEntity {
    id?: number;
    username: string;
    email?: string;
    password?: string;
}

// Combine with HAL Resource
export type User = UserEntity & Resource;

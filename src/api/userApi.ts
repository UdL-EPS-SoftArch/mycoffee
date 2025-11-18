import {fetchHal, mergeHal, mergeHalArray, postHal} from "./halClient";
import {User} from "@/types/user";

export async function getUsers(): Promise<User[]> {
    const resource = await fetchHal("/users");
    const embedded = resource.embeddedArray("users") || [];
    return mergeHalArray<User>(embedded);
}

export async function getUserById(id: string): Promise<User> {
    const resource = await fetchHal(`/users/${id}`);
    return mergeHal<User>(resource);
}

export async function createUser(user: User): Promise<User> {
    const resource = await postHal('/users', user);
    return mergeHal<User>(resource);
}

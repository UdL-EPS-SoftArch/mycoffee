import { getHal, mergeHal, mergeHalArray, postHal } from '@/lib/halClient';
import type { AuthProvider } from "@/lib/authProvider";
import { User } from "@/types/user";

export class UsersService {
    constructor(private authProvider: AuthProvider) {
    }

    async getUsers(): Promise<User[]> {
        const resource = await getHal('/users', this.authProvider);
        const embedded = resource.embeddedArray('users') || [];
        return mergeHalArray<User>(embedded);
    }

    async getUserById(id: string): Promise<User> {
        const resource = await getHal(`/users/${id}`, this.authProvider);
        return mergeHal<User>(resource);
    }

    async getCurrentUser(): Promise<User|null> {
        if (!await this.authProvider.getAuth()) {
            return null;
        }
        const resource = await getHal('/identity', this.authProvider);
        return mergeHal<User>(resource);
    }

    async createUser(user: User): Promise<User> {
        const resource = await postHal('/users', user, this.authProvider);
        return mergeHal<User>(resource);
    }
}

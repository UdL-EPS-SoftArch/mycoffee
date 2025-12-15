import { Resource } from "halfred";
import { UserEntity } from '@/types/user';

export interface CustomerEntity extends UserEntity {
    name: string;
    phoneNumber: string;
}

export type Customer = CustomerEntity & Resource;

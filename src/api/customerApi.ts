import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import {Customer, CustomerEntity} from "@/types/customer";

export class CustomerService {
    constructor(private readonly authProvider: AuthProvider) {
    }

    async getCustomers(): Promise<Customer[]> {
        const resource = await getHal('/customers', this.authProvider);
        const embedded = resource.embeddedArray('customers') || [];
        return mergeHalArray<Customer>(embedded);
    }

    //  Acepta CustomerEntity en lugar de Customer
    async createCustomer(customer: Omit<CustomerEntity, 'uri'>): Promise<Customer> {
        const resource = await postHal('/customers/register/', customer as any, this.authProvider);
        return mergeHal<Customer>(resource);
    }

    //  Acepta Partial<CustomerEntity> en lugar de Partial<Customer>
    async updateCustomer(id: string, customer: Partial<CustomerEntity>): Promise<Customer> {
        const resource = await postHal(`/customers/${id}`, customer as any, this.authProvider);
        return mergeHal<Customer>(resource);
    }

    async getCustomerById(id: string): Promise<Customer> {
        const resource = await getHal(`/customers/${id}`, this.authProvider);
        return mergeHal<Customer>(resource);
    }

    // Acepta credenciales simples
    async loginCustomer(email: string, password: string): Promise<Customer> {
        const resource = await postHal('/customers/login', { email, password }as any, this.authProvider);
        return mergeHal<Customer>(resource);
    }

    async getCustomerByPhoneNumber(phone: string): Promise<Customer[]> {
        const resource = await getHal(
            `/customers/search/findByPhoneNumber?phone=${encodeURIComponent(phone)}`,
            this.authProvider
        );
        const embedded = resource.embeddedArray('customers') || [];
        return mergeHalArray<Customer>(embedded);
    }
    async getCustomerByName(name: string): Promise<Customer[]> {
        const resource = await getHal(
            `/customers/search/findByName?name=${encodeURIComponent(name)}`,
            this.authProvider
        );
        const embedded = resource.embeddedArray('customers') || [];
        return mergeHalArray<Customer>(embedded);
    }

    async getCustomerRelation<T>(customer: Customer, relation: string): Promise<T>
    {
        const link = customer.link(relation);
        if (!link?.href) {
            throw new Error(`Relación '${relation}' no encontrada en Customer`);
        }
        const resource = await getHal(link.href, this.authProvider);
        return mergeHal<T>(resource);
    }

}
import { getHal, mergeHal, mergeHalArray, postHal } from '@/lib/halClient';
import type { AuthProvider } from "@/lib/authProvider";
import { Record } from "@/types/record";
import { User } from "@/types/user";

export class RecordService {
    constructor(private authProvider: AuthProvider) {
    }

    async getRecords(): Promise<Record[]> {
        const resource = await getHal('/records', this.authProvider);
        const embedded = resource.embeddedArray('records') || [];
        return mergeHalArray<Record>(embedded);
    }

    async getRecordById(id: string): Promise<Record> {
        const resource = await getHal(`/records/${id}`, this.authProvider);
        return mergeHal<Record>(resource);
    }

    async getRecordsByOwnedBy(owner: User): Promise<Record[]> {
        try {
            // Construir la URI completa si solo tienes la parte relativa
            const userUri = owner.uri?.startsWith('http')
                ? owner.uri
                : `http://localhost:8080${owner.uri}`;

            console.log('🔍 Fetching records for user URI:', userUri);

            const resource = await getHal(
                `/records/search/findByOwnedBy?user=${encodeURIComponent(userUri)}`,
                this.authProvider
            );

            const embedded = resource.embeddedArray('records') || [];
            return mergeHalArray<Record>(embedded);
        } catch (error) {
            console.error('❌ Error fetching records:', error);
            // Retornar array vacío en lugar de lanzar error
            return [];
        }
    }

    async createRecord(record: Record): Promise<Record> {
        const resource = await postHal('/records', record, this.authProvider);
        return mergeHal<Record>(resource);
    }

    async getRecordRelation<T>(record: Record, relation: string): Promise<T> {
        const resource = await getHal(record.link(relation).href, this.authProvider);
        return mergeHal<T>(resource);
    }
}

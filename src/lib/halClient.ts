import halfred, { Resource } from "halfred";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://127.0.0.1:8080";

export function mergeHal<T>(obj: Resource): (T & Resource) {
    return Object.assign(obj, halfred.parse(obj)) as T & Resource;
}

export function mergeHalArray<T>(objs: Resource[]): (T & Resource)[] {
    return objs.map(o => Object.assign(o, halfred.parse(o)) as T & Resource);
}

export async function getHal(path: string, authProvider: { getAuth: () => Promise<string | null> }) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();
    const res = await fetch(url, {
        headers: {
            "Accept": "application/hal+json",
            ...(authorization ? { Authorization: authorization } : {}),
        },
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} fetching ${url}`);
    }
    return halfred.parse(await res.json());
}

export async function postHal(path: string, body: Resource, authProvider: { getAuth: () => Promise<string | null> }) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/hal+json",
            ...(authorization ? { Authorization: authorization } : {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("BACKEND ERROR:", errorText);
        throw new Error(`HTTP ${res.status} posting. Details: ${errorText}`);
    }

    return halfred.parse(await res.json());
}

export async function patchHal(path: string, body: any, authProvider: { getAuth: () => Promise<string | null> }) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();

    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/hal+json",
            ...(authorization ? { Authorization: authorization } : {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("BACKEND ERROR:", errorText);
        throw new Error(`HTTP ${res.status} patching. Details: ${errorText}`);
    }

    return halfred.parse(await res.json());
}

export async function deleteHal(path: string, authProvider: { getAuth: () => Promise<string | null> }) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const authorization = await authProvider.getAuth();

    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Accept": "application/hal+json",
            ...(authorization ? { Authorization: authorization } : {}),
        },
        cache: "no-store",
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("BACKEND ERROR:", errorText);
        throw new Error(`HTTP ${res.status} deleting. Details: ${errorText}`);
    }
    if (res.status === 204) return null;
    return halfred.parse(await res.json());
}

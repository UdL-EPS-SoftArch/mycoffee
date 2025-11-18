import halfred, {Resource} from "halfred";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

export function mergeHal<T>(obj: Resource): (T & Resource) {
    return Object.assign(obj, halfred.parse(obj)) as T & Resource;
}

export function mergeHalArray<T>(objs: Resource[]): (T & Resource)[] {
    return objs.map(o => Object.assign(o, halfred.parse(o)) as T & Resource);
}

export async function fetchHal(path: string, options: RequestInit = {}) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

    const res = await fetch(url, {
        ...options,
        headers: { Accept: "application/hal+json", ...options.headers },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} fetching ${url}`);
    }

    return halfred.parse(await res.json());
}

export async function postHal(path: string, body: Resource, options: RequestInit = {}) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

    const res = await fetch(url, {
        method: "POST",
        ...options,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/hal+json",
            ...options.headers
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} posting ${JSON.stringify(body)}`)
    }

    return halfred.parse(await res.json());
}

declare module 'halfred' {
    export interface Link {
        href: string;
        name?: string;
        title?: string;
        templated?: boolean;
    }

    export interface Resource {
        allLinkArrays(): { [key: string]: Link[] };
        allLinks(): { [key: string]: Link[] | Link };
        link(rel: string): Link;
        linkArray(rel: string): Link[];
        embedded(key: string): Resource | null;
        embeddedArray(key: string): Resource[] | null;
        original(): any;
        [key: string]: any;
    }

    export function parse(object: any): Resource;
}
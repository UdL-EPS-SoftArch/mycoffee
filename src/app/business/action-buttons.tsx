"use client";

import Link from "next/link";
import { useAuth } from "@/app/components/authentication";

// --- BOTÓN DE CREAR ---
// (Opcional: decide si un dueño de negocio puede crear más o no)
export function CreateBusinessButton() {
    // 👇 SIMULACIÓN: Usuario "juan_cafes" con rol de negocio
    const user = {
        username: "juan_cafes",
        authorities: [{ authority: "ROLE_BUSINESS" }]
    };

    // Aquí puedes decidir: ¿Solo ADMIN crea? ¿O BUSINESS también?
    // Si quieres que el Business pueda crear, añade "ROLE_BUSINESS" al array.
    const canCreate = user?.authorities?.some(
        a => ["ROLE_ADMIN", "ROLE_BUSINESS"].includes(a.authority)
    );

    if (!canCreate) return null;

    return (
        <Link
            href="/business/new"
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-zinc-800 transition dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium text-sm shadow-sm"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Cafes
        </Link>
    );
}

interface BusinessActionsProps {
    id: string;
    ownerId: string;
}

// --- BOTONES DE ACCIÓN (EDITAR/BORRAR) ---
export function BusinessActions({ id, ownerId }: BusinessActionsProps) {
    // 👇 SIMULACIÓN: Estamos logueados como JUAN
    const user = {
        username: "juan_cafes",
        authorities: [{ authority: "ROLE_BUSINESS" }]
    };

    // 1. ¿Es ADMIN? (El Admin siempre puede todo)
    const isAdmin = user?.authorities?.some(a => a.authority === "ROLE_ADMIN");

    // 2. ¿Tiene ROL DE NEGOCIO?
    const hasBusinessRole = user?.authorities?.some(a => a.authority === "ROLE_BUSINESS");

    // 3. ¿Es SU negocio? (Coincide el usuario logueado con el dueño del negocio)
    // Nota: Asegúrate que tu objeto user real tenga la propiedad 'username' o 'id'
    const isOwner = user?.username === ownerId;

    // LÓGICA FINAL:
    // Puede editar si es Admin O (si tiene rol de negocio Y es el dueño)
    const canEdit = isAdmin || (hasBusinessRole && isOwner);

    if (!canEdit) return null;

    return (
        <div className="flex gap-1 ml-auto">
            <Link href={`/business/${id}/edit`} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition dark:hover:text-white dark:hover:bg-zinc-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            </Link>
            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition dark:hover:text-red-400 dark:hover:bg-red-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        </div>
    );
}
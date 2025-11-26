import Link from "next/link";

// TIPO DE DATOS (Esto luego vendrá de tu base de datos)
type Business = {
    id: string;
    name: string;
    industry: string;
    status: "Active" | "Inactive";
    employees: number;
};

// DATOS MOCK (Elimina esto cuando tengas tu BusinessService)
const mockBusinesses: Business[] = [
    { id: "1", name: "Acme Corp", industry: "Technology", status: "Active", employees: 120 },
    { id: "2", name: "Stark Industries", industry: "Defense", status: "Active", employees: 5000 },
    { id: "3", name: "Wayne Ent", industry: "Finance", status: "Inactive", employees: 10 },
    { id: "4", name: "Cyberdyne", industry: "AI Research", status: "Active", employees: 350 },
];

export default async function BusinessPage() {
    // Aquí llamarías a tu servicio:
    // const service = new BusinessService(serverAuthProvider);
    // const businesses = await service.getBusinesses();
    const businesses = mockBusinesses; // Usamos los datos falsos por ahora

    return (
        <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black py-10">
            <main className="mx-auto w-full max-w-5xl px-6">

                {/* HEADER: Título y Botón de Crear */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Businesses
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Manage your companies and partners.
                        </p>
                    </div>

                    <Link
                        href="/business/new"
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-zinc-800 transition dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium text-sm shadow-sm"
                    >
                        {/* Icono Plus SVG inline */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Business
                    </Link>
                </div>

                {/* CONTENIDO: Grid de Tarjetas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.map((biz) => (
                        <div
                            key={biz.id}
                            className="group relative flex flex-col justify-between border border-gray-200 rounded-xl bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition dark:bg-black dark:border-zinc-800"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                                        biz.status === "Active"
                                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900"
                                            : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700"
                                    }`}>
                                        {biz.status}
                                    </div>

                                    {/* Menú de acciones rápidas (visual) */}
                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                    </button>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {biz.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {biz.industry}
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                                <div className="text-sm text-gray-500 dark:text-zinc-500">
                                    {biz.employees} employees
                                </div>

                                <div className="flex gap-2">
                                    {/* Botón Editar */}
                                    <Link href={`/business/${biz.id}/edit`} className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                    </Link>
                                    {/* Botón Eliminar */}
                                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Estado vacío (si no hay datos) */}
                    {businesses.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl dark:border-zinc-800">
                            <p>No businesses found. Get started by adding one.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
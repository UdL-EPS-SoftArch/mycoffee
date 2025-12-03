import { CreateBusinessButton, BusinessActions } from "./action-buttons";

type Cafeteria = {
    id: string;
    name: string;
    address: string;
    status: "Open" | "Closed";
    rating: number;
    hasWifi: boolean;
    capacity: number;
    ownerId: string; // <--- NUEVO CAMPO: Identificador del dueño
};

const mockCafeterias: Cafeteria[] = [
    // Asignamos dueños ficticios (users) a cada cafetería
    { id: "1", name: "The Black Roast", address: "Av. Diagonal 405, BCN", status: "Open", rating: 4.8, hasWifi: true, capacity: 45, ownerId: "juan_cafes" },
    { id: "2", name: "Espresso Lab", address: "C/ Gran Vía 22, MAD", status: "Open", rating: 4.5, hasWifi: true, capacity: 30, ownerId: "user2" },
    { id: "3", name: "Morning Dew", address: "Plaza Mayor 3", status: "Closed", rating: 3.9, hasWifi: false, capacity: 12, ownerId: "admin" },
    { id: "4", name: "Code & Coffee", address: "Tech Park, Edif B", status: "Open", rating: 5.0, hasWifi: true, capacity: 80, ownerId: "user1" },
];

export default async function CafeteriasPage() {
    const cafeterias = mockCafeterias;

    return (
        <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black py-12">
            <main className="mx-auto w-full max-w-6xl px-6">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900 dark:text-white"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
                            Cafes
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 ml-1">
                            Explore the best spots for coffee and work.
                        </p>
                    </div>
                    <CreateBusinessButton />
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cafeterias.map((cafe) => (
                        <div
                            key={cafe.id}
                            className="group relative flex flex-col justify-between border border-gray-200 rounded-2xl bg-white p-0 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 dark:bg-black dark:border-zinc-800 overflow-hidden"
                        >
                            {/* ... (Todo el contenido visual de la tarjeta se mantiene igual) ... */}

                            <div className="p-6 pb-2">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                        cafe.status === "Open"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
                                            : "bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-700"
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${cafe.status === "Open" ? "bg-emerald-500" : "bg-zinc-400"}`}></span>
                                        {cafe.status === "Open" ? "Open Now" : "Closed"}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <span>{cafe.rating}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-black dark:text-white"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:underline decoration-2 underline-offset-4 decoration-gray-900 dark:decoration-white">
                                    {cafe.name}
                                </h3>

                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    {cafe.address}
                                </div>
                            </div>

                            <div className="mt-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800 p-4 px-6 flex items-center justify-between">
                                <div className="flex gap-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                                    {cafe.hasWifi && (
                                        <span className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded dark:bg-black dark:border-zinc-700">WiFi</span>
                                    )}
                                    <span className="flex items-center gap-1 px-2 py-1">
                        {cafe.capacity} ppl
                     </span>
                                </div>

                                {/* AQUI ESTA EL CAMBIO IMPORTANTE: Pasamos ownerId */}
                                <BusinessActions id={cafe.id} ownerId={cafe.ownerId} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
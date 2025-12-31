import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-[500px] w-full flex items-center justify-center bg-stone-900 text-white overflow-hidden">
            {/* ... (el código del fondo sigue igual) ... */}

            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                    El Millor Cafè de la Ciutat
                </h1>
                <p className="text-xl md:text-2xl text-stone-200 mb-8 max-w-2xl mx-auto">
                    Gra torrat artesanalment, pastisseria fresca i l'ambient perfecte per desconnectar.
                </p>
                <div className="flex gap-4 justify-center">

                    {/* AQUÍ ESTÁ EL CAMBIO: href="/products" */}
                    <Link
                        href="/products"
                        className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors"
                    >
                        Veure Carta
                    </Link>

                    <Link
                        href="/contact"
                        className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold rounded-full transition-colors"
                    >
                        On som?
                    </Link>
                </div>
            </div>
        </section>
    );
}
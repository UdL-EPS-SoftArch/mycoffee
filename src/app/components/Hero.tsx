import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-[500px] w-full flex items-center justify-center bg-stone-900 text-white overflow-hidden">
            {/* Fons fosc o imatge */}
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80')] bg-cover bg-center"
                aria-hidden="true"
            />

            {/* Contingut */}
            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                    El Millor Cafè de la Ciutat
                </h1>
                <p className="text-xl md:text-2xl text-stone-200 mb-8 max-w-2xl mx-auto">
                    Gra torrat artesanalment, pastisseria fresca i l'ambient perfecte per desconnectar.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/menu"
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
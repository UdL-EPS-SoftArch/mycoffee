import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-[500px] w-full flex items-center justify-center bg-stone-900 text-white overflow-hidden">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80')] bg-cover bg-center"
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                    The Best Coffee in Town
                </h1>
                <p className="text-xl md:text-2xl text-stone-200 mb-8 max-w-2xl mx-auto">
                    Artisan roasted beans, fresh pastries, and the perfect atmosphere to unwind or work.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/products"
                        className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-colors"
                    >
                        View Menu
                    </Link>
                    <Link
                        href="/contact"
                        className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold rounded-full transition-colors"
                    >
                        Find Us
                    </Link>
                </div>
            </div>
        </section>
    );
}
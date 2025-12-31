import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";

export default function Home() {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
            <main className="flex flex-col min-h-screen">

                {/* 1. Hero Section */}
                <Hero />

                {/* 2. Features Section */}
                <Features />

                {/* 3. Simple Footer */}
                <footer className="bg-stone-900 text-stone-400 py-8 text-center text-sm">
                    <p>© 2025 My Coffee Shop. Made with lots of ☕ and code.</p>
                </footer>

            </main>
        </div>
    );
}
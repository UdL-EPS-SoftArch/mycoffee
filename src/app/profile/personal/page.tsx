"use client";

// @ts-ignore
import ProfileHero from "./components/ProfileHero";
// @ts-ignore
import ProfileOptions from "./components/ProfileOptions";
import Footer from "@/app/components/Footer";

export default function ProfilePage() {
    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1511920170033-f8396924c348')",
                }}
            />
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <main className="relative z-10 flex-grow">
                <ProfileHero />
                <ProfileOptions />
            </main>

            <Footer />
        </div>
    );
}

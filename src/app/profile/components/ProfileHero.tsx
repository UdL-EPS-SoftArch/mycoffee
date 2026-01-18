export default function ProfileHero() {
    return (
        <section className="max-w-5xl mx-auto px-6 pt-24">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 text-white shadow-xl">
                <h1 className="text-4xl font-bold mb-4">
                    Welcome to your profile ☕
                </h1>
                <p className="text-lg text-gray-200 max-w-3xl">
                    Thank you for being part of MyCoffee. Here you can manage your
                    personal information, explore coffee shops, track your activity
                    and connect with the community.
                </p>
                <div className="mt-6 border-t border-white/20 pt-4 text-sm text-gray-300">
                    Your journey into great coffee starts here.
                </div>
            </div>
        </section>
    );
}

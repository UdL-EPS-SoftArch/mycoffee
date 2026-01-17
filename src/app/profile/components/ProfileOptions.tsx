import ProfileCard from "./ProfileCard";

export default function ProfileOptions() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-16 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <ProfileCard
                title="Personal Information"
                description="Manage your personal data and security"
                href="/profile/personal"
            />
            <ProfileCard
                title="Coffee Shops"
                description="Your favorite cafés and businesses"
                href="/business/page"
            />
            <ProfileCard
                title="Basket"
                description="Your current and past orders"
                href="/baskets"
            />
            <ProfileCard
                title="Community"
                description="Friends, chats and connections"
                href="/community"
            />
            <ProfileCard
                title="Track Food"
                description="Track your food and drinks"
                href="/track-food"
            />
            <ProfileCard
                title="Statistics"
                description="Your activity and consumption stats"
                href="/statistics"
            />
        </section>
    );
}

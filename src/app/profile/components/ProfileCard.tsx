
import Link from "next/link";

interface ProfileCardProps {
    title: string;
    description: string;
    href: string;
}

export default function ProfileCard({ title, description, href }: ProfileCardProps) {
    return (
        <Link href={href}>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer h-full">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </Link>
    );
}

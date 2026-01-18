"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { Record } from "@/types/record";
import { RecordService } from "@/api/recordApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Shield, User as UserIcon, FileText, Calendar, Plus, Settings } from "lucide-react";

interface UserProfileProps {
    user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
    const [records, setRecords] = useState<Record[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setIsLoading(true);
                const recordService = new RecordService(clientAuthProvider());
                const data = await recordService.getRecordsByOwnedBy(user);
                setRecords(data);
            } catch (err) {
                console.error('Error loading records:', err);
                setError('Failed to load records');
            } finally {
                setIsLoading(false);
            }
        };

        if (user.uri) {
            fetchRecords();
        }
    }, [user]);

    const formatDate = (date?: Date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
            {/* Header con fondo decorativo */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 h-48 md:h-64">
                <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
            </div>

            <div className="container mx-auto px-4 -mt-20 md:-mt-32 relative z-10 max-w-5xl pb-12">
                {/* Card de Perfil Principal */}
                <Card className="shadow-2xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                        <CardContent className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-xl">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                            <UserIcon className="w-16 h-16 md:w-20 md:h-20 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
                                </div>

                                {/* Info del Usuario */}
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                                {user.username}
                                            </h1>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <Button variant="outline" className="gap-2">
                                            <Settings className="w-4 h-4" />
                                            Edit Profile
                                        </Button>
                                    </div>

                                    {/* Email y Authorities */}
                                    <div className="space-y-4">
                                        {user.email && (
                                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="text-base">{user.email}</span>
                                            </div>
                                        )}

                                        {user.authorities && user.authorities.length > 0 && (
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mt-1">
                                                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div className="flex gap-2 flex-wrap">
                                                    {user.authorities.map((auth, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                                                        >
                                                            {auth.authority}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {records.length}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Records</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                    <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {records.filter(r => r.created).length}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                    <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {user.authorities?.length || 0}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Roles</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Records Section */}
                <Card className="border-0 shadow-xl">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                My Records
                            </CardTitle>
                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
                                <Plus className="w-4 h-4" />
                                New Record
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        {isLoading ? (
                            <div className="text-center py-16">
                                <div className="relative w-16 h-16 mx-auto mb-4">
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading records...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                                <p className="text-red-600 dark:text-red-400 mb-4 font-medium">{error}</p>
                                <Button
                                    onClick={() => window.location.reload()}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    Try Again
                                </Button>
                            </div>
                        ) : records.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="relative w-32 h-32 mx-auto mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl rotate-6"></div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-3xl -rotate-6"></div>
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    No records yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                    Start creating your first record to keep track of your coffee journey!
                                </p>
                                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
                                    <Plus className="w-4 h-4" />
                                    Create Your First Record
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {records.map((record, index) => (
                                    <div
                                        key={record.uri}
                                        className="group relative p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800/50 hover:shadow-xl"
                                        onClick={() => {
                                            const recordId = record.uri.split('/').pop();
                                            window.location.href = `/records/${recordId}`;
                                        }}
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                                    {record.name}
                                                </h3>

                                                {record.description && (
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                                        {record.description}
                                                    </p>
                                                )}

                                                <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-500">
                                                    {record.created && (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-full">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>Created {formatDate(record.created)}</span>
                                                        </div>
                                                    )}
                                                    {record.modified && (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-full">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>Updated {formatDate(record.modified)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="text-blue-600 dark:text-blue-400">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
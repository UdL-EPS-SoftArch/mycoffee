"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { Record } from "@/types/record";
import { RecordService } from "@/api/recordApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Shield, User as UserIcon, FileText, Calendar } from "lucide-react";

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
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* User Info Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                                <UserIcon className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                            </div>
                            {user.username}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {user.email && (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Mail className="w-5 h-5" />
                                    <span className="text-sm sm:text-base">{user.email}</span>
                                </div>
                            )}

                            {user.authorities && user.authorities.length > 0 && (
                                <div className="flex items-start gap-2">
                                    <Shield className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-1" />
                                    <div className="flex gap-2 flex-wrap">
                                        {user.authorities.map((auth, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-medium"
                                            >
                                                {auth.authority}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Records Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                                <FileText className="w-6 h-6" />
                                Records
                            </CardTitle>
                            {!isLoading && records.length > 0 && (
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                                    {records.length} {records.length === 1 ? 'record' : 'records'}
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading records...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                                <Button
                                    onClick={() => window.location.reload()}
                                    variant="outline"
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : records.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No records found</p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                                    This user hasn't created any records yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {records.map((record) => (
                                    <div
                                        key={record.uri}
                                        className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 cursor-pointer bg-white dark:bg-gray-900"
                                        onClick={() => {
                                            const recordId = record.uri.split('/').pop();
                                            window.location.href = `/records/${recordId}`;
                                        }}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                    {record.name}
                                                </h3>

                                                {record.description && (
                                                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm line-clamp-2">
                                                        {record.description}
                                                    </p>
                                                )}

                                                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500 dark:text-gray-500">
                                                    {record.created && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>Created: {formatDate(record.created)}</span>
                                                        </div>
                                                    )}
                                                    {record.modified && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span>Modified: {formatDate(record.modified)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0">
                                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                                                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
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
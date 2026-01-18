"use client";

import { useState } from "react";
// @ts-ignore
import Footer from "@/app/components/Footer";

export default function ChangePasswordPage() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.newPassword !== form.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (form.newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        // 🔐 Aquí luego conectarás con el backend
        // await api.changePassword(...)

        setSuccess("Password changed successfully");
        setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Imagen de fondo */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1511920170033-f8396924c348')",
                }}
            />
            <div className="absolute inset-0 bg-black/70" />

            {/* Contenido */}
            <main className="relative z-10 flex-grow flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-white shadow-2xl">
                    <h1 className="text-3xl font-bold mb-2 text-center">
                        Change Password
                    </h1>
                    <p className="text-sm text-gray-300 text-center mb-6">
                        Keep your account secure by updating your password
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-500/20 text-green-300 rounded text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition"
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}

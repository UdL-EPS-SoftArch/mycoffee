"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

interface ImageUploadProps {
    productId: string;
    onUploadSuccess?: () => void;
}

export function ImageUpload({ productId, onUploadSuccess }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getAuthToken = (): string | null => {
        if (typeof document !== 'undefined') {
            const match = document.cookie.match(/MYCOFFEE_AUTH=([^;]+)/);
            if (match) return match[1];
        }
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('MYCOFFEE_AUTH');
        }
        return null;
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/products/${productId}/image`, {
                method: 'POST',
                headers: {
                    ...(token ? { Authorization: token } : {}),
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            setSuccess("Image uploaded successfully!");
            onUploadSuccess?.();

            // Reload the page to show the new image
            window.location.reload();
        } catch (err) {
            console.error("Error uploading image:", err);
            setError(err instanceof Error ? err.message : "Failed to upload image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        setIsDeleting(true);
        setError(null);
        setSuccess(null);

        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/products/${productId}/image`, {
                method: 'DELETE',
                headers: {
                    ...(token ? { Authorization: token } : {}),
                },
            });

            if (!response.ok) {
                throw new Error(`Delete failed: ${response.status}`);
            }

            setSuccess("Image deleted successfully!");
            window.location.reload();
        } catch (err) {
            console.error("Error deleting image:", err);
            setError(err instanceof Error ? err.message : "Failed to delete image");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                    id="image-upload"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <FontAwesomeIcon icon={faUpload} className="w-4 h-4 mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Upload Image"}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    {isDeleting ? (
                        <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mr-2" />
                    )}
                    {isDeleting ? "Deleting..." : "Delete Image"}
                </Button>
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
            {success && (
                <p className="text-sm text-green-600">{success}</p>
            )}
        </div>
    );
}

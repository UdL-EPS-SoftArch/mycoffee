"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

interface ProductImageProps {
    src: string;
    alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600">
                <FontAwesomeIcon icon={faImage} className="w-20 h-20 mb-2" />
                <span className="text-sm">No image available</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
        />
    );
}

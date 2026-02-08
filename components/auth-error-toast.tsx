"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthErrorToast() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const router = useRouter();

    useEffect(() => {
        if (error === "unauthorized") {
            toast.error("You are not authorized to view that page.");
            // Clean up the URL
            router.replace("/dashboard");
        }
    }, [error, router]);

    return null;
}

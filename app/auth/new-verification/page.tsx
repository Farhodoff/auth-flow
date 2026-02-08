"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import Link from "next/link";

function NewVerificationForm() {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (!token) {
            setError("Missing token!");
            return;
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong!");
            });
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                        Confirming your verification
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Please wait while we confirm your email.
                    </p>
                </div>

                <div className="flex items-center justify-center w-full">
                    {!success && !error && (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    )}
                    {success && (
                        <div className="p-3 rounded-md bg-emerald-500/15 text-emerald-500 text-sm">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    <Link href="/login" className="text-sm text-primary hover:underline">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function NewVerificationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewVerificationForm />
        </Suspense>
    );
}

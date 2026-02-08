"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

import { Suspense } from "react";

function NewPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;

        startTransition(() => {
            newPassword(password, token)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
                    if (data.success) toast.success("Password updated!");
                    if (data.error) toast.error(data.error);
                });
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                        Enter new password
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="******"
                            disabled={isPending}
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 rounded-md bg-emerald-500/15 text-emerald-500 text-sm">
                            {success}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isPending}>
                        Reset password
                    </Button>
                </form>

                <div className="text-center">
                    <Link href="/login" className="text-sm text-primary hover:underline">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function NewPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewPasswordForm />
        </Suspense>
    );
}

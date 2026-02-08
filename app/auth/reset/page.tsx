"use client";

import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

export default function ResetPage() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;

        startTransition(() => {
            reset(email)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
                    if (data.success) toast.success("Reset email sent!");
                    if (data.error) toast.error(data.error);
                });
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="name@example.com"
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
                        Send reset email
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

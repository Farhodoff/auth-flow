"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/actions/login";
import { toast } from "sonner";

export function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const [isPending, startTransition] = useTransition();

    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const onSubmit = (formData: FormData) => {
        setError("");
        setSuccess("");

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const code = formData.get("code") as string;

        startTransition(() => {
            login({ email, password, code }, callbackUrl)
                .then((data) => {
                    if (data?.error) {
                        setError(data.error);
                        toast.error(data.error);
                    }

                    if (data?.success) {
                        setSuccess(data.success);
                        toast.success(data.success);
                    }

                    if (data?.twoFactor) {
                        setShowTwoFactor(true);
                        toast.info("2FA code sent to your email");
                    }
                })
                .catch(() => {
                    setError("Something went wrong");
                    toast.error("Something went wrong");
                });
        });
    };

    return (
        <form action={onSubmit} className="space-y-4">
            {!showTwoFactor && (
                <>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            disabled={isPending}
                            className="w-full px-4 py-2 bg-background border border-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground disabled:opacity-50"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            disabled={isPending}
                            className="w-full px-4 py-2 bg-background border border-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground disabled:opacity-50"
                            placeholder="********"
                        />
                    </div>
                </>
            )}

            {showTwoFactor && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Two Factor Code</label>
                    <input
                        name="code"
                        required
                        disabled={isPending}
                        className="w-full px-4 py-2 bg-background border border-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground disabled:opacity-50"
                        placeholder="123456"
                    />
                    <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to your email.</p>
                </div>
            )}

            {!showTwoFactor && (
                <div className="flex justify-end">
                    <Link href="/auth/reset" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow disabled:opacity-50"
            >
                {isPending ? "Signing in..." : (showTwoFactor ? "Confirm" : "Sign in")}
            </button>

            {error && !showTwoFactor && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                    {error}
                </div>
            )}
        </form>
    );
}

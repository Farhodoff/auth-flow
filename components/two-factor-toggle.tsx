"use client";

import { useTransition } from "react";
import { updateSettings } from "@/actions/settings";
import { toast } from "sonner";

interface TwoFactorToggleProps {
    isTwoFactorEnabled: boolean;
}

export function TwoFactorToggle({ isTwoFactorEnabled }: TwoFactorToggleProps) {
    const [isPending, startTransition] = useTransition();

    const onToggle = () => {
        startTransition(() => {
            updateSettings({ isTwoFactorEnabled: !isTwoFactorEnabled })
                .then((data) => {
                    if (data.success) toast.success(data.success);
                    if (data.error) toast.error(data.error);
                })
                .catch(() => toast.error("Something went wrong"));
        });
    };

    return (
        <button
            onClick={onToggle}
            disabled={isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${isTwoFactorEnabled ? "bg-primary" : "bg-muted"
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isTwoFactorEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
            />
        </button>
    );
}

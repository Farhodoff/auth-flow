"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function SubscriptionButton({ isPro }: { isPro: boolean }) {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("You must be logged in.");
                    return;
                }
                throw new Error("Something went wrong");
            }

            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button onClick={onClick} disabled={isLoading}>
            {isPro ? "Manage Subscription" : "Upgrade to Pro"}
        </Button>
    );
}

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function SubscriptionButton({ isPro }: { isPro: boolean }) {
    const [isLoading, setIsLoading] = useState(false);
    const { } = useAuth(); // kept for context if needed later, but removing user
    // or just remove the line if useAuth is not used
    // But useAuth is imported.
    // The previous code: const { user } = useAuth();
    // StartLine 9.
    // I'll remove the line.

    const onClick = async () => {
        try {
            setIsLoading(true);
            const response = await api.post("/stripe/checkout");
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button onClick={onClick} disabled={isLoading} variant={isPro ? "outline" : "default"}>
            {isPro ? "Manage Subscription" : "Upgrade to Pro"}
        </Button>
    );
}

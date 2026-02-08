"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "@/app/actions";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export default function DeleteAccountButton() {
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        try {
            await deleteAccount();
            toast.success("Account deleted successfully.");
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            toast.error("Failed to delete account.");
            console.error(error);
            setIsLoading(false);
        }
    }

    return (
        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Account"}
        </Button>
    );
}

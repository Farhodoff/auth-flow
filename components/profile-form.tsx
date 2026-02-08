"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AvatarUpload from "@/components/avatar-upload";
import { updateProfile } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfileForm({ user }: { user: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            await updateProfile(formData);
            toast.success("Profile updated successfully!");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update profile.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="md:col-span-3 grid gap-6">
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-semibold">Public Profile</h3>
                        <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-sm font-medium text-muted-foreground">Profile Picture</span>
                                <AvatarUpload currentImage={user.image} />
                            </div>

                            <div className="flex-1 space-y-4 w-full">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium leading-none">
                                        Display Name
                                    </label>
                                    <Input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Display Name"
                                        defaultValue={user.name || ""}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Please use 32 characters at maximum.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={user.email || ""}
                                        disabled
                                        className="opacity-50 cursor-not-allowed bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email cannot be changed securely at this moment.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="bio" className="text-sm font-medium leading-none">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        id="bio"
                                        placeholder="Tell us a little bit about yourself"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-border bg-muted/20 flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}

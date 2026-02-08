import DeleteAccountButton from "@/components/delete-account-button";
import SubscriptionButton from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { TwoFactorToggle } from "@/components/two-factor-toggle";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
    const session = await auth();
    const isPro = await checkSubscription();

    const user = await prisma.user.findUnique({
        where: { id: session?.user?.id }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-6">
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-semibold">Security</h3>
                        <p className="text-sm text-muted-foreground">Manage your account security and authentication.</p>
                    </div>
                    <div className="p-6 items-center flex justify-between">
                        <div className="space-y-1">
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                        </div>
                        <TwoFactorToggle isTwoFactorEnabled={(user as any)?.isTwoFactorEnabled || false} />
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-semibold">Appearance</h3>
                        <p className="text-sm text-muted-foreground">Customize how the app looks on your device.</p>
                    </div>
                    <div className="p-6 items-center flex justify-between">
                        <div className="space-y-1">
                            <p className="font-medium">Theme</p>
                            <p className="text-sm text-muted-foreground">Select your preferred theme.</p>
                        </div>
                        {/* We'll use the ThemeToggle we have or a placeholder if I need to find it */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Current: System</span>
                            {/* <ThemeToggle /> */}
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-semibold">Subscription</h3>
                        <p className="text-sm text-muted-foreground">Manage your plan and billing details.</p>
                    </div>
                    <div className="p-6 items-center flex justify-between">
                        <div className="space-y-1">
                            <p className="font-medium">Manage Subscription</p>
                            <p className="text-sm text-muted-foreground">View your invoice history and manage your plan.</p>
                        </div>
                        <SubscriptionButton isPro={isPro} />
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">Irreversible and destructive actions.</p>
                    </div>
                    <div className="p-6 items-center flex justify-between">
                        <div className="space-y-1">
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently remove your account and all of its contents.</p>
                        </div>
                        <DeleteAccountButton />
                    </div>
                </div>
            </div>
        </div>
    );
}

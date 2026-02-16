import { TwoFactorToggle } from "../components/TwoFactorToggle";
import SubscriptionButton from "../components/SubscriptionButton";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export default function Settings() {
    const { user } = useAuth();
    const isPro = !!user?.stripeSubscriptionId;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Manage your account security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-medium">Two-Factor Authentication</h3>
                                <p className="text-sm text-muted-foreground">Secure your account with 2FA.</p>
                            </div>
                            <TwoFactorToggle isTwoFactorEnabled={user?.isTwoFactorEnabled || false} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                        <CardDescription>Manage your billing and subscription</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-medium">Current Plan</h3>
                                <p className="text-sm text-muted-foreground">You are currently on the {isPro ? "Pro" : "Hobby"} plan.</p>
                            </div>
                            <SubscriptionButton isPro={isPro} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

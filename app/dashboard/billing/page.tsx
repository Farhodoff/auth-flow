import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Check, CreditCard, Loader2 } from "lucide-react";

export default async function BillingPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const plans = [
        { name: "Hobby", price: "$0", features: ["1 Project", "Basic Analytics", "Community Support"], current: false },
        { name: "Pro", price: "$29", features: ["Unlimited Projects", "Advanced Analytics", "Priority Support"], current: true },
        { name: "Enterprise", price: "$99", features: ["SSO", "Dedicated Support", "SLA"], current: false },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
                <p className="text-muted-foreground">Manage your subscription and payment details.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <div key={plan.name} className={`relative flex flex-col p-6 bg-card border rounded-xl shadow-sm ${plan.current ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
                        {plan.current && (
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm">
                                Current Plan
                            </div>
                        )}
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        <div className="mt-4 mb-6">
                            <span className="text-3xl font-bold">{plan.price}</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <ul className="flex-1 space-y-3 mb-6">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Check className="h-4 w-4 text-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${plan.current ? 'bg-secondary text-secondary-foreground cursor-default' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
                            {plan.current ? "Manage Subscription" : "Upgrade"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm p-6 max-w-2xl">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="flex items-center gap-4 p-4 border border-border rounded-lg mb-6">
                    <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expiry 12/28</p>
                    </div>
                    <button className="text-sm font-medium text-primary hover:underline">Edit</button>
                </div>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Add new payment method
                </button>
            </div>
        </div>
    );
}

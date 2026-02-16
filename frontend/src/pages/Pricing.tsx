import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import SubscriptionButton from "../components/SubscriptionButton";
import { useAuth } from "../contexts/AuthContext";

export default function Pricing() {
    const { user } = useAuth();
    const isPro = !!user?.stripeSubscriptionId;

    const tiers = [
        {
            name: "Hobby",
            price: "$0",
            description: "For passion projects & experiments.",
            features: ["Unlimited projects", "1GB Storage", "Community Support", "Basic Analytics"],
            cta: "Get Started",
            current: !isPro,
        },
        {
            name: "Pro",
            price: "$29",
            description: "For production-ready applications.",
            features: ["Everything in Hobby", "10GB Storage", "Priority Support", "Advanced Analytics", "Custom Domain"],
            cta: "Upgrade",
            popular: true,
            current: isPro,
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For scaling teams with security needs.",
            features: ["Unlimited Storage", "24/7 Support", "SSO & SAML", "Audit Logs", "Dedicated account manager"],
            cta: "Contact Us",
        },
    ];

    return (
        <div className="min-h-screen pt-12 pb-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-4">
                    Simple, transparent pricing
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Choose the plan that's right for you and your team. No hidden fees.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3 lg:gap-8 px-4">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={`relative flex flex-col rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md ${tier.popular ? "border-primary ring-1 ring-primary" : "border-border"
                            }`}
                    >
                        {tier.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground shadow-sm">
                                Most Popular
                            </div>
                        )}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold leading-6 text-foreground">{tier.name}</h3>
                            <div className="mt-4 flex items-baseline gap-x-2">
                                <span className="text-5xl font-bold tracking-tight text-foreground">{tier.price}</span>
                                {tier.price !== "Custom" && <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>}
                            </div>
                            <p className="mt-4 text-sm leading-6 text-muted-foreground">{tier.description}</p>
                        </div>
                        <ul role="list" className="mb-6 space-y-4 flex-1">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex gap-x-3">
                                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                                    <span className="text-sm leading-6 text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        {tier.name === "Hobby" ? (
                            !user ? (
                                <Link
                                    to="/register"
                                    className={`mt-auto block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors ${tier.popular
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary"
                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:outline-secondary"
                                        }`}
                                >
                                    {tier.cta}
                                </Link>
                            ) : (
                                <button disabled className="mt-auto block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 bg-secondary/50 text-muted-foreground cursor-default">
                                    Current Plan
                                </button>
                            )
                        ) : (
                            <SubscriptionButton isPro={isPro} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

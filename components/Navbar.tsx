import Link from "next/link";
import { auth } from "@/auth";
import CardNav from "@/components/CardNav";
import { ThemeToggle } from "./ThemeToggle";

export default async function Navbar() {
    const session = await auth();

    const items = [
        {
            label: "Features",
            bgColor: "#0f172a", // slate-900 (Dark)
            textColor: "#fff",
            links: [
                { label: "Authentication", href: "/#features", ariaLabel: "Authentication Features" },
                { label: "Database", href: "/#database", ariaLabel: "Database Integration" }
            ]
        },
        {
            label: "Pricing",
            bgColor: "#7c3aed", // Violet-600
            textColor: "#fff",
            links: [
                { label: "Hobby Plan", href: "/pricing", ariaLabel: "Hobby Pricing" },
                { label: "Pro Plan", href: "/pricing", ariaLabel: "Pro Pricing" },
                { label: "Enterprise", href: "/pricing", ariaLabel: "Enterprise Pricing" }
            ]
        },
        {
            label: "Docs",
            bgColor: "#4f46e5", // Indigo-600 (Primary)
            textColor: "#fff",
            links: [
                { label: "Quick Start", href: "/docs", ariaLabel: "Get Started" },
                { label: "Database Setup", href: "/docs/database-setup", ariaLabel: "Database Setup" },
                { label: "GitHub", href: "https://github.com/Farhodoff/auth-flow", ariaLabel: "View Source" }
            ]
        }
    ];

    return (
        <>
            <CardNav
                logoAlt="AuthFlow"
                items={items}
                baseColor="hsl(var(--card))"
                menuColor="hsl(var(--foreground))"
                buttonBgColor="hsl(var(--primary))"
                buttonTextColor="hsl(var(--primary-foreground))"
                actionButtonLabel={session ? "Dashboard" : "Get Started"}
            />
            {/* Spacer to prevent content overlap since CardNav is absolute/fixed */}
            <div className="h-32" />
        </>
    );
}

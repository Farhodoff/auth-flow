import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CardNav from './CardNav';
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();

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

    const handleActionClick = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="relative">
            <div className="absolute top-8 right-8 z-50">
                <ThemeToggle />
            </div>

            <CardNav
                logoAlt="AuthFlow"
                items={items}
                baseColor="hsl(var(--card))"
                menuColor="hsl(var(--foreground))"
                buttonBgColor="hsl(var(--primary))"
                buttonTextColor="hsl(var(--primary-foreground))"
                actionButtonLabel={user ? "Dashboard" : "Get Started"}
                onActionClick={handleActionClick}
            />
            {/* Spacer to prevent content overlap since CardNav is absolute/fixed */}
            <div className="h-32" />
        </div>
    );
}

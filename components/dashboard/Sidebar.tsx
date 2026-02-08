"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Settings,
    CreditCard,
    BarChart3,
    Bell,
    LogOut
} from "lucide-react";
import LogoutButton from "../logout-button";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Users, label: "Users", href: "/dashboard/users" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

import { User } from "next-auth";

interface DashboardSidebarProps {
    user: User & { role?: string }; // explicit typing accommodation
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
    const role = user?.role;
    const pathname = usePathname();

    // Filter items based on role
    const filteredItems = sidebarItems.filter(item => {
        if (item.label === "Users" || item.label === "Billing") {
            return role === "ADMIN";
        }
        return true;
    });

    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0">
            <div className="p-6 border-b border-border">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                        A
                    </div>
                    <span className="font-bold text-xl tracking-tight">AuthFlow</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="p-4 rounded-xl bg-muted/50 border border-border mb-4">
                    <h4 className="text-sm font-semibold mb-1">Pro Plan</h4>
                    <p className="text-xs text-muted-foreground mb-3">You are on the Pro plan.</p>
                    <div className="w-full bg-background rounded-full h-2 mb-2 overflow-hidden">
                        <div className="bg-primary h-full w-3/4 rounded-full"></div>
                    </div>
                    <p className="text-xs text-muted-foreground">75% usage</p>
                </div>
                {/* We can use the LogoutButton here but customized style might be needed. 
             For simplicity, let's keep the LogoutButton functionality but maybe wrap it 
             or just place it. The existing LogoutButton component might have specific styling.
             Let's just use a custom button look that triggers the same action or just import it.
         */}
            </div>
        </aside>
    );
}

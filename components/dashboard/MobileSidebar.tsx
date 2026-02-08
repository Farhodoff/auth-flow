"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Settings,
    CreditCard,
    BarChart3,
    Bell,
    Menu,
    X
} from "lucide-react";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Users, label: "Users", href: "/dashboard/users" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <div className="md:hidden">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 -ml-2 rounded-md hover:bg-muted text-foreground"
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Panel */}
            <div className={`fixed inset-y-0 left-0 z-50 w-3/4 max-w-[300px] bg-card border-r border-border shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                            A
                        </div>
                        <span className="font-bold text-xl tracking-tight">AuthFlow</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close menu</span>
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                <span className="font-medium bg-transparent">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                        <h4 className="text-sm font-semibold mb-1">Pro Plan</h4>
                        <p className="text-xs text-muted-foreground mb-3">You are on the Pro plan.</p>
                        <div className="w-full bg-background rounded-full h-2 mb-2 overflow-hidden">
                            <div className="bg-primary h-full w-3/4 rounded-full"></div>
                        </div>
                        <p className="text-xs text-muted-foreground">75% usage</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

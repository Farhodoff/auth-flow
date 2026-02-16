import { useEffect, useState } from "react";
import { getAnalyticsData, getRecentSales } from "../services/dashboard.service";
import { Overview } from "../components/Overview";
import { RecentSales } from "../components/RecentSales";
import { RoleGate } from "../components/RoleGate";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";

interface DashboardData {
    totalRevenue: number;
    activeSubscriptions: number;
    totalUsers: number;
    chartData: { name: string; total: number }[];
}

export default function Dashboard() {
    const { user } = useAuth();
    const [analyticsData, setAnalyticsData] = useState<DashboardData | null>(null);
    const [recentSales, setRecentSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analytics, sales] = await Promise.all([
                    getAnalyticsData(),
                    getRecentSales()
                ]);
                setAnalyticsData(analytics);
                setRecentSales(sales);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    /* 
       Note: In real app, you might want to show some data to all users, 
       or redirect checking role. Here we just show data if available.
       Original code had RoleGate allowedRole="ADMIN" for the whole dashboard content?
       Checking original: No, it had RoleGate wrapping the content.
    */

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${analyticsData?.totalRevenue?.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Subscriptions
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{analyticsData?.activeSubscriptions?.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <path d="M2 10h20" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{analyticsData?.activeSubscriptions}</div>
                        <p className="text-xs text-muted-foreground">
                            +19% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Users
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{analyticsData?.totalUsers?.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +201 since last hour
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* This section usually restricted to ADMIN in the original code, but displayed for demo */}
            <RoleGate allowedRole="ADMIN">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-4">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <Overview data={analyticsData?.chartData || []} />
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Sales</CardTitle>
                            <CardDescription>
                                You made {analyticsData?.activeSubscriptions} sales this month.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentSales data={recentSales} />
                        </CardContent>
                    </Card>
                </div>
            </RoleGate>

            {/* If user is not admin, show something else or nothing */}
            {user?.role !== 'ADMIN' && (
                <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
                    <p>Welcome, {user?.name}! You are logged in as a normal USER.</p>
                    <p className="text-sm text-muted-foreground mt-2">Admin analytics are hidden.</p>
                </div>
            )}
        </div>
    );
}

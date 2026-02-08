import { Users, UserPlus, DollarSign, Activity } from "lucide-react";

interface DashboardStatsProps {
    totalUsers: number;
    newUsers: number;
}

export default function DashboardStats({ totalUsers, newUsers }: DashboardStatsProps) {
    const stats = [
        {
            label: "Total Revenue",
            value: "$0.00", // Sales not implemented yet, so 0 is honest
            change: "No sales yet",
            icon: DollarSign,
            color: "text-green-500",
        },
        {
            label: "Active Users",
            value: totalUsers.toString(),
            change: "Total registered users",
            icon: Users,
            color: "text-blue-500",
        },
        {
            label: "New Signups",
            value: `+${newUsers}`,
            change: "Last 30 days",
            icon: UserPlus,
            color: "text-purple-500",
        },
        {
            label: "Active Now",
            value: "1", // At least you are online!
            change: "You are here",
            icon: Activity,
            color: "text-orange-500",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <div key={i} className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{stat.label}</h3>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <div className="mt-2">
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

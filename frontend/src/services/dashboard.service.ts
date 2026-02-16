// Mock data for dashboard
export const getAnalyticsData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        totalRevenue: 45231.89,
        activeSubscriptions: 2350,
        totalUsers: 12234,
        chartData: [
            { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
            { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
            { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
            { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
            { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
            { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
            { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
            { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
            { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
            { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
            { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
            { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
        ]
    };
};

export const getRecentSales = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
        {
            name: "Olivia Martin",
            email: "olivia.martin@email.com",
            amount: "+$1,999.00",
            image: null
        },
        {
            name: "Jackson Lee",
            email: "jackson.lee@email.com",
            amount: "+$39.00",
            image: null
        },
        {
            name: "Isabella Nguyen",
            email: "isabella.nguyen@email.com",
            amount: "+$299.00",
            image: null
        },
        {
            name: "William Kim",
            email: "will@email.com",
            amount: "+$99.00",
            image: null
        },
        {
            name: "Sofia Davis",
            email: "sofia.davis@email.com",
            amount: "+$39.00",
            image: null
        }
    ];
};

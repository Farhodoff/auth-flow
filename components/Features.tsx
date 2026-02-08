import { Shield, Database, Zap, Lock, Globe, Code2 } from "lucide-react";

export default function Features() {
    const features = [
        {
            title: "Secure Authentication",
            desc: "Enterprise-grade security with NextAuth.js v5. Support for Google, GitHub, and Credentials.",
            icon: <Shield className="w-6 h-6 text-white" />,
            color: "bg-blue-500",
            colSpan: "md:col-span-2",
        },
        {
            title: "Super Fast Database",
            desc: "Powered by Supabase and Prisma ORM for ultra-low latency data access.",
            icon: <Database className="w-6 h-6 text-white" />,
            color: "bg-purple-500",
            colSpan: "md:col-span-1",
        },
        {
            title: "Edge Ready",
            desc: "Deployed to the edge for lightning-fast performance globally.",
            icon: <Globe className="w-6 h-6 text-white" />,
            color: "bg-green-500",
            colSpan: "md:col-span-1",
        },
        {
            title: "Type-Safe",
            desc: "Built with TypeScript for a robust and bug-free development experience.",
            icon: <Code2 className="w-6 h-6 text-white" />,
            color: "bg-amber-500",
            colSpan: "md:col-span-2",
        },
        {
            title: "Modern Stack",
            desc: "Next.js App Router, Tailwind CSS, and Framer Motion.",
            icon: <Zap className="w-6 h-6 text-white" />,
            color: "bg-pink-500",
            colSpan: "md:col-span-3",
        },
    ];

    return (
        <section className="py-24 bg-muted/30" id="features">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A comprehensive suite of tools to help you build, launch, and scale your application.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`${feature.colSpan} group relative bg-background border border-border rounded-3xl p-8 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                        >
                            <div
                                className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                            >
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {feature.desc}
                            </p>

                            {/* Decoration */}
                            <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${feature.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

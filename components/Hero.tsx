import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";

export default async function Hero() {
    const session = await auth();

    return (
        <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    v2.0 is live: Now with Dark Mode & Dashboard
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Ultimate Auth Starter</span> <br className="hidden md:block" /> for Next.js Developers
                </h1>

                {/* Subheadline */}
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
                    Launch your SaaS in minutes, not days. Secure authentication, database integration, and a beautiful UI—pre-configured and ready to scale.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                    <Link
                        href={session ? "/dashboard" : "/register"}
                        className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                        {session ? "Go to Dashboard" : "Start Building Free"}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/docs"
                        className="px-8 py-4 bg-background border border-border text-foreground rounded-full font-semibold text-lg hover:bg-muted/50 transition-all duration-200 w-full sm:w-auto"
                    >
                        View Documentation
                    </Link>
                </div>

                {/* Dashboard Mockup (CSS Only) */}
                <div className="relative mt-10 perspective-1000 mx-auto max-w-5xl">
                    <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden transform rotate-x-6 hover:rotate-x-0 transition-transform duration-700 ease-out-expo group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-purple-500/5 pointer-events-none"></div>

                        {/* Window Controls */}
                        <div className="h-8 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>

                        {/* Mockup Content */}
                        <div className="p-6 grid grid-cols-4 gap-6 text-left h-[400px] md:h-[500px]">
                            {/* Sidebar */}
                            <div className="col-span-1 hidden md:flex flex-col gap-4 border-r border-border pr-6">
                                <div className="h-8 w-3/4 bg-muted rounded-md animate-pulse"></div>
                                <div className="space-y-2 mt-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="h-8 w-full bg-muted/30 rounded-md"></div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="col-span-4 md:col-span-3">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="h-10 w-1/3 bg-muted rounded-md animate-pulse"></div>
                                    <div className="h-10 w-10 bg-primary/20 rounded-full animate-pulse"></div>
                                </div>

                                {/* Chart Mockup */}
                                <div className="h-48 w-full bg-gradient-to-b from-primary/10 to-transparent border border-primary/10 rounded-xl mb-6 relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-between px-4 pb-2 gap-2">
                                        {[40, 70, 45, 90, 60, 80, 50, 95, 65, 85].map((h, i) => (
                                            <div key={i} className="w-full bg-primary/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Activity Mockup */}
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex justify-between items-center p-3 border border-border rounded-lg bg-background/50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-muted"></div>
                                                <div className="h-4 w-32 bg-muted rounded"></div>
                                            </div>
                                            <div className="h-4 w-16 bg-muted rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 opacity-40 rounded-[3rem]"></div>
                </div>

                {/* Social Proof */}
                <div className="mt-20 border-t border-border pt-10">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
                        Trusted by developers building modern apps
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Using simple text placeholders for logos to avoid external image issues, styled to look like logos */}
                        {['Acme Corp', 'GlobalBank', 'Nebula AI', 'DevFlow', 'CodeSync'].map((brand) => (
                            <span key={brand} className="text-xl md:text-2xl font-bold font-serif text-foreground">{brand}</span>
                        ))}
                    </div>
                </div>

            </div>

            {/* Background Decor */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-20 pointer-events-none"></div>
        </div>
    );
}

import Link from "next/link";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="prose prose-slate max-w-none dark:prose-invert">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
                        Loyihani Integratsiya Qilish Qo'llanmasi
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Bu loyiha <strong>Next.js (App Router)</strong>, <strong>Auth.js (NextAuth v5)</strong>, <strong>Prisma</strong> va <strong>Supabase</strong> asosida qurilgan tayyor autentifikatsiya tizimidir. Uni boshqa loyihalarda ishlatishning ikki yo'li bor.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="border border-muted rounded-2xl p-6 hover:shadow-lg transition-shadow bg-muted/30">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
                                Yangi Loyiha Boshlash
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                Agar siz yangi loyiha boshlayotgan bo'lsangiz, bu repozitoriyni to'g'ridan-to'g'ri ko'chirib (clone) olib ishlatishingiz mumkin.
                            </p>
                            <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto text-sm text-slate-300 font-mono mb-4">
                                <div className="flex gap-2 mb-2">
                                    <span className="text-slate-500">$</span>
                                    <span>git clone [REPO_URL] new-project</span>
                                </div>
                                <div className="flex gap-2 mb-2">
                                    <span className="text-slate-500">$</span>
                                    <span>cd new-project</span>
                                </div>
                                <div className="flex gap-2 mb-2">
                                    <span className="text-slate-500">$</span>
                                    <span>rm -rf .git && git init</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-slate-500">$</span>
                                    <span>npm install</span>
                                </div>
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex gap-2">
                                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span>.env faylini sozlash</span>
                                </li>
                                <li className="flex gap-2">
                                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span>Prisma schema push qilish</span>
                                </li>
                            </ul>
                        </div>

                        <div className="border border-muted rounded-2xl p-6 hover:shadow-lg transition-shadow bg-background">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm">2</span>
                                Mavjud Loyihaga Qo'shish
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                Mavjud Next.js loyihasiga qo'shish uchun quyidagi fayllarni ko'chirib o'tishingiz kerak.
                            </p>

                            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Kerakli fayllar</h3>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground">Config</span>
                                    <span className="text-sm text-muted-foreground">auth.ts, middleware.ts</span>
                                </li>
                                <li className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground">Database</span>
                                    <span className="text-sm text-muted-foreground">prisma/*, lib/prisma.ts</span>
                                </li>
                                <li className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground">API</span>
                                    <span className="text-sm text-muted-foreground">app/api/auth/*</span>
                                </li>
                            </ul>

                            <div className="bg-muted rounded-lg p-4 text-sm">
                                <p className="font-medium text-foreground mb-2">O'rnatish:</p>
                                <code className="text-primary text-xs break-all">
                                    npm install next-auth@beta @auth/prisma-adapter @prisma/client bcryptjs
                                </code>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-2xl p-8 border border-muted">
                        <h2 className="text-2xl font-bold mb-4 text-foreground">Qo'shimcha Sozlamalar</h2>
                        <div className="grid sm:grid-cols-3 gap-6">
                            <Link href="/docs/google-setup" className="block group">
                                <div className="bg-background rounded-xl p-4 shadow-sm group-hover:shadow-md transition-all border border-muted">
                                    <div className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">Google OAuth</div>
                                    <p className="text-xs text-muted-foreground">Client ID va Secret olish</p>
                                </div>
                            </Link>
                            <Link href="/docs/github-setup" className="block group">
                                <div className="bg-background rounded-xl p-4 shadow-sm group-hover:shadow-md transition-all border border-muted">
                                    <div className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">GitHub OAuth</div>
                                    <p className="text-xs text-muted-foreground">App yaratish va sozlash</p>
                                </div>
                            </Link>
                            <Link href="/docs/database-setup" className="block group">
                                <div className="bg-background rounded-xl p-4 shadow-sm group-hover:shadow-md transition-all border border-muted">
                                    <div className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">Database</div>
                                    <p className="text-xs text-muted-foreground">Supabase va Prisma</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="border-t border-muted py-12 mt-12 bg-muted/10">
                <div className="max-w-5xl mx-auto px-4 text-center text-muted-foreground text-sm">
                    <p>&copy; {new Date().getFullYear()} AuthFlow. Open Source Template.</p>
                </div>
            </footer>
        </div>
    );
}

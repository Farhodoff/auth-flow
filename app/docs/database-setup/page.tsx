import Link from "next/link";

export default function DatabaseSetupPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-extrabold tracking-tight mb-8">Database Sozlash (Supabase & Prisma)</h1>

                <div className="prose prose-slate max-w-none text-muted-foreground">
                    <p className="text-lg mb-8">
                        Bu loyiha ma'lumotlar bazasi sifatida <strong>Supabase (PostgreSQL)</strong> va ORM sifatida <strong>Prisma</strong> dan foydalanadi.
                    </p>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">1. Supabase Loyiha Yaratish</h2>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li><a href="https://supabase.com/" target="_blank" className="text-primary hover:underline">Supabase</a> da ro'yxatdan o'ting va yangi loyiha yarating.</li>
                                <li>Loyiha sozlamalaridan <strong>Database</strong> bo'limiga o'ting.</li>
                                <li><strong>Connection String</strong> ni nusxalab oling (URI rejimida, Node.js uchun).</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">2. .env Faylni Sozlash</h2>
                            <div className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                                <pre className="text-sm">
                                    DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?pgbouncer=true"<br />
                                    DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
                                </pre>
                            </div>
                            <p className="text-sm italic">Eslatma: [PASSWORD] o'rniga o'z bazangiz parolini yozing.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">3. Prisma Migratsiyasi</h2>
                            <p className="mb-4">Baza strukturasini (schema) Supabase'ga yuklash uchun quyidagi buyruqni terminalda bering:</p>
                            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                                npx prisma db push
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

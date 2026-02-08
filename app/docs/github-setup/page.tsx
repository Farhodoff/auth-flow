import Link from "next/link";

export default function GitHubSetupPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-extrabold tracking-tight mb-8">GitHub OAuth Sozlash</h1>

                <div className="prose prose-slate max-w-none text-muted-foreground">
                    <p className="text-lg mb-8">
                        GitHub orqali kirishni sozlash uchun GitHub Developer Settings'dan yangi OAuth App yaratishingiz kerak.
                    </p>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">1. Yangi OAuth App Yaratish</h2>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li><a href="https://github.com/settings/developers" target="_blank" className="text-primary hover:underline">GitHub Developer Settings</a> sahifasiga o'ting.</li>
                                <li><strong>"New OAuth App"</strong> tugmasini bosing.</li>
                                <li>Shaklni quyidagicha to'ldiring:
                                    <ul className="list-disc pl-6 mt-2 space-y-1">
                                        <li><strong>Application name:</strong> AuthFlow (yoki loyihangiz nomi)</li>
                                        <li><strong>Homepage URL:</strong> <code className="bg-muted px-1 py-0.5 rounded text-sm">http://localhost:3000</code></li>
                                        <li><strong>Authorization callback URL:</strong> <code className="bg-muted px-1 py-0.5 rounded text-sm">http://localhost:3000/api/auth/callback/github</code></li>
                                    </ul>
                                </li>
                                <li><strong>"Register application"</strong> tugmasini bosing.</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">2. Client ID va Secret Olish</h2>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>Ilova yaratilgandan so'ng, sahifada <strong>Client ID</strong> paydo bo'ladi.</li>
                                <li><strong>"Generate a new client secret"</strong> tugmasini bosing.</li>
                                <li>Yangi <strong>Client Secret</strong> hosil bo'ladi. Ularni nusxalab oling.</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">3. .env Faylni Yangilash</h2>
                            <p className="mb-4">Olingan kalitlarni `.env` faylga joylashtiring:</p>
                            <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                                <pre className="text-sm">
                                    GITHUB_CLIENT_ID="sizning-client-id"<br />
                                    GITHUB_CLIENT_SECRET="sizning-client-secret"
                                </pre>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

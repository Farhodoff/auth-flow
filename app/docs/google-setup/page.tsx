import Link from "next/link";

export default function GoogleSetupPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-extrabold tracking-tight mb-8">Google OAuth Sozlash</h1>

                <div className="prose prose-slate max-w-none text-muted-foreground">
                    <p className="text-lg mb-8">
                        Ilovangizda "Google bilan kirish" tugmasini ishlatish uchun Google Cloud Console'dan <strong>Client ID</strong> va <strong>Client Secret</strong> olishingiz kerak.
                    </p>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">1. Google Cloud Loyiha Yaratish</h2>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li><a href="https://console.cloud.google.com/" target="_blank" className="text-primary hover:underline">Google Cloud Console</a> saytiga kiring.</li>
                                <li>Chap yuqoridagi loyihalar ro'yxatini ochib, <strong>"New Project"</strong> tugmasini bosing.</li>
                                <li>Loyihaga nom bering (masalan, "AuthFlow") va <strong>"Create"</strong> tugmasini bosing.</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">2. OAuth Consent Screen Sozlash</h2>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>Chap menyudan <strong>APIs & Services {">"} OAuth consent screen</strong> bo'limiga o'ting.</li>
                                <li><strong>External</strong> ni tanlang va <strong>Create</strong> tugmasini bosing.</li>
                                <li>Ma'lumotlarni to'ldiring: App name, User support email, Developer contact info.</li>
                                <li>Scopes bo'limida `userinfo.email`, `userinfo.profile`, `openid` ni qo'shing.</li>
                                <li><strong>Test Users</strong> ga o'z emailingizni qo'shishni unutmang!</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">3. Credentials Yaratish</h2>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li><strong>APIs & Services {">"} Credentials</strong> bo'limiga o'ting.</li>
                                <li><strong>+ CREATE CREDENTIALS {">"} OAuth client ID</strong> ni tanlang.</li>
                                <li>Application type: <strong>Web application</strong>.</li>
                                <li>Authorized redirect URIs:
                                    <code className="block bg-muted p-2 rounded mt-2 text-sm">http://localhost:3000/api/auth/callback/google</code>
                                </li>
                                <li><strong>Create</strong> tugmasini bosing.</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">4. .env Faylni Yangilash</h2>
                            <p className="mb-4">Olingan Client ID va Secret'ni loyihangizdagi `.env` faylga yozing:</p>
                            <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                                <pre className="text-sm">
                                    GOOGLE_CLIENT_ID="sizning-client-id"<br />
                                    GOOGLE_CLIENT_SECRET="sizning-client-secret"
                                </pre>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

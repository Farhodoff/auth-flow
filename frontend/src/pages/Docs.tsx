export default function Docs() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-6">Documentation</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-xl text-muted-foreground mb-8">
                    Welcome to the AuthFlow documentation. This is a placeholder page for documentation content.
                </p>

                <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
                <p className="mb-4">
                    AuthFlow is a comprehensive authentication starter kit. It provides a solid foundation for your next SaaS project.
                </p>

                <h3 className="text-xl font-semibold mb-2">Features</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Secure Authentication (JWT, 2FA)</li>
                    <li>User Dashboard</li>
                    <li>Stripe Integration</li>
                    <li>Supabase Storage for Avatars</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4">Installation</h2>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
                    <code>git clone https://github.com/Farhodoff/auth-flow.git</code>
                </pre>
            </div>
        </div>
    );
}

import { auth } from "@/auth";
import Link from "next/link";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow">
        <Hero />
        <Features />

        {/* Call to Action Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Ship Your Next Project?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of developers building the future with our robust authentication starter kit.
            </p>
            <Link
              href={session ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105"
            >
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">&copy; {new Date().getFullYear()} AuthFlow. Open Source Project.</p>
          <div className="flex justify-center gap-6">
            <Link href="https://github.com/Farhodoff/auth-flow" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </Link>
            <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

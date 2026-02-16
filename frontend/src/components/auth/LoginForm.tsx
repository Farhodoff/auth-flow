import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// import { Label } from "../ui/label";

// Assuming Label component might be missing or need to be created if not in components/ui
// If it's missing, we can use <label> tag.

export function LoginForm() {
    const [searchParams] = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const { login } = useAuth();
    const navigate = useNavigate();

    const [isPending, setIsPending] = useState(false);
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    console.log(setShowTwoFactor); // Suppress unused var warning until 2FA integration
    const [error, setError] = useState<string | undefined>("");

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        code: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsPending(true);

        try {
            await login({
                email: formData.email,
                password: formData.password
                // code: formData.code // Add 2FA support later if needed by AuthContext
            });
            navigate(callbackUrl);
            toast.success("Logged in successfully");
        } catch (err: any) {
            setError(err.response?.data?.error || "Something went wrong");
            toast.error(err.response?.data?.error || "Login failed");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Card className="w-[400px] shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                <CardDescription className="text-center">
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    {!showTwoFactor && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email</label>
                                <Input
                                    name="email"
                                    type="email"
                                    required
                                    disabled={isPending}
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <Input
                                    name="password"
                                    type="password"
                                    required
                                    disabled={isPending}
                                    placeholder="********"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    {showTwoFactor && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Two Factor Code</label>
                            <Input
                                name="code"
                                required
                                disabled={isPending}
                                placeholder="123456"
                                value={formData.code}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to your email.</p>
                        </div>
                    )}

                    {!showTwoFactor && (
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending ? "Signing in..." : (showTwoFactor ? "Confirm" : "Sign in")}
                    </Button>

                    {error && !showTwoFactor && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                            {error}
                        </div>
                    )}
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                    <Button variant="outline" onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`}>
                        GitHub
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}>
                        Google
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-primary hover:underline">
                        Register
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}

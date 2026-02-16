import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function RegisterForm() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        try {
            await register({ name: formData.name, email: formData.email, password: formData.password });
            navigate("/login?registered=true");
            toast.success("Account created! Please check your email to verify.");
        } catch (err: any) {
            setError(err.response?.data?.error || "Something went wrong.");
            toast.error(err.response?.data?.error || "Registration failed");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Card className="w-[400px] shadow-lg">
            <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-4">
                    A
                </div>
                <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                <CardDescription className="text-center">
                    Sign up to get started with AuthFlow
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Name</label>
                        <Input
                            name="name"
                            type="text"
                            required
                            disabled={isPending}
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
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
                            minLength={6}
                            disabled={isPending}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending ? "Creating account..." : "Sign Up"}
                    </Button>

                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                            {error}
                        </div>
                    )}
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}

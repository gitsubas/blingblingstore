import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card";
import { CheckCircle } from "lucide-react";

export function PasswordReset() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await resetPassword(email);

        if (result) {
            setSuccess(true);
        } else {
            setError("No account found with this email address.");
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
                        <p className="text-gray-600">
                            We've sent password reset instructions to <strong>{email}</strong>
                        </p>
                        <p className="text-sm text-gray-500">
                            (This is a mock implementation - no actual email was sent)
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link to="/login" className="w-full">
                            <Button className="w-full">Back to Login</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Reset Password</CardTitle>
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Enter your email to receive reset instructions
                    </p>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                        <p className="text-center text-sm text-gray-600">
                            Remember your password?{" "}
                            <Link to="/login" className="text-primary font-medium hover:underline">
                                Login
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

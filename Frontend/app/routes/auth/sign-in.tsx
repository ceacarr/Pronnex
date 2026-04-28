import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router";
import { postData } from "@/lib/fetch-util";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/provider/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Enter at least 8 characters."),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleOnSubmit = async (values: SignInFormData) => {
    try {
      setLoading(true);
      setError("");

      const res = await postData<{ token: string; user: any }>("/auth/login", values);

      if (res.token && res.user) {
        await login(res);
        toast.success("Login successful!");
      } else {
        throw new Error("Invalid response from server. Please check backend.");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Login failed.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="w-full border-white/65 bg-white/85 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-base">Sign in to your account to continue.</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mt-2">
                      <FormLabel>Password</FormLabel>
                      <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center pt-1">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account? <Link to="/sign-up" className="text-primary hover:underline">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;

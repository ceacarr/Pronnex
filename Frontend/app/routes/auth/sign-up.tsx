import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router";
import { useState } from "react";

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
import { useSignUpMutation } from "@/hooks/use-auth";
import { toast } from "sonner";

const signUpSchema = z
  .object({
    name: z.string().min(3, "Enter at least 3 characters."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Enter at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useSignUpMutation();

  const handleOnSubmit = (values: SignUpFormData) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Email Verification Required", {
          description:
            "Please check your email for a verification link. If you don't see it, check your spam folder.",
        });

        form.reset();
        navigate("/sign-in");
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || "An error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div>
      <Card className="w-full border-white/65 bg-white/85 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl tracking-tight">Create an Account</CardTitle>
          <CardDescription className="text-base">Sign up to get started.</CardDescription>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 text-base" disabled={isPending}>
                {isPending ? "Creating..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center pt-1">
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link to="/sign-in" className="text-primary hover:underline">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;

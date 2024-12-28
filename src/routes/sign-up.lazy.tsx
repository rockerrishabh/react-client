import { useState, useEffect, useRef } from "react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SignUpSchema, signUpSchema } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

export const Route = createLazyFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const { signUp, signUpError, signUpSuccess, auth, signUpLoading } = useAuth();
  const [preview, setPreview] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate({ to: "/dashboard" });
    }
  }, [auth, navigate]);

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      avatar: undefined,
    },
  });

  async function onSubmit(data: SignUpSchema) {
    try {
      await signUp(data);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      form.reset();
      setPreview(undefined);
    }
  }

  useEffect(() => {
    if (signUpSuccess) {
      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account.",
      });
      navigate({ to: "/sign-in" });
    }
  }, [navigate, signUpSuccess]);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        This will be your display name on the platform.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <section className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field: { onChange, onBlur, ref, name } }) => (
                      <FormItem>
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            className="max-w-xs cursor-pointer"
                            accept="image/*"
                            name={name}
                            ref={(e) => {
                              ref(e);
                              fileInputRef.current = e;
                            }}
                            onBlur={onBlur}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                                setPreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          This will be your display image on the platform.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Avatar>
                    <AvatarImage src={preview} />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                </section>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        We'll send you a verification email.
                      </FormDescription>
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
                        <Input
                          type="password"
                          placeholder="Create a secure password"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Must be at least 6 characters with uppercase, lowercase,
                        and numbers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {signUpError && (
                  <Alert variant="destructive" className="text-left">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{signUpError}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signUpLoading}
                >
                  {signUpLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

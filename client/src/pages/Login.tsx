"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "../api/axios";
import useAuth from "@/store/auth";
import { AxiosError } from "axios";

const formSchema = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(32, "Password must be at most 32 characters long"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      identifier: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await axios
        .post("/users/login", data)
        .then((res) => res.data);

      if (res?.data) {
        // Handle successful login
        console.log("Login successful:", res.data);
        login(res.data);
        navigate("/");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        form.setError("identifier", {
          type: "manual",
          message: "User not found or incorrect credentials",
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-2xl font-semibold tracking-tight mb-5">Login</h3>
      <div className="max-w-xs m-auto w-full flex flex-col items-center">
        <Form {...form}>
          <form
            className="w-full space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Email or Username"
                      className="w-full"
                      {...field}
                    />
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
                    <Input
                      type="password"
                      placeholder="Password"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 w-full">
              Continue with Email
            </Button>
          </form>
        </Form>

        <div className="mt-5 space-y-5">
          <p className="text-sm text-center">
            Don&apos;t have an account?
            <Link to="/signup" className="ml-1 underline text-muted-foreground">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

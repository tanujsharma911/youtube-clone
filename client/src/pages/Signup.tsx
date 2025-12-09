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
import ProfileImageCrop from "@/components/ui/ProfileImageCrop";
import { useState } from "react";
import { convertBase64ToFile } from "@/lib/utils";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full Name must be at least 2 characters long")
    .max(100, "Full Name must be at most 100 characters long"),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(100, "Username must be at most 100 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(32, "Password must be at most 32 characters long"),
});

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!croppedImage) {
        console.log("Please select and crop a profile image.");
        return;
      }
      const file = convertBase64ToFile(croppedImage, "profile.jpg");
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("email", data.email);
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("password", data.password);

      const res = await axios.post("/users/register", formData);

      if (res?.data) {
        // Handle successful signup
        console.log("Signup successful:", res.data);
        login(res.data);
        navigate("/login");
      }
    } catch (error) {
      console.log("Signup Error:", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-2xl font-semibold tracking-tight mb-5">Signup</h3>
      <div className="max-w-xs m-auto w-full flex flex-col items-center">
        <Form {...form}>
          <form
            className="w-full space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col text-sm font-medium gap-1 items-center justify-center">
              <div className="relative w-fit">
                <ProfileImageCrop
                  croppedImage={croppedImage}
                  setCroppedImage={setCroppedImage}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Full Name"
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Username"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
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
              Sign Up
            </Button>
          </form>
        </Form>

        <div className="mt-5 space-y-5">
          <p className="text-sm text-center">
            Already have an account?
            <Link to="/login" className="ml-1 underline text-muted-foreground">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

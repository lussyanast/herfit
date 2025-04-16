"use client";

import { Button } from "@/components/atomics/button";
import { Checkbox } from "@/components/atomics/checkbox";
import { Input } from "@/components/atomics/input";
import Title from "@/components/atomics/title";
import Image from "next/image";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/atomics/form";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/atomics/use-toast";
import { useRegisterMutation } from "@/services/auth.service";
import { signIn } from "next-auth/react";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(5, "Nama lengkap minimal 5 karakter")
    .required("Nama lengkap wajib diisi"),
  phone: yup
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(12, "Nomor telepon maksimal 12 digit")
    .required("Nomor telepon wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup
    .string()
    .min(8, "Kata sandi minimal 8 karakter")
    .required("Kata sandi wajib diisi"),
});

type FormData = yup.InferType<typeof schema>;

function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const [register, { isLoading }] = useRegisterMutation();

  async function onSubmit(values: FormData) {
    try {
      const res = await register({
        ...values,
        password_confirmation: values.password,
      }).unwrap();

      if (res.success) {
        const user = res.data;
        await signIn("credentials", {
          id: user.id,
          email: user.email,
          name: user.name,
          token: user.token,
          redirect: false,
        });
        toast({
          title: "Welcome",
          description: "Sign up successfully",
          open: true,
        });

        router.push("/");
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
        description: error.data.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-primary-foreground bg-cover bg-no-repeat bg-right px-4 lg:px-28"
      style={{ backgroundImage: "url('/images/bg-image.png')" }}
    >
      <div className="w-full max-w-md bg-white rounded-[30px] shadow-lg p-8 space-y-6">
        <div className="flex justify-center">
          <Image src="/images/logo.png" alt="HerFit" height={36} width={133} />
        </div>

        <Title title="Buat akun baru" subtitle="" section="" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nama lengkap"
                        icon="/icons/profile.svg"
                        variant="auth"
                        className={form.formState.errors.name ? "border-destructive" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nomor telepon"
                        icon="/icons/call.svg"
                        variant="auth"
                        className={form.formState.errors.phone ? "border-destructive" : ""}
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
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Alamat email"
                        icon="/icons/sms.svg"
                        variant="auth"
                        className={form.formState.errors.email ? "border-destructive" : ""}
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
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Kata sandi"
                        icon="/icons/lock-circle.svg"
                        variant="auth"
                        className={form.formState.errors.password ? "border-destructive" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Saya setuju dengan syarat dan ketentuan
              </label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              Buat akun
            </Button>

            <Link href="/sign-in">
              <Button variant="third" className="w-full mt-5">
                Sudah memiliki akun
              </Button>
            </Link>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
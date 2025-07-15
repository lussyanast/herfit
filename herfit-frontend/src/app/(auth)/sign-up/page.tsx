"use client";

import { Button } from "@/components/atomics/button";
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

// Validasi schema sesuai backend
const schema = yup.object().shape({
  nama_lengkap: yup
    .string()
    .min(5, "Nama lengkap minimal 5 karakter")
    .required("Nama lengkap wajib diisi"),
  no_identitas: yup
    .string()
    .length(16, "Nomor identitas harus 16 digit")
    .nullable(),
  no_telp: yup
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .nullable(),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup
    .string()
    .min(8, "Kata sandi minimal 8 karakter")
    .required("Kata sandi wajib diisi"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Konfirmasi kata sandi tidak cocok")
    .required("Konfirmasi kata sandi wajib diisi"),
});

type FormData = yup.InferType<typeof schema>;

function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nama_lengkap: "",
      no_identitas: "",
      no_telp: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const [register, { isLoading }] = useRegisterMutation();

  async function onSubmit(values: FormData) {
    try {
      const res = await register(values).unwrap();

      if (res.success) {
        const user = res.data;
        await signIn("credentials", {
          id: user.id_pengguna,
          email: user.email,
          name: user.nama_lengkap,
          token: user.token,
          redirect: false,
        });

        toast({
          title: "Berhasil!",
          description: "Pendaftaran berhasil.",
          open: true,
        });

        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Gagal Mendaftar",
        description: error?.data?.message || "Terjadi kesalahan.",
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
              {/* Nama */}
              <FormField
                control={form.control}
                name="nama_lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Nama lengkap"
                        icon="/icons/profile.svg"
                        variant="auth"
                        className={form.formState.errors.nama_lengkap ? "border-destructive" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* No Identitas */}
              <FormField
                control={form.control}
                name="no_identitas"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nomor identitas (NIK)"
                        icon="/icons/card.svg"
                        variant="auth"
                        className={form.formState.errors.no_identitas ? "border-destructive" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telepon */}
              <FormField
                control={form.control}
                name="no_telp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nomor telepon"
                        icon="/icons/call.svg"
                        variant="auth"
                        className={form.formState.errors.no_telp ? "border-destructive" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
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

              {/* Password */}
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

              {/* Konfirmasi Password */}
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Konfirmasi kata sandi"
                        icon="/icons/lock-circle.svg"
                        variant="auth"
                        className={form.formState.errors.password_confirmation ? "border-destructive" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              Buat akun
            </Button>

            <Link href="/sign-in">
              <Button variant="third" className="w-full mt-5">
                Sudah punya akun
              </Button>
            </Link>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
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

const schema = yup.object().shape({
  nama_lengkap: yup.string().min(5).required(),
  no_identitas: yup.string().length(16).nullable(),
  no_telp: yup.string().min(10).max(15).nullable(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Konfirmasi tidak cocok")
    .required(),
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Kiri: background (desktop only) */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-image.png')" }}
      />

      {/* Kanan: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-10 bg-white">
        <div className="w-full max-w-[480px] space-y-6">
          <div className="flex justify-center">
            <Image src="/images/logo.png" alt="HerFit" height={36} width={133} />
          </div>

          <Title title="Buat akun baru" subtitle="" section="" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                {[
                  { name: "nama_lengkap", type: "text", placeholder: "Nama lengkap", icon: "/icons/profile.svg" },
                  { name: "no_identitas", type: "number", placeholder: "Nomor identitas (NIK)", icon: "/icons/card.svg" },
                  { name: "no_telp", type: "number", placeholder: "Nomor telepon", icon: "/icons/call.svg" },
                  { name: "email", type: "email", placeholder: "Alamat email", icon: "/icons/sms.svg" },
                  { name: "password", type: "password", placeholder: "Kata sandi", icon: "/icons/lock-circle.svg" },
                  { name: "password_confirmation", type: "password", placeholder: "Konfirmasi kata sandi", icon: "/icons/lock-circle.svg" },
                ].map(({ name, type, placeholder, icon }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof FormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type={type}
                            placeholder={placeholder}
                            icon={icon}
                            variant="auth"
                            className={form.formState.errors[name as keyof FormData] ? "border-destructive" : ""}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Memproses..." : "Buat akun"}
              </Button>

              <Link href="/sign-in" className="block">
                <Button variant="third" className="w-full mt-5">
                  Sudah punya akun
                </Button>
              </Link>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
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
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/atomics/use-toast";
import { useLoginMutation } from "@/services/auth.service";
import { signIn } from "next-auth/react";

const schema = yup.object().shape({
    email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
    password: yup.string().min(8).max(32).required("Kata sandi wajib diisi"),
});

type FormData = yup.InferType<typeof schema>;

export default function SignIn() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const form = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [login, { isLoading }] = useLoginMutation();

    async function onSubmit(values: FormData) {
        try {
            // validasi login ke backend kamu (jika perlu token tambahan, dsb)
            const res = await login(values).unwrap();

            if (res.success) {
                const result = await signIn("credentials", {
                    redirect: false,
                    email: values.email,
                    password: values.password,
                    callbackUrl: searchParams.get("callbackUrl") || "/dashboard",
                });

                if (result?.ok && result.url) {
                    toast({
                        title: "Berhasil masuk",
                        description: "Selamat datang kembali!",
                        open: true,
                    });
                    router.push(result.url);
                } else {
                    toast({
                        title: "Gagal Login",
                        description: "Email atau password salah.",
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Gagal Login",
                    description: "Autentikasi tidak valid.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Gagal Login",
                description: error?.data?.message || "Terjadi kesalahan.",
                variant: "destructive",
            });
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-primary-foreground bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: "url('/images/bg-image.png')" }}
        >
            <div className="w-full max-w-md bg-white rounded-[30px] shadow-lg p-8 space-y-6">
                <div className="flex justify-center">
                    <Image src="/images/logo.png" alt="HerFit" height={36} width={133} />
                </div>

                <Title title="Masuk" subtitle="" section="" />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-5">
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

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Memproses..." : "Masuk"}
                        </Button>

                        <Link href="/sign-up">
                            <Button variant="third" type="button" className="w-full mt-5">
                                Buat akun baru
                            </Button>
                        </Link>
                    </form>
                </Form>
            </div>
        </div>
    );
}
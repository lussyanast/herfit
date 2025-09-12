"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Input } from "@/components/atomics/input";
import { Button } from "@/components/atomics/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/atomics/form";
import { useToast } from "@/components/atomics/use-toast";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ImageCropper from "@/components/molecules/ImageCropper";

const schema = yup.object().shape({
    nama_lengkap: yup.string().min(3).required("Nama wajib diisi"),
    no_identitas: yup.string().length(16, "Harus 16 digit").required(),
    no_telp: yup.string().min(10).max(15).required(),
    email: yup.string().email().required(),
});

type FormData = yup.InferType<typeof schema>;

export default function EditProfilePage() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    const form = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            nama_lengkap: "",
            no_identitas: "",
            no_telp: "",
            email: "",
        },
    });

    // Ambil data profil
    useEffect(() => {
        const fetchProfile = async () => {
            if (!session?.user?.token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.user.token}`,
                        },
                    }
                );

                const result = await res.json();

                if (res.ok) {
                    form.reset({
                        nama_lengkap: result.data.nama_lengkap,
                        email: result.data.email,
                        no_identitas: result.data.no_identitas,
                        no_telp: result.data.no_telp,
                    });

                    if (result.data.foto_profil) {
                        const cleanBase =
                            process.env.NEXT_PUBLIC_STORAGE_BASE_URL?.replace(/\/$/, "");
                        const cleanPath = result.data.foto_profil.replace(/^\/+/, "");
                        setPreviewImage(`${cleanBase}/storage/${cleanPath}`);
                    }
                } else {
                    throw new Error(result.message);
                }
            } catch (err: any) {
                toast({
                    title: "Gagal mengambil data profil",
                    description: err.message,
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [session, form, toast]);

    // Submit update profil
    async function onSubmit(values: FormData) {
        try {
            const formData = new FormData();
            formData.append("nama_lengkap", values.nama_lengkap);
            formData.append("no_identitas", values.no_identitas);
            formData.append("no_telp", values.no_telp);
            formData.append("email", values.email);
            if (selectedFile) {
                formData.append("foto_profil", selectedFile);
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/update-profile`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session?.user?.token}`,
                    },
                    body: formData,
                }
            );

            const result = await res.json();

            if (res.ok) {
                toast({
                    title: "Berhasil",
                    description: "Profil berhasil diperbarui!",
                });
                setSelectedFile(null);
                setShowCropper(false);

                if (result?.data?.foto_profil) {
                    const cleanBase =
                        process.env.NEXT_PUBLIC_STORAGE_BASE_URL?.replace(/\/$/, "");
                    const cleanPath = result.data.foto_profil.replace(/^\/+/, "");
                    setPreviewImage(`${cleanBase}/storage/${cleanPath}`);
                }

                router.refresh();
            } else {
                throw new Error(result.message);
            }
        } catch (err: any) {
            toast({
                title: "Gagal memperbarui",
                description: err.message,
                variant: "destructive",
            });
        }
    }

    // File input handler
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast({
                title: "File tidak valid",
                description: "Harap unggah file gambar (jpg/png)",
                variant: "destructive",
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropDone = (croppedFile: File) => {
        setSelectedFile(croppedFile);
        setPreviewImage(URL.createObjectURL(croppedFile));
        setShowCropper(false);
    };

    const handleCancelCrop = () => {
        setShowCropper(false);
        setPreviewImage(null);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 pt-20 px-4">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg px-6 py-8 space-y-6">
                {loading ? (
                    <div className="text-center text-sm text-gray-500">
                        Memuat profil...
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center">
                            <Image
                                src="/images/logo.png"
                                alt="HerFit"
                                width={120}
                                height={36}
                                priority
                                className="h-auto w-auto"
                            />
                        </div>

                        <div className="text-center">
                            <h2 className="text-xl font-bold text-secondary">Edit Profil</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Perbarui data pribadi Anda
                            </p>
                        </div>

                        {showCropper && previewImage ? (
                            <ImageCropper
                                image={previewImage}
                                onCropDone={handleCropDone}
                                onCancel={handleCancelCrop}
                            />
                        ) : (
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-5"
                                >
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="nama_lengkap"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="Nama lengkap"
                                                            icon="/icons/profile.svg"
                                                            variant="auth"
                                                            className={
                                                                form.formState.errors.nama_lengkap
                                                                    ? "border-destructive"
                                                                    : ""
                                                            }
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="no_identitas"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Nomor Identitas (NIK)"
                                                            icon="/icons/card.svg"
                                                            variant="auth"
                                                            className={
                                                                form.formState.errors.no_identitas
                                                                    ? "border-destructive"
                                                                    : ""
                                                            }
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="no_telp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Nomor Telepon"
                                                            icon="/icons/call.svg"
                                                            variant="auth"
                                                            className={
                                                                form.formState.errors.no_telp
                                                                    ? "border-destructive"
                                                                    : ""
                                                            }
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
                                                            type="email"
                                                            placeholder="Alamat Email"
                                                            icon="/icons/sms.svg"
                                                            variant="auth"
                                                            className={
                                                                form.formState.errors.email
                                                                    ? "border-destructive"
                                                                    : ""
                                                            }
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Foto profil */}
                                    <div className="flex flex-col gap-2 mt-4">
                                        <label className="text-sm font-medium text-gray-600">
                                            Foto Profil
                                        </label>
                                        {previewImage && (
                                            <Image
                                                src={previewImage}
                                                alt="Preview"
                                                width={80}
                                                height={80}
                                                className="rounded-full object-cover mb-2 border shadow"
                                                unoptimized
                                            />
                                        )}
                                        {!showCropper && (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={onFileChange}
                                                className="border rounded-md px-3 py-2 text-sm"
                                            />
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                    >
                                        Simpan Perubahan
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

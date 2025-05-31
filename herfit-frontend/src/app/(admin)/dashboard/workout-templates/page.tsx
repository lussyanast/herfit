"use client";

import { useEffect, useState } from "react";
import axios from "../../../../lib/axios";

type WorkoutTemplate = {
    id: number;
    template_name: string;
    type: "harian" | "mingguan";
    days: { day: string; workouts: { name: string; reps: string }[] }[];
    user_id?: number;
};

const defaultForm: Omit<WorkoutTemplate, "id"> = {
    template_name: "",
    type: "harian",
    days: [],
};

const allDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function WorkoutTemplatesPage() {
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(defaultForm);
    const [newDay, setNewDay] = useState("Senin");

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("/workout-templates", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTemplates(res.data);
        } catch (err) {
            console.error("Gagal mengambil data template", err);
        } finally {
            setLoading(false);
        }
    };

    const addNewDay = () => {
        if (form.days.some((d) => d.day === newDay)) {
            alert("Hari ini sudah ditambahkan.");
            return;
        }
        setForm({
            ...form,
            days: [...form.days, { day: newDay, workouts: [{ name: "", reps: "" }] }],
        });
    };

    const addWorkout = (dayIdx: number) => {
        const daysCopy = [...form.days];
        daysCopy[dayIdx].workouts.push({ name: "", reps: "" });
        setForm({ ...form, days: daysCopy });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isValid =
            form.template_name.trim() !== "" &&
            form.days.length > 0 &&
            form.days.every(
                (day) =>
                    day.workouts.length > 0 &&
                    day.workouts.every(
                        (w) => w.name.trim() !== "" && w.reps.trim() !== ""
                    )
            );

        if (!isValid) {
            alert("Mohon lengkapi semua kolom sebelum menyimpan.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("/workout-templates", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTemplates((prev) => [...prev, res.data]);
            setForm(defaultForm);
        } catch (err) {
            console.error(err);
            alert("Gagal menambah template.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus template ini?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/workout-templates/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTemplates((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            alert("Gagal menghapus template.");
            console.error(err);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Template Latihan</h1>

            {/* FORM INPUT */}
            <div className="mb-10 p-6 border rounded-xl bg-white shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Tambah Template Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Template</label>
                        <input
                            type="text"
                            value={form.template_name}
                            onChange={(e) => setForm({ ...form, template_name: e.target.value })}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tipe</label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="harian">Harian</option>
                            <option value="mingguan">Mingguan</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tambah Hari Latihan</label>
                        <div className="flex gap-2">
                            <select
                                value={newDay}
                                onChange={(e) => setNewDay(e.target.value)}
                                className="p-2 border rounded-md"
                            >
                                {allDays.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={addNewDay}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                            >
                                + Tambah Hari
                            </button>
                        </div>
                    </div>

                    {form.days.map((day, idx) => (
                        <div key={idx} className="mt-4">
                            <div className="font-semibold text-sm mb-2">{day.day}</div>
                            {day.workouts.map((w, widx) => (
                                <div key={widx} className="flex gap-2 mb-1">
                                    <input
                                        type="text"
                                        placeholder="Nama latihan"
                                        value={w.name}
                                        onChange={(e) => {
                                            const daysCopy = [...form.days];
                                            daysCopy[idx].workouts[widx].name = e.target.value;
                                            setForm({ ...form, days: daysCopy });
                                        }}
                                        className="w-1/2 p-2 border rounded-md"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Reps"
                                        value={w.reps}
                                        onChange={(e) => {
                                            const daysCopy = [...form.days];
                                            daysCopy[idx].workouts[widx].reps = e.target.value;
                                            setForm({ ...form, days: daysCopy });
                                        }}
                                        className="w-1/2 p-2 border rounded-md"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addWorkout(idx)}
                                className="text-sm text-blue-600 mt-1"
                            >
                                + Tambah Latihan
                            </button>
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded-md"
                    >
                        Simpan Template
                    </button>
                </form>
            </div>

            {/* LIST TEMPLATE */}
            {loading ? (
                <p>Memuat data...</p>
            ) : templates.length === 0 ? (
                <p>Belum ada template latihan.</p>
            ) : (
                <div className="space-y-4">
                    {templates.map((template) => (
                        <div key={template.id} className="p-6 rounded-xl border bg-white shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">{template.template_name}</h2>
                                    <p className="text-sm text-gray-600 capitalize">
                                        Tipe: {template.type} | {template.days.length} hari latihan
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
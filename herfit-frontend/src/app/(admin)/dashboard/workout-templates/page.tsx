"use client";

import { useEffect, useState } from "react";
import axios from "../../../../lib/axios";

type WorkoutDay = { day: string; workouts: { name: string; reps: string }[] };
type WorkoutTemplate = {
    id_aktivitas: number;
    nama_aktivitas: string;
    durasi: number;
    jadwal: string;
    tanggal: string;
    days: WorkoutDay[]; // untuk hasil parse dari jadwal
};

const defaultForm = {
    nama_aktivitas: "",
    type: "harian",
    days: [] as WorkoutDay[],
};

const allDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function WorkoutTemplatesPage() {
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [form, setForm] = useState(defaultForm);
    const [newDay, setNewDay] = useState("Senin");

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("/latihan", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const parsed = res.data.map((item: any) => ({
                ...item,
                days: JSON.parse(item.jadwal || "[]"),
            }));

            setTemplates(parsed);
        } catch (err) {
            console.error("Gagal mengambil data template", err);
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

        if (
            form.nama_aktivitas.trim() === "" ||
            form.days.length === 0 ||
            form.days.some(
                (d) => d.workouts.length === 0 || d.workouts.some((w) => !w.name.trim() || !w.reps.trim())
            )
        ) {
            alert("Mohon lengkapi semua kolom sebelum menyimpan.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const payload = {
                nama_aktivitas: form.nama_aktivitas,
                durasi: form.days.length,
                jadwal: JSON.stringify(form.days),
                tanggal: new Date().toISOString().slice(0, 10),
            };

            const res = await axios.post("/latihan", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTemplates((prev) => [...prev, { ...res.data, days: form.days }]);
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
            await axios.delete(`/latihan/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTemplates((prev) => prev.filter((t) => t.id_aktivitas !== id));
        } catch (err) {
            alert("Gagal menghapus template.");
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-center text-primary">Template Latihan</h1>

            {/* Form Input */}
            <div className="p-6 bg-gray-100 rounded-xl shadow-sm space-y-6">
                <h2 className="text-xl font-semibold">Tambah Template Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Template</label>
                            <input
                                type="text"
                                value={form.nama_aktivitas}
                                onChange={(e) => setForm({ ...form, nama_aktivitas: e.target.value })}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tipe</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="harian">Harian</option>
                                <option value="mingguan">Mingguan</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Tambah Hari Latihan</label>
                        <div className="flex gap-3">
                            <select
                                value={newDay}
                                onChange={(e) => setNewDay(e.target.value)}
                                className="p-2 border rounded-md"
                            >
                                {allDays.map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={addNewDay}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                            >
                                + Hari
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {form.days.map((day, idx) => (
                            <div key={idx} className="bg-white border p-4 rounded-md shadow-sm">
                                <h4 className="font-semibold mb-3">{day.day}</h4>
                                {day.workouts.map((w, widx) => (
                                    <div key={widx} className="grid grid-cols-2 gap-2 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Nama latihan"
                                            value={w.name}
                                            onChange={(e) => {
                                                const daysCopy = [...form.days];
                                                daysCopy[idx].workouts[widx].name = e.target.value;
                                                setForm({ ...form, days: daysCopy });
                                            }}
                                            className="p-2 border rounded-md"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Repetisi (mis. 3x12)"
                                            value={w.reps}
                                            onChange={(e) => {
                                                const daysCopy = [...form.days];
                                                daysCopy[idx].workouts[widx].reps = e.target.value;
                                                setForm({ ...form, days: daysCopy });
                                            }}
                                            className="p-2 border rounded-md"
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
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
                        Simpan Template
                    </button>
                </form>
            </div>

            {/* List Template */}
            <div className="space-y-6">
                {templates.map((template) => (
                    <div key={template.id_aktivitas} className="p-6 rounded-xl border bg-white shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">{template.nama_aktivitas}</h2>
                                <p className="text-sm text-gray-600 capitalize">
                                    {template.days?.length || 0} hari latihan | {template.durasi} hari total
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(template.id_aktivitas)}
                                className="text-red-600 hover:underline text-sm"
                            >
                                Hapus
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            {template.days.map((day, idx) => (
                                <div key={idx}>
                                    <h4 className="font-semibold text-sm mb-2 text-gray-800">{day.day}</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {day.workouts.map((workout, widx) => (
                                            <li key={widx}>{workout.name} – {workout.reps}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

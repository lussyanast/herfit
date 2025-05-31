"use client";

import { useEffect, useState } from "react";
import axios from "../../../../lib/axios";
import dayjs from "dayjs";

type FoodEntry = {
    id: number;
    food_name: string;
    calories: number;
    date: string;
};

export default function FoodConsumedPage() {
    const [foodName, setFoodName] = useState("");
    const [calories, setCalories] = useState("");
    const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [entries, setEntries] = useState<FoodEntry[]>([]);
    const [filterDate, setFilterDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [totalCalories, setTotalCalories] = useState(0);

    const fetchEntries = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`/food-consumed?date=${filterDate}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEntries(res.data.data);
            setTotalCalories(res.data.total_calories);
        } catch (err) {
            console.error("Gagal memuat data konsumsi makanan", err);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [filterDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!foodName || !calories) {
            alert("Nama makanan dan kalori wajib diisi.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "/food-consumed",
                { food_name: foodName, calories: parseInt(calories), date },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFoodName("");
            setCalories("");
            fetchEntries();
        } catch (err) {
            console.error("Gagal menyimpan data", err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/food-consumed/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEntries();
        } catch (err) {
            console.error("Gagal menghapus data", err);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Jurnal Diet: Konsumsi Makanan</h1>

            <form onSubmit={handleSubmit} className="space-y-4 mb-10">
                <input
                    type="text"
                    placeholder="Nama Makanan"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    className="w-full border p-2 rounded-md"
                />
                <input
                    type="number"
                    placeholder="Kalori"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full border p-2 rounded-md"
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border p-2 rounded-md"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                    Tambah
                </button>
            </form>

            <div className="mb-6">
                <label className="block mb-1 text-sm">Filter berdasarkan tanggal:</label>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="border p-2 rounded-md"
                />
            </div>

            <h2 className="text-lg font-semibold mb-2">
                Total Kalori: {totalCalories} cal
            </h2>

            <ul className="space-y-2">
                {entries.map((entry) => (
                    <li
                        key={entry.id}
                        className="flex justify-between items-center p-4 border rounded-md bg-white"
                    >
                        <div>
                            <div className="font-medium">{entry.food_name}</div>
                            <div className="text-sm text-gray-600">
                                {entry.calories} kcal - {dayjs(entry.date).format("DD MMM YYYY")}
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-600 text-sm hover:underline"
                        >
                            Hapus
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
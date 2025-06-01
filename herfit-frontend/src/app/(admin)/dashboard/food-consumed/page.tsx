"use client";

import { useEffect, useState } from "react";
import axios from "../../../../lib/axios";
import dayjs from "dayjs";
import groupBy from "lodash.groupby";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

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
    const [filterDate, setFilterDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [startDate, setStartDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));
    const [monthlyEntries, setMonthlyEntries] = useState<FoodEntry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<FoodEntry[]>([]);
    const [totalCalories, setTotalCalories] = useState(0);

    const fetchEntries = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `/food-consumed?start_date=${startDate}&end_date=${endDate}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const allEntries: FoodEntry[] = res.data.data;
            setMonthlyEntries(allEntries);

            const filtered = allEntries.filter(
                (entry) => dayjs(entry.date).format("YYYY-MM-DD") === filterDate
            );
            setFilteredEntries(filtered);

            const total = filtered.reduce((sum, entry) => sum + entry.calories, 0);
            setTotalCalories(total);
        } catch (err) {
            console.error("Gagal memuat data konsumsi makanan", err);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [startDate, endDate, filterDate]);

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

    // 🔍 Filter dulu data chart berdasarkan rentang tanggal
    const filteredForChart = monthlyEntries.filter((entry) => {
        const d = dayjs(entry.date);
        return d.isSameOrAfter(dayjs(startDate)) && d.isSameOrBefore(dayjs(endDate));
    });

    const grouped = groupBy(filteredForChart, (entry) =>
        dayjs(entry.date).format("YYYY-MM-DD")
    );
    const dailyCalories = Object.entries(grouped).map(([date, items]) => ({
        date: dayjs(date).format("YYYY-MM-DD"),
        total_calories: items.reduce((sum, item) => sum + item.calories, 0),
    })).sort((a, b) => a.date.localeCompare(b.date));

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Jurnal Diet: Konsumsi Makanan</h1>

            <form onSubmit={handleSubmit} className="space-y-4 mb-10 bg-gray-100 p-6 rounded-md shadow-sm">
                <h2 className="text-xl font-semibold mb-2">Tambah Makanan</h2>
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
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition">
                    Tambah Makanan
                </button>
            </form>

            <div className="mb-8">
                <label className="block mb-1 text-sm font-medium">Tampilkan Data Tanggal:</label>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="border p-2 rounded-md w-full"
                />
            </div>

            <h2 className="text-lg font-semibold mb-2">
                Total Kalori: {totalCalories} cal
            </h2>

            <ul className="space-y-2 mb-12">
                {filteredEntries.map((entry) => (
                    <li
                        key={entry.id}
                        className="flex justify-between items-center p-4 border rounded-md bg-white shadow-sm"
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

            <div className="mb-4">
                <h2 className="text-xl font-bold mb-4">Rekap Kalori dalam Rentang Tanggal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Mulai Tanggal</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dailyCalories} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) => dayjs(date).format("DD MMM")}
                        interval={0}
                        angle={-30}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_calories" fill="#38A169" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import axios from "../../../../lib/axios";
import dayjs from "dayjs";
import groupBy from "lodash/groupBy";
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
    id_aktivitas: number;
    nama_aktivitas: string;
    kalori: number;
    tanggal: string;
};

export default function FoodConsumedPage() {
    const [foodName, setFoodName] = useState("");
    const [calories, setCalories] = useState("");
    const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [filterDate, setFilterDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [startDate, setStartDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));
    const [entries, setEntries] = useState<FoodEntry[]>([]);

    const fetchEntries = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`/makanan`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const allEntries: FoodEntry[] = res.data.data;
            setEntries(allEntries);
        } catch (err) {
            console.error("Gagal memuat data aktivitas", err);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!foodName || !calories) {
            alert("Nama makanan dan kalori wajib diisi.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "/makanan",
                {
                    nama_aktivitas: foodName,
                    kalori: parseInt(calories),
                    tanggal: date,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFoodName("");
            setCalories("");
            fetchEntries();
        } catch (err) {
            console.error("Gagal menyimpan data aktivitas", err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/makanan/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEntries();
        } catch (err) {
            console.error("Gagal menghapus data aktivitas", err);
        }
    };

    const filteredEntries = entries.filter((entry) =>
        dayjs(entry.tanggal).isSame(dayjs(filterDate), "day")
    );
    const totalCalories = filteredEntries.reduce((sum, entry) => sum + entry.kalori, 0);

    const entriesInRange = entries.filter((entry) =>
        dayjs(entry.tanggal).isSameOrAfter(startDate) &&
        dayjs(entry.tanggal).isSameOrBefore(endDate)
    );

    const grouped = groupBy(entriesInRange, (entry) =>
        dayjs(entry.tanggal).format("YYYY-MM-DD")
    );
    const dailyCalories = Object.entries(grouped)
        .map(([date, items]) => ({
            date: date,
            total_calories: items.reduce((sum, item) => sum + item.kalori, 0),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-center text-pink-600">Jurnal Konsumsi Makanan</h1>

            {/* Form Tambah */}
            <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-xl shadow space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Tambah Makanan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Nama Makanan"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        className="border p-2 rounded-md"
                    />
                    <input
                        type="number"
                        placeholder="Kalori"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="border p-2 rounded-md"
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border p-2 rounded-md"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md transition"
                >
                    Tambah Makanan
                </button>
            </form>

            {/* Filter Harian */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Filter Konsumsi Harian</h2>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="border p-2 rounded-md w-full md:w-1/3"
                />
                <div className="bg-white p-4 rounded-md shadow border">
                    <h3 className="text-md font-semibold mb-2">Total Kalori: {totalCalories} cal</h3>
                    <ul className="space-y-2">
                        {filteredEntries.map((entry) => (
                            <li
                                key={entry.id_aktivitas}
                                className="flex justify-between items-center p-4 border rounded-md bg-gray-50"
                            >
                                <div>
                                    <div className="font-medium">{entry.nama_aktivitas}</div>
                                    <div className="text-sm text-gray-600">
                                        {entry.kalori} kcal – {dayjs(entry.tanggal).format("DD MMM YYYY")}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(entry.id_aktivitas)}
                                    className="text-red-600 text-sm hover:underline"
                                >
                                    Hapus
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Chart Rekap */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Rekap Kalori Berdasarkan Rentang Tanggal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Mulai Tanggal</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2 rounded-md w-full"
                        />
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
        </div>
    );
}

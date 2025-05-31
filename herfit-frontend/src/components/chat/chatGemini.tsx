"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/atomics/button";
import ReactMarkdown from "react-markdown";

type ChatEntry = {
    question: string;
    answer: string;
};

export default function ChatGemini() {
    const [chat, setChat] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [history, setHistory] = useState<ChatEntry[]>([]);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("geminiChatHistory");
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("geminiChatHistory", JSON.stringify(history));
        scrollToBottom();
    }, [history]);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async () => {
        if (!chat.trim()) return;
        setLoading(true);
        const currentQuestion = chat;

        setHistory((prev) => [...prev, { question: currentQuestion, answer: "" }]);
        setChat("");

        try {
            const res = await fetch(
                "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=AIzaSyDZPJntxkV75Wbqrd8jnogp2WRvxjBHwFg",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [{ text: currentQuestion }],
                            },
                        ],
                    }),
                }
            );

            const data = await res.json();
            const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada respons.";

            setHistory((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].answer = result;
                return updated;
            });
        } catch {
            setHistory((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].answer = "Terjadi kesalahan saat mengambil respons.";
                return updated;
            });
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem("geminiChatHistory");
    };

    return (
        <div className="w-full h-[90vh] max-w-5xl mx-auto p-6 flex flex-col bg-white border rounded-2xl shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">💬 Chat Gemini AI</h2>
                <button
                    onClick={clearHistory}
                    className="text-sm text-red-600 hover:underline focus:outline-none"
                >
                    Hapus Riwayat
                </button>
            </div>

            {/* Chat window */}
            <div className="flex-1 overflow-y-auto bg-gray-100 rounded-xl p-4 space-y-4">
                {history.map((entry, idx) => (
                    <div key={idx} className="space-y-2">
                        {/* User bubble - kanan */}
                        <div className="flex justify-end">
                            <div className="bg-primary text-white p-4 rounded-2xl max-w-lg text-sm shadow-md">
                                {entry.question}
                            </div>
                        </div>
                        {/* Gemini bubble - kiri */}
                        <div className="flex justify-start">
                            <div className="bg-white p-4 border rounded-2xl max-w-lg text-sm text-gray-900 shadow-sm">
                                <ReactMarkdown>{entry.answer}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            {/* Chat input */}
            <div className="mt-4">
                <textarea
                    rows={3}
                    value={chat}
                    onChange={(e) => setChat(e.target.value)}
                    placeholder="Tulis pertanyaan di sini..."
                    className="w-full p-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                />
                <div className="text-right mt-2">
                    <Button
                        variant="default"
                        size="header"
                        onClick={sendMessage}
                        disabled={loading}
                    >
                        {loading ? "Menjawab..." : "Kirim"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/atomics/button";
import ReactMarkdown from "react-markdown";

export default function ChatGemini() {
    const [chat, setChat] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const sendMessage = async () => {
        if (!chat.trim()) return;
        setLoading(true);
        setResponse("");

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
                                parts: [{ text: chat }],
                            },
                        ],
                    }),
                }
            );

            const data = await res.json();
            const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
            setResponse(result || "Tidak ada respons.");
        } catch (error) {
            setResponse("Terjadi kesalahan saat mengambil respons.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 border rounded-2xl bg-white shadow-md relative">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">Chat dengan Gemini</h2>

            <div className="mb-4">
                <label htmlFor="chat" className="block text-sm font-medium text-gray-700 mb-1">
                    Pesan
                </label>
                <textarea
                    id="chat"
                    rows={4}
                    required
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm p-3"
                    placeholder="Ketik pertanyaan..."
                    value={chat}
                    onChange={(e) => setChat(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="text-center relative">
                <Button
                    variant="default"
                    size="header"
                    onClick={sendMessage}
                    disabled={loading}
                >
                    Kirim
                </Button>

                {loading && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-3 flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                        <span>Sedang mencari jawaban...</span>
                    </div>
                )}
            </div>

            {response && (
                <div className="mt-8 p-5 border rounded-xl bg-gray-50 shadow-sm">
                    <div className="flex items-start gap-3 mb-2">
                        <div className="bg-primary text-white rounded-full p-2 text-sm font-bold w-8 h-8 flex items-center justify-center">
                            G
                        </div>
                        <h3 className="font-semibold text-gray-700 text-base mt-1">Gemini</h3>
                    </div>
                    <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none">
                        <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}
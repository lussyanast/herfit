"use client";

import dynamic from "next/dynamic";

const ChatGemini = dynamic(() => import("@/components/chat/ChatGemini"), {
    ssr: false,
});

export default function ChatPage() {
    return (
        <main className="pt-48 min-h-screen bg-white">
            <section className="container mx-auto px-4 xl:px-0 text-center">
                <h2 className="text-3xl font-bold mb-2">Tanya Gemini seputar Gym dan Kesehatan!</h2>
                <p className="text-muted-foreground max-w-[500px] mx-auto mb-10">
                    Dapatkan jawaban dari AI seputar jadwal latihan, tips kebugaran, dan lainnya.
                </p>
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <ChatGemini />
                    </div>
                </div>
            </section>
        </main>
    );
}

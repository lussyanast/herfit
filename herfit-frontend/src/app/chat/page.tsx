"use client";

import dynamic from "next/dynamic";

const ChatGemini = dynamic(() => import("@/components/chat/chatGemini"), {
    ssr: false,
});

export default function ChatPage() {
    return (
        <section className="pt-32 px-4 md:px-8 lg:px-12 xl:px-0 max-w-5xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Tanya Gemini seputar Gym dan Kesehatan!
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-[500px] mx-auto mb-8">
                Dapatkan jawaban dari AI seputar jadwal latihan, tips kebugaran, dan lainnya.
            </p>

            <div className="w-full">
                <div className="w-full rounded-xl bg-white shadow border p-4 sm:p-6">
                    <ChatGemini />
                </div>
            </div>
        </section>
    );
}
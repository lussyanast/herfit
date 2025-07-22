"use client";

import { useState } from "react";
import TopMenu from "@/components/molecules/admin/top-menu";
import SideMenu from "@/components/molecules/admin/side-menu";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen relative">
            {/* Sidebar (mobile toggle) */}
            <aside
                className={`fixed z-50 inset-y-0 left-0 w-[250px] bg-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0 lg:block`}
            >
                <SideMenu />
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopMenu onSidebarToggle={() => setSidebarOpen((prev) => !prev)} />
                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
                    <div className="max-w-5xl mx-auto w-full">{children}</div>
                </main>
            </div>
        </div>
    );
}
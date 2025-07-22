"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atomics/dropdown-menu";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type TopMenuProps = {
  onSidebarToggle?: () => void;
};

function TopMenu({ onSidebarToggle }: TopMenuProps) {
  const { data: session } = useSession();
  const [fotoUrl, setFotoUrl] = useState("/images/avatar.png");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });
        const result = await res.json();
        if (res.ok && result?.data?.foto_profil) {
          const path = result.data.foto_profil.replace(/^storage\//, "");
          const base = process.env.NEXT_PUBLIC_STORAGE_BASE_URL?.replace(/\/$/, "");
          setFotoUrl(`${base}/storage/${path}`);
        }
      } catch (err) {
        console.error("Gagal ambil foto profil:", err);
      }
    };
    fetchProfile();
  }, [session]);

  return (
    <header className="w-full h-20 px-6 bg-white border-b flex items-center justify-between z-50">
      {/* Hamburger (mobile only) */}
      <button
        className="lg:hidden text-orange-500"
        onClick={onSidebarToggle}
        aria-label="Toggle Sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger data-login={!!session?.user} className="outline-none">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end max-w-[180px]">
              <span className="text-sm font-medium text-gray-800 truncate">
                {session?.user?.nama_lengkap || "-"}
              </span>
              <span className="text-xs text-gray-400">Member</span>
            </div>
            <Image
              src={fotoUrl}
              alt="avatar"
              width={40}
              height={40}
              unoptimized
              className="rounded-full object-cover border shadow-sm"
              onError={() => setFotoUrl("/images/avatar.png")}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 mt-2 shadow-lg border bg-white rounded-md">
          <DropdownMenuItem>
            <Link href="/dashboard" className="w-full text-sm">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
            <span className="w-full text-sm">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default TopMenu;
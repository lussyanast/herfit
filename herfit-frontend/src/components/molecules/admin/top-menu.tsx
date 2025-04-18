"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atomics/dropdown-menu'
import Title from '@/components/atomics/title'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import Link from "next/link";

function TopMenu() {
  const { data: session } = useSession();

  return (
    <header className='w-full p-[30px] rounded-[30px] bg-white flex justify-between items-center'>
      <div>
        {/* <Input
          icon='/icons/search.svg'
          variant='auth'
          placeholder='Cari item berdasarkan nama...'
          className='w-[400px]'
        /> */}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger data-login={!!session?.user} className='outline-none'>
          <div className='flex items-center space-x-2'>
            <Title
              title={session?.user.name}
              section='header'
              reverse
            />
            <Image
              key={session?.user?.photo_profile}
              src={
                session?.user?.photo_profile
                  ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${session.user.photo_profile}`
                  : "/images/avatar.png"
              }
              alt="avatar"
              height={40}
              width={40}
              unoptimized
              className="rounded-full object-cover"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[240px] mr-8 space-y-4'>
          <DropdownMenuItem><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default TopMenu

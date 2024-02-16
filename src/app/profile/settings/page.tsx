"use client";

import { ChevronLeft, Loader, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  const [saveLoading, setSaveLoading] = useState(false);

  function save() {
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
    }, 1000);
  }

  return (
    <div>
      <div className="flex p-1 items-center bg-zinc-100 border-b border-zinc-200 min-h-10">
        <Link href="/profile">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Профиль</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">Настройки</div>
      </div>
      <div className="m-3 p-4 rounded-md border border-zinc-200 grid grid-cols-2 flex-col gap-2 items-center">
        <label className="font-semibold" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          className="w-full p-2 border border-zinc-200 rounded-md outline-none focus:outline-black"
          id="username"
          defaultValue="mark.pentus"
        />
        <label className="font-semibold" htmlFor="firstName">
          First name
        </label>
        <input
          type="text"
          className="w-full p-2 border border-zinc-200 rounded-md outline-none focus:outline-black"
          id="firstName"
          defaultValue="Mark"
        />
        <label className="font-semibold" htmlFor="lastName">
          Last name
        </label>
        <input
          type="text"
          className="w-full p-2 border border-zinc-200 rounded-md outline-none focus:outline-black"
          id="lastName"
          defaultValue="Pentus"
        />
      </div>
    </div>
  );
}

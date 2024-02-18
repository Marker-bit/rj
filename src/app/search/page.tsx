"use client";

import {
  BookIcon,
  BookMinus,
  BookOpen,
  BookOpenCheck,
  BookOpenTextIcon,
  CalendarDays,
  Check,
  ChevronLeft,
  Edit,
  Loader,
  Plus,
  Search,
  Trash,
  Undo,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AutoResizeInput from "../AutoResize";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { BookView } from "../BookView";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  pages: z.coerce.number().min(1),
});

export default function BooksPage() {
  return (
    <div>
      <div className="flex p-1 items-center bg-zinc-100 border-b border-zinc-200 min-h-10">
        <Link href="/">
          <button className="p-1 hover:text-blue-600 rounded-md flex items-center gap-1 text-blue-500 active:scale-95 transition-all">
            <ChevronLeft className="w-6 h-6" />
            <div className="font-semibold">Главная</div>
          </button>
        </Link>
        <div className="font-semibold absolute left-[50%] translate-x-[-50%]">
          Поиск
        </div>
      </div>
      <form onSubmit={(evt) => {
        evt.preventDefault();
      }}>
        <div className="flex gap-2 m-2 p-2 border border-zinc-100 rounded-xl">
          <Input className="w-full" />
          <button
            className="flex gap-2 items-center w-fit bg-gray-100 rounded-xl py-1 px-3 active:opacity-50 transition-all select-none disabled:opacity-40 border border-zinc-200 mx-auto"
            type="submit"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

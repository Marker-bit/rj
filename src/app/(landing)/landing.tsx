"use client"
import React from "react"
import { ContainerScroll } from "@/components/effects/container-scroll-animation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react";

export function Landing({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="flex flex-col items-center overflow-hidden py-10">
      <div className="flex flex-col items-center gap-2">
        <h1 className="my-10 text-4xl font-bold text-black dark:text-white md:text-[6rem]">
          Читательский дневник
        </h1>

        <Button size="lg" asChild>
          <Link href={loggedIn ? "/home" : "/auth/register"} className="flex items-center gap-2">
            {loggedIn ? "Войти" : "Начать"}
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
      <ContainerScroll titleComponent={<></>}>
        <Image
          src={`/rjrj.png`}
          alt="hero"
          height={910}
          width={1900}
          className="mx-auto h-full rounded-2xl object-cover object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  )
}

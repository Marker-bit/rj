"use client"
import React from "react"
import { ContainerScroll } from "@/components/effects/container-scroll-animation"
import Image from "next/image"

export function Landing({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="flex flex-col items-center overflow-hidden py-10">
      <h1 className="mt-10 text-4xl font-bold text-black dark:text-white md:text-[6rem]">
        Читательский дневник
      </h1>
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

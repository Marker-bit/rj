import Image from "next/image";
import { LoginButton } from "./login-button";
import { use } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function LandingPage({searchParams}: {
  searchParams: SearchParams
}) {
  const { noRedirect } = use(searchParams)

  return (
    <div className="flex flex-col items-center overflow-hidden py-10">
      <div className="flex flex-col items-center gap-2">
        <h1 className="my-10 text-4xl font-bold text-black dark:text-white md:text-[6rem]">
          Читательский дневник
        </h1>

        <LoginButton noRedirect={noRedirect !== undefined} />
      </div>
      <div className="px-5 mt-4 w-full">
        <p className="text-center text-xl">Как всё будет:</p>
        <Image
          src={`/rjrj.png`}
          alt="hero"
          height={910}
          width={1900}
          className="mx-auto w-full mt-5 rounded-2xl block border relative"
          draggable={false}
        />
      </div>
    </div>
  );
}

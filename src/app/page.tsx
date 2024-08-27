import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";

import { api, HydrateClient } from "~/trpc/server";
import { NavBar } from "./_components/navbar";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Patense.ai <span className="text-gray-400">Local</span>
        </h1>
        <div className="text-3xl">100% private AI Prior Art Analysis</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
      </div>
      <div className="font-white">
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href={"/newAnalysis"}
        >
          New Analysis
        </Link>
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href={"/dashboard"}
        >
          All Analyses
        </Link>
      </div>
    </HydrateClient>
  );
}

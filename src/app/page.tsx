"use client";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <div>
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Patense.ai <span className="text-gray-400">Local</span>
        </h1>
        <div className="text-3xl">100% private AI Prior Art Analysis</div>
        <div className="font-white flex flex-row gap-x-8">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={"/newAnalysis"}
          >
            New Analysis
          </Link>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={"/dashboard"}
          >
            All Analyses
          </Link>
        </div>
      </div>
    </div>
  );
}

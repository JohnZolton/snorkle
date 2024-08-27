"use client";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function Dashboard() {
  const [allJobs] = api.job.getAllJobs.useSuspenseQuery();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight">All Analyses</h1>
        {allJobs.map((job) => (
          <div>
            <Link
              className={buttonVariants({ variant: "ghost" })}
              href={`/dashboard/${job.id}`}
            >
              {job.id} - {job.createdAt.toLocaleDateString()}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

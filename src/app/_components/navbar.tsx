"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button, buttonVariants } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import Link from "next/link";
import { ModeToggle } from "./themetoggle";

export function NavBar() {
  const { setTheme } = useTheme();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-row items-center justify-center gap-x-10 px-10 py-4">
      <Link
        href={"/newAnalysis"}
        className={buttonVariants({ variant: "link" })}
      >
        New Analysis
      </Link>
      <Link className={buttonVariants({ variant: "link" })} href={"dashboard"}>
        All Analyses
      </Link>
      <ModeToggle />
    </div>
  );
}

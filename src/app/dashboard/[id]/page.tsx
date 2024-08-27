"use client";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Reference, Page, Feature, Analysis } from "@prisma/client";
import { useEffect, useState } from "react";
import { ModeToggle } from "~/app/_components/themetoggle";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

import { Search } from "lucide-react";
import { LoadingSpinner } from "~/app/_components/loader";
import { useQueryClient } from "@tanstack/react-query";

export default function JobDisplay({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();

  const { data: job, refetch } = api.job.getJob.useQuery({
    jobId: params.id,
  });

  const [searchRefs, setSearchRefs] = useState<
    (Reference & { pages: Page[] })[]
  >([]);

  useEffect(() => {
    console.log(searchRefs);
  }, [searchRefs, setSearchRefs]);

  function toggleAll() {
    if (job && job.references.length === searchRefs.length) {
      // All are selected, so uncheck all
      setSearchRefs([]);
    } else {
      // Not all are selected, so check all
      if (job) {
        setSearchRefs(job.references);
      }
    }
  }
  useEffect(() => {
    console.log("Job data changed:", job);
  }, [job]);

  const { mutate: analyze } = api.job.analyzeFeature.useMutation({
    onSuccess: async (result) => {
      setIsLoading(false);
      console.log(result);

      if (result && result.features && result.features.length > 0) {
        const latestFeature = result.features[result.features.length - 1];
        setFeature(latestFeature);
        console.log("Setting latest feature:", latestFeature);
      }

      queryClient.invalidateQueries();
      await refetch();
    },
    onError: (error) => setIsLoading(false),
  });

  const [isLoading, setIsLoading] = useState(false);

  const [query, setQuery] = useState("");

  function handleAnalyzeFeature() {
    if (searchRefs.length > 0 && query.length > 0) {
      setIsLoading(true);
      analyze({
        jobId: params.id,
        feature: query,
        references: searchRefs,
      });
    }
  }

  const [feature, setFeature] = useState<Feature & { analysis: Analysis[] }>();

  return (
    <div className="flex h-[calc(100vh-108px)] w-full flex-row">
      {/* Left sidebar for feature history */}
      <div className="flex h-full w-32 flex-col gap-y-1 text-ellipsis">
        <div className="text-center">Features</div>
        {job?.features.map((item, index) => (
          <div
            key={`analysis-${index}`}
            className="flex items-start justify-start text-left"
          >
            <Button
              variant={"ghost"}
              className="flex w-full justify-start text-left"
              onClick={() => setFeature(job.features[index])}
            >
              <span className="truncate">{item.feature}</span>
            </Button>
          </div>
        ))}
      </div>

      {/* Main Display */}
      <div className="flex h-full w-full max-w-4xl flex-col items-center justify-between px-4">
        {/* Analysis Display */}
        {!isLoading && (
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">{feature?.feature}</div>
            <ScrollArea>
              {feature?.analysis.map((item, index) => (
                <div
                  key={`analysis-display-${index}`}
                  className="my-2 flex flex-col items-center justify-center gap-y-2 rounded-md border border-border bg-accent p-2 shadow-sm"
                >
                  <div>{item.quote}</div>
                  <div className="text-xs">
                    {item.refTitle} - page {item.refPage}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
        {isLoading && <LoadingSpinner />}
        <div className="flex w-full flex-col items-center justify-center">
          {/* Reference toggle */}
          <Button onClick={toggleAll}>Toggle All</Button>
          <div className="grid w-full grid-cols-2">
            {job?.references.map((ref, index) => (
              <div className="flex flex-row items-center gap-x-2" key={index}>
                <Checkbox
                  id={`ref-${index}`}
                  className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  checked={searchRefs.includes(ref)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSearchRefs((prevRefs) => [...prevRefs, ref]);
                    } else {
                      setSearchRefs((prevRefs) =>
                        prevRefs.filter((r) => r.id !== ref.id),
                      );
                    }
                  }}
                />
                <div>
                  <label
                    htmlFor={`ref-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {ref.title}
                  </label>
                </div>
              </div>
            ))}
          </div>
          {/* Search Bar */}
          <div className="flex w-full max-w-xl flex-row items-center justify-center gap-x-4">
            <Input
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search references for feature"
            />
            <Button
              onClick={handleAnalyzeFeature}
              disabled={searchRefs.length === 0 || query.length === 0}
            >
              <Search />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

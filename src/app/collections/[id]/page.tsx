"use client";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Reference, Page, Feature, Analysis } from "@prisma/client";
import { useEffect, useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

import { Search } from "lucide-react";
import { LoadingSpinner } from "~/app/_components/loader";
import { useQueryClient } from "@tanstack/react-query";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export default function JobDisplay({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();

  const { data: job, refetch } = api.job.getJob.useQuery({
    jobId: params.id,
  });

  const [searchRefs, setSearchRefs] = useState<
    (Reference & { pages: Page[] })[]
  >([]);

  useEffect(() => {
    setSearchRefs(job?.references ?? []);
  }, []);

  function toggleAll() {
    if (job && job.references.length === searchRefs.length) {
      setSearchRefs([]);
    } else {
      if (job) {
        setSearchRefs(job.references);
      }
    }
  }

  const { mutate: analyze } = api.job.deepSearch.useMutation({
    onSuccess: async (result) => {
      setIsLoading(false);

      if (result && result.features && result.features.length > 0) {
        const latestFeature = result.features[result.features.length - 1];
        setFeature(latestFeature);
      }

      await queryClient.invalidateQueries();
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

  const router = useRouter();
  const { mutate: deleteJob } = api.job.deleteJob.useMutation({
    onSuccess: () => router.push("/dashboard"),
  });

  return (
    <div className="flex h-[calc(100vh-96px)] w-full flex-row justify-start">
      {/* Left sidebar for feature history */}
      <div className="flex h-[calc(100vh-96px)] w-48 flex-col justify-between gap-y-1 text-ellipsis">
        <div>
          <div className="text-center">History</div>
          {job?.features.map((item, index) => (
            <div
              key={`analysis-${index}`}
              className="flex items-start justify-start text-left"
            >
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <div className="truncate">
                    <Button
                      variant={"ghost"}
                      className="max-w-full"
                      onClick={() => setFeature(job.features[index])}
                    >
                      <span className="truncate">{item.feature}</span>
                    </Button>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>{item.feature}</HoverCardContent>
              </HoverCard>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant={"destructive"}>Delete Collection</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  collection and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (job) {
                      setIsLoading(true);
                      deleteJob({ jobId: job.id });
                    }
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main Display */}
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-between px-4">
        {/* Analysis Display */}
        {!isLoading && (
          <div className="flex h-5/6 flex-col items-center">
            <div className="text-2xl font-bold">{feature?.feature}</div>
            <ScrollArea className="w-full rounded-md p-4">
              {feature?.analysis.map((item, index) => (
                <div
                  key={`analysis-display-${index}`}
                  className="my-2 flex flex-row items-center justify-between rounded-md border border-border bg-accent p-2 shadow-sm"
                >
                  <div className="flex flex-col items-start justify-start gap-y-2">
                    <div>{item.quote}</div>
                    <div className="text-xs">
                      {item.refTitle} - page {item.refPage}
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Dialog>
                      <DialogTrigger>
                        <HoverCard>
                          <HoverCardTrigger>
                            <FileText />
                          </HoverCardTrigger>
                          <HoverCardContent>Show Context</HoverCardContent>
                        </HoverCard>
                      </DialogTrigger>
                      <DialogContent className="max-h-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            {item.refTitle} - page {item.refPage}
                          </DialogTitle>
                          <DialogDescription>
                            <ScrollArea className="mt-2 h-full max-h-[300px] px-4">
                              {item.refContent}
                            </ScrollArea>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
        {isLoading && <LoadingSpinner />}
        <div className="flex h-1/6 w-full flex-col items-center justify-end">
          {/* Reference toggle */}
          <ScrollArea>
            <div className="grid w-full grid-cols-2">
              {job?.references.map((ref, index) => (
                <div
                  className="flex flex-row items-center justify-center gap-x-2"
                  key={index}
                >
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
          </ScrollArea>
          {/* Search Bar */}
          <div className="flex w-full max-w-3xl flex-row items-center justify-center gap-x-4 pt-2">
            <Button onClick={toggleAll}>Toggle All</Button>
            <Input
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter something to search for"
            />
            {searchRefs.length === 0 || query.length === 0 ? (
              <HoverCard>
                <HoverCardTrigger>
                  <Button
                    onClick={handleAnalyzeFeature}
                    disabled={searchRefs.length === 0 || query.length === 0}
                  >
                    <Search />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  {searchRefs.length === 0 && (
                    <div>Select at least one reference</div>
                  )}
                  {query.length === 0 && <div>Enter an inventive feature</div>}
                </HoverCardContent>
              </HoverCard>
            ) : (
              <Button
                onClick={handleAnalyzeFeature}
                disabled={searchRefs.length === 0 || query.length === 0}
              >
                <Search />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="w-48"></div>
    </div>
  );
}

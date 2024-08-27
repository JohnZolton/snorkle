"use client";
import { useRouter } from "next/navigation";
import {
  PDFDocumentProxy,
  TextItem,
  TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
import Link from "next/link";
import { api } from "~/trpc/react";
import Dropzone from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import { Cloud, Delete } from "lucide-react";
import { Button } from "~/components/ui/button";
import { pdfjs } from "react-pdf";
//import "pdfjs-dist/webpack";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

interface Reference {
  title: string;
  pages: { pageNum: number; content: string }[];
}
export default function Page() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    }
  }, []);

  const [files, setFiles] = useState<File[]>([]);
  const [refs, setRefs] = useState<Reference[]>([]);

  async function extractText(pdf: PDFDocumentProxy) {
    function isTextItem(item: TextItem | TextMarkedContent): item is TextItem {
      return "str" in item;
    }

    let fullText = "";
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter(isTextItem)
        .map((item) => item.str)
        .join(" ");
      fullText += pageText + "\n";
      pages.push({ content: pageText, pageNum: i });
    }
    return pages;
  }

  useEffect(() => {
    async function processFiles() {
      try {
        const refs = await Promise.all(
          files.map(async (file) => {
            const pdf = await pdfjs.getDocument(await file.arrayBuffer())
              .promise;
            const pages = await extractText(pdf as unknown as PDFDocumentProxy);
            return {
              title: file.name,
              pages: pages,
            };
          }),
        );
        setRefs(refs);
      } catch (error) {
        console.error(error);
      }
    }
    processFiles();
  }, [files, setFiles]);

  useEffect(() => {
    console.log(refs);
  }, [refs, setRefs]);

  const router = useRouter();
  const createJob = api.job.createJob.useMutation({
    onSuccess: (job) => router.push(`/dashboard/${job.id}`),
  });

  function handleMakeAnalysis() {
    if (refs.length > 0) {
      createJob.mutate({ references: refs });
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start">
      <div className="container flex max-w-2xl flex-col items-center gap-8 px-4 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight">NEW ANALYSIS</h1>
        <Dropzone
          multiple={true}
          onDrop={(acceptedFiles) => {
            if (acceptedFiles.length > 0 && acceptedFiles[0] !== undefined) {
              onDrop(acceptedFiles);
            }
          }}
        >
          {({ getRootProps, getInputProps, acceptedFiles }) => (
            <div className="m-4 h-48 w-full rounded-[var(--radius)] border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--border))]">
              <div
                {...getRootProps()}
                className="flex h-full w-full items-center justify-center"
              >
                <label
                  htmlFor="dropzone-file"
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-[var(--radius)] hover:bg-[hsl(var(--accent))/0.25]"
                >
                  <div className="flex flex-col items-center justify-center pt-2 text-[hsl(var(--foreground))]">
                    Upload All References
                  </div>
                  <div className="text-[hsl(var(--foreground))]">
                    <Cloud className="h-8 w-8" />
                  </div>
                  <p className="mb-2 text-sm">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <input
                    {...getInputProps()}
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </Dropzone>
        <div>
          {files.map((file, index) => (
            <div
              key={`file-${index}`}
              className="my-2 flex w-full flex-row items-center justify-between gap-x-12"
            >
              <div>{file.name}</div>
              <Button
                variant={"destructive"}
                onClick={() =>
                  setFiles((prev) => [
                    ...prev.slice(0, index),
                    ...prev.slice(index + 1),
                  ])
                }
              >
                <Delete className="" />
              </Button>
            </div>
          ))}
        </div>
        {files.length > 0 && (
          <div>
            <Button disabled={refs.length === 0} onClick={handleMakeAnalysis}>
              Create Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface RefDisplayProps {
  file: File;
}
function RefDisplay({ file }: RefDisplayProps) {}

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button/button";
export function CopySummary({ summary }: { summary: string }) {
  const [result, setResult] = useState("");
  return (
    <div className="grid justify-items-start gap-2">
      <Button
        variant="secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(summary);
            setResult("Summary copied.");
          } catch {
            setResult("Select the summary above to copy it manually.");
          }
        }}
      >
        Copy summary
      </Button>
      <span role="status">{result}</span>
    </div>
  );
}

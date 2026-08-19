import { Loader2 } from "lucide-react";

// Streams a spinner while a page segment awaits its server data. Without this,
// a slow gateway/DB call leaves the browser waiting with no feedback.
export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-8">
      <div className="flex items-center gap-3 text-sm text-body-text">
        <Loader2 className="h-5 w-5 animate-spin text-accent-text" />
        Loading…
      </div>
    </div>
  );
}

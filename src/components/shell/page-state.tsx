import { Loader2, TriangleAlert } from 'lucide-react';

/** Shared loading state every page shows while its mock endpoint resolves. */
export function PageLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex min-h-64 flex-col items-center justify-center gap-2 text-muted-foreground"
    >
      <Loader2 className="size-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** Shared error state for a failed fetch. */
export function PageError({
  message = 'Something went wrong.',
}: {
  message?: string;
}) {
  return (
    <div
      role="alert"
      className="flex min-h-64 flex-col items-center justify-center gap-2 text-muted-foreground"
    >
      <TriangleAlert className="size-5 text-destructive" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

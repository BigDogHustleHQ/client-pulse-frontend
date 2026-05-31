'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonProps = React.ComponentProps<typeof Button>;

// Thin wrapper over the shadcn Button adding a `loading` state with a spinner.
// Named `Btn` to match the design-system inventory used across pages.
function Btn({
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps & { loading?: boolean }) {
  return (
    <Button
      data-slot="btn"
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(className)}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}

export { Btn };

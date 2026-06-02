import * as React from 'react';
import { cn } from '@/lib/utils';

const Panel = ({ className, ...props }: React.ComponentProps<'section'>) => {
  return (
    <section
      data-slot="panel"
      className={cn(
        'flex flex-col gap-4 rounded-xl bg-card p-5 text-card-foreground ring-1 ring-foreground/10',
        'animate-in fade-in-0 duration-300 motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  );
};

const PanelHead = ({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <div
      data-slot="panel-head"
      className={cn('flex items-start justify-between gap-3', className)}
      {...props}
    >
      <div className="flex flex-col gap-0.5">
        {title && (
          <h3 className="font-heading text-base leading-snug font-medium">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
};

export { Panel, PanelHead };

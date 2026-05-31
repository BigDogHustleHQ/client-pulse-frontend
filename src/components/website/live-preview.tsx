'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type {
  WebsiteConfig,
  WebsiteFontPair,
  WebsitePalette,
} from '@/types/website';
import { buildSiteHtml } from './build-site-html';
import { DEVICES, type DeviceId } from './device-frame';

/**
 * Live, isolated render of the configured restaurant site. The full HTML+CSS
 * is built from config and handed to an `<iframe srcDoc>`, so the preview is a
 * real page (not token blocks) and re-renders whenever any control changes.
 *
 * The iframe simulates the selected device's logical width by rendering at that
 * fixed width and scaling down to fit the available container width.
 */
export function LivePreview({
  config,
  palettes,
  fontPairs,
  device,
  className,
}: {
  config: WebsiteConfig;
  palettes: WebsitePalette[];
  fontPairs: WebsiteFontPair[];
  device: DeviceId;
  className?: string;
}) {
  const srcDoc = useMemo(
    () => buildSiteHtml(config, palettes, fontPairs),
    [config, palettes, fontPairs],
  );

  const width = DEVICES.find((d) => d.id === device)?.width ?? 1280;

  return (
    <div
      data-slot="website-preview"
      data-device={device}
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-muted/40',
        className,
      )}
    >
      {/* faux browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </span>
        <span className="truncate rounded-md bg-card px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-foreground/10">
          {config.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.preview
        </span>
      </div>

      {/* The scaler keeps the simulated viewport width fixed and scales it to
          fit the container, so the layout matches the chosen device. */}
      <div className="bg-muted/30 p-3 sm:p-4">
        <div
          className="mx-auto origin-top overflow-hidden rounded-lg shadow-sm ring-1 ring-foreground/10 transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: '100%', maxWidth: width }}
        >
          <iframe
            title={`${config.brandName} preview`}
            srcDoc={srcDoc}
            sandbox="allow-same-origin"
            loading="lazy"
            className="block h-[560px] w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}

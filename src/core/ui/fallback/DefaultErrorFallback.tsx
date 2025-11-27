'use client';

type Props = {
  error: Error;
};

export function DefaultErrorFallback({ error }: Props) {
  return (
    <div className="flex-col-center py-layout">
      <p className="font-caption-16 text-foreground-6">{error.message}</p>
    </div>
  );
}

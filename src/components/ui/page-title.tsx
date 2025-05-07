
import { ReactNode } from 'react';

interface PageTitleProps {
  heading: string;
  text?: string;
  children?: ReactNode;
}

export function PageTitle({ heading, text, children }: PageTitleProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{heading}</h1>
        {text && <p className="mt-1 text-muted-foreground">{text}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

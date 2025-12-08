import type { HTMLAttributes } from 'react';

import DOMPurify, { type Config } from 'isomorphic-dompurify';

type SafeHTMLProps = Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML'> & {
  html?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
};

export function SafeHTML({ html, allowedTags = [], allowedAttributes = [], ...props }: SafeHTMLProps) {
  if (!html) return null;

  const sanitizeConfig: Config = {
    ALLOWED_TAGS: ['span', 'br', 'p', 'a', ...allowedTags],
    ALLOWED_ATTR: ['class', 'href', 'target', ...allowedAttributes],
  };

  const sanitized = DOMPurify.sanitize(html, sanitizeConfig);

  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

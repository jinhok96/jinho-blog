import type { HTMLAttributes } from 'react';

import sanitizeHtml from 'sanitize-html';

type SafeHTMLProps = Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML'> & {
  html?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
};

export function SafeHTML({ html, allowedTags = [], allowedAttributes = [], ...props }: SafeHTMLProps) {
  if (!html) return null;

  const sanitizeConfig: sanitizeHtml.IOptions = {
    allowedTags: ['span', 'br', 'p', 'a', ...allowedTags],
    allowedAttributes: {
      '*': ['class', ...allowedAttributes],
      a: ['href', 'target', ...allowedAttributes],
    },
  };

  const sanitized = sanitizeHtml(html, sanitizeConfig);

  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

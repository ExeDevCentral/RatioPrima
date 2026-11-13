import React, { useMemo } from 'react';
import katex from 'katex';

interface KaTeXViewProps {
  math?: string;
  block?: boolean;
  className?: string;
  children?: string;
}

export function KaTeXInline({ math, className }: { math: string; className?: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false
      });
    } catch {
      return math;
    }
  }, [math]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function KaTeXBlock({ math, className }: { math: string; className?: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: true,
        throwOnError: false
      });
    } catch {
      return math;
    }
  }, [math]);

  return (
    <div
      className={className}
      style={{ overflowX: 'auto', padding: '6px 0' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Parsea un texto con posibles delimitadores $ ... $ o $$ ... $$
 * y lo renderiza de manera segura combinando texto y KaTeX
 */
export function FormattedMathText({ text, className }: { text: string; className?: string }) {
  const elements = useMemo(() => {
    if (!text) return null;

    // Divide en bloques $$...$$ o inline $...$
    const parts: React.ReactNode[] = [];
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let keyIdx = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`txt-${keyIdx++}`}>{text.substring(lastIndex, match.index)}</span>
        );
      }

      const token = match[0];
      if (token.startsWith('$$') && token.endsWith('$$')) {
        const tex = token.slice(2, -2).trim();
        parts.push(<KaTeXBlock key={`tex-block-${keyIdx++}`} math={tex} />);
      } else if (token.startsWith('$') && token.endsWith('$')) {
        const tex = token.slice(1, -1).trim();
        parts.push(<KaTeXInline key={`tex-inline-${keyIdx++}`} math={tex} />);
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={`txt-${keyIdx++}`}>{text.substring(lastIndex)}</span>);
    }

    return parts;
  }, [text]);

  return <div className={className}>{elements}</div>;
}

export default function KaTeXView({ math, block = false, className, children }: KaTeXViewProps) {
  const target = math || children || '';
  if (block) {
    return <KaTeXBlock math={target} className={className} />;
  }
  return <KaTeXInline math={target} className={className} />;
}


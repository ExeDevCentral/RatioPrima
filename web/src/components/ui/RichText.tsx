import React, { useMemo } from 'react';
import { KaTeXBlock, KaTeXInline } from '../KaTeXView';

/**
 * Renderiza texto con matemática inline ($...$), bloques ($$...$$) y negritas (**...**).
 * No usa dangerouslySetInnerHTML para el texto: solo KaTeX lo hace internamente.
 */
export default function RichText({
  text,
  inline = false,
  className
}: {
  text: string;
  inline?: boolean;
  className?: string;
}) {
  const parts = useMemo(() => {
    if (!text) return null;
    // Algunos contenidos guardan LaTeX puro (sin $...$). Lo renderizamos como matemática inline.
    if (!text.includes('$') && /[\\^_{}]/.test(text)) {
      return <KaTeXInline math={text.trim()} />;
    }
    const regex = /(\*\*[^*]+\*\*|\$\$[\s\S]*?\$\$|\$[^$]+?\$)/g;
    const output: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        output.push(<React.Fragment key={`t-${key++}`}>{text.slice(lastIndex, match.index)}</React.Fragment>);
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        output.push(<strong key={`b-${key++}`}>{token.slice(2, -2)}</strong>);
      } else if (token.startsWith('$$') && token.endsWith('$$')) {
        output.push(<KaTeXBlock key={`kb-${key++}`} math={token.slice(2, -2).trim()} />);
      } else if (token.startsWith('$') && token.endsWith('$')) {
        output.push(<KaTeXInline key={`ki-${key++}`} math={token.slice(1, -1).trim()} />);
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      output.push(<React.Fragment key={`t-${key++}`}>{text.slice(lastIndex)}</React.Fragment>);
    }
    return output;
  }, [text]);

  if (inline) return <span className={className}>{parts}</span>;
  return <span className={className}>{parts}</span>;
}

export function FormulaCard({ formula, label }: { formula: string; label?: string }) {
  return (
    <div className="formula-card">
      {label ? <span className="formula-label">{label}</span> : null}
      <KaTeXInline math={formula} />
    </div>
  );
}

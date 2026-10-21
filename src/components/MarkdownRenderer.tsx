'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Split content by code blocks: ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const sections: { type: 'text' | 'code'; lang?: string; content: string }[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      sections.push({
        type: 'text',
        content: content.substring(lastIndex, match.index),
      });
    }
    sections.push({
      type: 'code',
      lang: match[1] || 'java',
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    sections.push({
      type: 'text',
      content: content.substring(lastIndex),
    });
  }

  let codeBlockCounter = 0;

  return (
    <div className="space-y-4 text-slate-200 leading-relaxed text-sm">
      {sections.map((section, idx) => {
        if (section.type === 'code') {
          const currentCodeIdx = codeBlockCounter++;
          const isCopied = copiedCodeIndex === currentCodeIdx;

          return (
            <div
              key={idx}
              className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
                <span className="font-bold uppercase tracking-wider text-emerald-400">
                  {section.lang || 'code'}
                </span>
                <button
                  onClick={() => handleCopyCode(section.content, currentCodeIdx)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono text-emerald-300/90 bg-slate-950/90 leading-relaxed selection:bg-emerald-800 selection:text-white">
                <code>{section.content}</code>
              </pre>
            </div>
          );
        }

        // Render formatted text lines (headings, lists, blockquotes, paragraphs)
        return (
          <div key={idx} className="space-y-3">
            {renderTextLines(section.content)}
          </div>
        );
      })}
    </div>
  );
};

function renderTextLines(rawText: string) {
  const lines = rawText.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-1.5 my-2 ml-4 list-disc marker:text-emerald-400">
          {listItems.map((item, i) => (
            <li key={i} className="text-slate-300 text-xs md:text-sm leading-relaxed">
              {formatInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      flushList();
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-3 pl-4 py-2 border-l-4 border-emerald-500 bg-emerald-500/10 rounded-r-xl text-emerald-200 text-xs md:text-sm font-medium italic"
        >
          {formatInlineFormatting(trimmed.replace(/^>\s*/, ''))}
        </blockquote>
      );
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${i}`} className="text-xl md:text-2xl font-black text-white mt-6 mb-2 border-b border-slate-800 pb-2">
          {formatInlineFormatting(trimmed.replace(/^#\s*/, ''))}
        </h1>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg md:text-xl font-extrabold text-emerald-400 mt-5 mb-2">
          {formatInlineFormatting(trimmed.replace(/^##\s*/, ''))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-bold text-white mt-4 mb-2 flex items-center gap-2">
          {formatInlineFormatting(trimmed.replace(/^###\s*/, ''))}
        </h3>
      );
      continue;
    }

    // Unordered list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(trimmed.replace(/^[-*]\s*/, ''));
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      flushList();
      elements.push(
        <div key={`num-${i}`} className="my-1.5 flex items-start gap-2 text-xs md:text-sm text-slate-300">
          <span className="font-mono text-emerald-400 font-bold">{trimmed.match(/^\d+\./)?.[0]}</span>
          <div>{formatInlineFormatting(trimmed.replace(/^\d+\.\s*/, ''))}</div>
        </div>
      );
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(<hr key={`hr-${i}`} className="border-slate-800 my-4" />);
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="text-xs md:text-sm text-slate-300 leading-relaxed">
        {formatInlineFormatting(trimmed)}
      </p>
    );
  }

  flushList();
  return elements;
}

// Convert inline **bold**, `code`, and links
function formatInlineFormatting(text: string): React.ReactNode {
  // First handle bold with code inside or standard bold: **text**
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-white">
          {inner}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1);
      return (
        <code
          key={i}
          className="font-mono text-[11px] md:text-xs bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded border border-slate-800"
        >
          {code}
        </code>
      );
    }
    return part;
  });
}

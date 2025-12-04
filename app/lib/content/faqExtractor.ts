import type { FaqItem } from "@/app/lib/seo/FaqStructuredDataBuilder";

export function extractFaqItems(content: string): FaqItem[] {
  const lines = content.split(/\r?\n/);
  const items: FaqItem[] = [];
  let inFaqSection = false;
  let currentQuestion: string | null = null;
  let currentAnswer: string[] = [];

  const flush = () => {
    if (currentQuestion && currentAnswer.length) {
      const answer = currentAnswer.join("\n").trim();
      if (answer) {
        items.push({
          question: currentQuestion,
          answer,
        });
      }
    }
    currentQuestion = null;
    currentAnswer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const h2Match = /^##\s+(.*)/i.exec(line);
    if (h2Match) {
      if (inFaqSection) {
        flush();
      }
      const headingText = h2Match[1].trim();
      inFaqSection = /^faq/i.test(headingText);
      continue;
    }

    if (!inFaqSection) {
      continue;
    }

    const h3Match = /^###\s+(.*)/.exec(line);
    if (h3Match) {
      flush();
      currentQuestion = h3Match[1].trim();
      continue;
    }

    if (currentQuestion) {
      currentAnswer.push(rawLine);
    }
  }

  flush();
  return items;
}

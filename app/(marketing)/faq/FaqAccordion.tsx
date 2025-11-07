"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  entries: FaqEntry[];
}

export function FaqAccordion({ entries }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(entries[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="faq-page__accordion">
      {entries.map((entry) => {
        const answerId = `faq-answer-${entry.id}`;
        const isOpen = entry.id === openId;
        return (
          <article key={entry.id} className="faq-page__item">
            <button
              className="faq-page__button"
              type="button"
              aria-expanded={isOpen}
              aria-controls={answerId}
              id={`faq-question-${entry.id}`}
              onClick={() => handleToggle(entry.id)}
            >
              <span>{entry.question}</span>
              <CaretDown
                aria-hidden="true"
                className="faq-page__icon"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
                weight="bold"
              />
            </button>
            <div
              id={answerId}
              role="region"
              aria-labelledby={`faq-question-${entry.id}`}
              className="faq-page__content"
              hidden={!isOpen}
            >
              <p>{entry.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

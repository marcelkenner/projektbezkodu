"use client";

import { useRef, useState } from "react";
import { Alert, Button, Modal, TextareaField } from "@/app/ui";
import styles from "./newsletter.module.css";

interface NewsletterUnsubscribeCopy {
  feedbackField: {
    id: string;
    label: string;
    placeholder: string;
  };
  submitLabel: string;
  confirmation: {
    title: string;
    message: string;
    confirm: string;
    cancel: string;
  };
}

export function NewsletterUnsubscribeForm({
  copy,
  subscriberUuid,
  alert,
}: {
  copy: NewsletterUnsubscribeCopy;
  subscriberUuid?: string;
  alert?:
    | {
        title: string;
        message: string;
        variant: "info" | "success" | "warning" | "danger";
      }
    | null;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const formDisabled = !subscriberUuid;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (formDisabled) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      {alert ? (
        <Alert variant={alert.variant} title={alert.title}>
          {alert.message}
        </Alert>
      ) : null}
      <form
        ref={formRef}
        className={styles.newsletterPage__form}
        action="/api/newsletter/unsubscribe"
        method="post"
        onSubmit={handleSubmit}
      >
        <input
          type="hidden"
          name="subscriberUuid"
          value={subscriberUuid ?? ""}
        />
        <TextareaField
          id={copy.feedbackField.id}
          name="feedback"
          label={copy.feedbackField.label}
          placeholder={copy.feedbackField.placeholder}
          className={styles.newsletterPage__textarea}
          disabled={formDisabled}
        />
        <Button type="submit" variant="secondary" disabled={formDisabled}>
          {copy.submitLabel}
        </Button>
        <p
          role="status"
          aria-live="polite"
          className={styles.newsletterPage__info}
        >
          {alert?.message ??
            (formDisabled
              ? "Link z newslettera jest potrzebny, by wypisać ten adres."
              : "\u00A0")}
        </p>
      </form>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={copy.confirmation.title}
        actions={
          <>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              {copy.confirmation.cancel}
            </Button>
            <Button variant="primary" type="button" onClick={handleConfirm}>
              {copy.confirmation.confirm}
            </Button>
          </>
        }
      >
        <p>{copy.confirmation.message}</p>
      </Modal>
    </>
  );
}

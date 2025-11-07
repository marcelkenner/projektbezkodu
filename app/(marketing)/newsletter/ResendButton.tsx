"use client";

import type { MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/app/ui";

interface ResendButtonProps {
  label: string;
  waitingLabel: string;
  cooldownSeconds?: number;
  subscriberId?: number;
  initialSeconds?: number;
}

export function ResendButton({
  label,
  waitingLabel,
  cooldownSeconds = 15,
  subscriberId,
  initialSeconds = 0,
}: ResendButtonProps) {
  const [disabled, setDisabled] = useState(initialSeconds > 0);
  const [remaining, setRemaining] = useState(
    initialSeconds > 0 ? initialSeconds : cooldownSeconds,
  );

  useEffect(() => {
    if (!disabled) {
      return undefined;
    }
    const interval = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setDisabled(false);
          return cooldownSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [disabled, cooldownSeconds]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled || !subscriberId) {
      event.preventDefault();
      return;
    }
    setDisabled(true);
    setRemaining(cooldownSeconds);
  };

  const buttonLabel = useMemo(() => {
    if (!disabled) {
      return label;
    }
    return waitingLabel.replace(/\d+\s*s/, `${remaining} s`);
  }, [disabled, label, remaining, waitingLabel]);

  return (
    <form action="/api/newsletter/resend" method="post">
      <Button
        type="submit"
        variant="secondary"
        onClick={handleClick}
        aria-disabled={disabled || !subscriberId}
        disabled={!subscriberId}
      >
        {buttonLabel}
      </Button>
    </form>
  );
}

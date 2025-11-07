"use client";

interface RefreshButtonProps {
  label: string;
}

export function RefreshButton({ label }: RefreshButtonProps) {
  const handleClick = () => {
    window.location.reload();
  };

  return (
    <button
      type="button"
      className="pbk-button pbk-button--primary"
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

"use client";

interface ToolsJumpSelectProps {
  tools: Array<{ slug: string; path: string; title: string }>;
}

export function ToolsJumpSelect({ tools }: ToolsJumpSelectProps) {
  return (
    <div className="tools-search">
      <label className="sr-only" htmlFor="tools-jump-select">
        Przejdź do narzędzia
      </label>
      <select
        id="tools-jump-select"
        defaultValue=""
        onChange={(event) => {
          const value = event.target.value;
          if (value) {
            window.location.href = value;
          }
        }}
      >
        <option value="">Przejdź do narzędzia</option>
        {tools.map((tool) => (
          <option key={tool.slug} value={tool.path}>
            {tool.title}
          </option>
        ))}
      </select>
    </div>
  );
}

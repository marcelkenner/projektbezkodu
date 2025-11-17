interface StructuredDataScriptProps {
  data: Record<string, unknown> | Record<string, unknown>[] | null;
  id?: string;
}

export function StructuredDataScript({ data, id }: StructuredDataScriptProps) {
  if (!data) {
    return null;
  }

  const payload = JSON.stringify(data);

  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}

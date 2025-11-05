import "./ui.css";

interface ComparisonFeature {
  label: string;
  values: string[];
}

interface ComparisonTableProps {
  headers: string[];
  features: ComparisonFeature[];
  caption: string;
}

export function ComparisonTable({
  headers,
  features,
  caption,
}: ComparisonTableProps) {
  return (
    <table className="pbk-table">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Funkcja</th>
          {headers.map((header) => (
            <th key={header} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {features.map((feature) => (
          <tr key={feature.label}>
            <th scope="row">{feature.label}</th>
            {feature.values.map((value, index) => (
              <td key={`${feature.label}-${index}`}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import { getCopy } from "../../lib/copy";

export default function PrivacyPolicyPage() {
  const copy = getCopy("privacy");

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
        <p className="pbk-input__description">{copy.lastUpdated}</p>
        <div className="pbk-stack pbk-stack--tight">
          <h2>1. Administrator danych</h2>
          <p>Opis administratora danych i danych kontaktowych.</p>
          <h2>2. Zakres przetwarzanych danych</h2>
          <p>
            Informacje o zebranych danych (np. newsletter, formularze
            kontaktowe).
          </p>
          <h2>3. Cele i podstawa prawna</h2>
          <p>
            Opis celów przetwarzania oraz podstaw prawnych (zgoda, uzasadniony
            interes).
          </p>
          <h2>4. Okres przechowywania</h2>
          <p>
            Dane przechowujemy zgodnie z obowiązującymi przepisami – szczegóły w
            pełnej polityce.
          </p>
        </div>
      </div>
    </section>
  );
}

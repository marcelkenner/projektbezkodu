import { getCopy } from "../../lib/copy";

export default function TermsPage() {
  const copy = getCopy("terms");

  return (
    <section className="section section--surface">
      <div className="pbk-container pbk-stack pbk-stack--tight">
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
        <p className="pbk-input__description">{copy.lastUpdated}</p>
        <div className="pbk-stack pbk-stack--tight">
          <h2>1. Postanowienia ogólne</h2>
          <p>Wprowadzenie do zasad korzystania z serwisu.</p>
          <h2>2. Definicje</h2>
          <p>Lista pojęć używanych w regulaminie.</p>
          <h2>3. Zasady korzystania</h2>
          <p>Prawa i obowiązki użytkowników.</p>
          <h2>4. Postanowienia końcowe</h2>
          <p>Informacje o zmianach regulaminu i kontakcie.</p>
        </div>
      </div>
    </section>
  );
}

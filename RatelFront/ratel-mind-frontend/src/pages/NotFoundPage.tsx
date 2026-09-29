import {Link} from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="notFoundPage">
      <p className="notFoundPage__eyebrow">404</p>
      <h1>Nie znaleziono strony</h1>
      <p>
        Ta podstrona nie istnieje albo została przeniesiona. Wróć na stronę główną
        lub przejdź do testu.
      </p>
      <div className="notFoundPage__actions">
        <Link to="/" className="btn btn--primary">Strona główna</Link>
        <Link to="/test" className="btn btn--ghost">Rozwiąż test</Link>
      </div>
    </section>
  );
}

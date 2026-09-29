import {FormEvent, useState} from "react";
import {api} from "../app/Api.ts";
import type {EmailFormRequest} from "../types/ApiTypes.ts";

const initialForm: EmailFormRequest = {
  name: "",
  surname: "",
  email: "",
  phoneNumber: "",
  message: "",
};

export default function ContactPageLegacy() {
  const [form, setForm] = useState<EmailFormRequest>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (field: keyof EmailFormRequest, value: string) => {
    setForm((current) => ({...current, [field]: value}));
  };

  const validateForm = (): string => {
    if (!form.name.trim()) return "Podaj imię.";
    if (!form.email.trim()) return "Podaj adres e-mail.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Podaj poprawny adres e-mail.";
    if (form.phoneNumber.trim() && !/^\+?[0-9]{7,15}$/.test(form.phoneNumber.trim())) {
      return "Podaj poprawny numer telefonu lub zostaw to pole puste.";
    }
    if (form.message.trim().length < 20) return "Treść wiadomości powinna mieć co najmniej 20 znaków.";
    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.emailForms.send({
        name: form.name.trim(),
        surname: form.surname.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        message: form.message.trim(),
      });
      setSuccess("Dziękujemy. Twoja wiadomość została wysłana.");
      setForm(initialForm);
    } catch (submitError) {
      setError("Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę.");
      console.error("Contact form error", submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contactPage contactPage--wireframe">
      <section className="contactHero contactHero--wireframe">
        <p className="contactHero__eyebrow">Kontakt</p>
        <h1>Kontakt</h1>
        <p className="contactHero__lead contactHero__lead--strong">
          Interesują Cię nasze warsztaty, chcesz lepiej poznać ofertę
          albo myślisz o współpracy?
        </p>
        <p className="contactHero__lead">
          Napisz do nas. Z przyjemnością porozmawiamy o Twoich
          potrzebach i pomożemy znaleźć najlepszy kolejny krok.
        </p>
      </section>

      <section className="contactFormPanel">
        <h2>Formularz kontaktowy</h2>

        <form className="contactForm contactForm--wireframe" onSubmit={handleSubmit}>
          <label className="contactField">
            <span>Imię (wymagane)</span>
            <input value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          </label>

          <label className="contactField">
            <span>Nazwisko</span>
            <input value={form.surname} onChange={(e) => updateField("surname", e.target.value)} />
          </label>

          <label className="contactField">
            <span>Adres email (wymagane)</span>
            <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
          </label>

          <label className="contactField">
            <span>Telefon</span>
            <input value={form.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} />
          </label>

          <label className="contactField">
            <span>Treść wiadomości</span>
            <textarea
              rows={8}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
            />
          </label>

          {error && <p className="contactForm__error">{error}</p>}
          {success && <p className="contactForm__success">{success}</p>}

          <div className="contactForm__actions">
            <button type="submit" className="btn btn--primary btn--small" disabled={isSubmitting}>
              {isSubmitting ? "Wysyłanie..." : "Wyślij"}
            </button>
          </div>
        </form>
      </section>

      <section className="contactLinks">
        <a href="https://instagram.com/ratel_mind" className="contactLinks__item" target="_blank" rel="noreferrer">
          <span className="contactLinks__icon">◉</span>
          <span>@Ratel_Mind</span>
        </a>
        <a href="https://linkedin.com/company/ratelmind" className="contactLinks__item" target="_blank" rel="noreferrer">
          <span className="contactLinks__icon">in</span>
          <span>linkedin.com/company/ratelmind</span>
        </a>
        <a href="tel:+48789000000" className="contactLinks__item">
          <span className="contactLinks__icon">▣</span>
          <span>Text us +48 789 000 000</span>
        </a>
      </section>
    </div>
  );
}

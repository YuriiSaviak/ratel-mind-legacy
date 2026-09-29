import LegalPage from "./LegalPage.tsx";
import {termsContent} from "../content/legalContent.ts";

export default function TermsPage() {
  return <LegalPage document={termsContent}/>;
}

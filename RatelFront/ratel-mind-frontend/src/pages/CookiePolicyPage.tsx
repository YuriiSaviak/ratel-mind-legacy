import LegalPage from "./LegalPage.tsx";
import {cookiePolicyContent} from "../content/legalContent.ts";

export default function CookiePolicyPage() {
  return <LegalPage document={cookiePolicyContent}/>;
}

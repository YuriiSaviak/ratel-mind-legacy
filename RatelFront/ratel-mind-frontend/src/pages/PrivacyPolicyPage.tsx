import LegalPage from "./LegalPage.tsx";
import {privacyPolicyContent} from "../content/legalContent.ts";

export default function PrivacyPolicyPage() {
  return <LegalPage document={privacyPolicyContent}/>;
}

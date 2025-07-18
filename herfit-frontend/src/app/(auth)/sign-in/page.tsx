import { Suspense } from "react";
import SignIn from "./SignIn";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Memuat form masuk...</div>}>
      <SignIn />
    </Suspense>
  );
}
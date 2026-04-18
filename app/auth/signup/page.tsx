import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-20">
        <SignupForm />
      </main>
      <Footer />
    </>
  );
}

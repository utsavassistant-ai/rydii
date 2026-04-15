import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-32 text-center">
        <div className="text-primary text-8xl font-extrabold tracking-tighter">
          404
        </div>
        <h1 className="text-3xl font-extrabold mt-4">
          That scooty rolled away.
        </h1>
        <p className="text-secondary mt-3">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full cta-gradient text-on-primary-fixed px-8 py-4 font-bold"
        >
          Take me home
        </Link>
      </main>
      <Footer />
    </>
  );
}

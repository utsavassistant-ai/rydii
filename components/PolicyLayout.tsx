import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function PolicyLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-2">{title}</h1>
        <p className="text-sm text-secondary mb-10">Last updated: {lastUpdated}</p>
        <div className="prose-rydii space-y-8 text-on-surface/80 leading-relaxed">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-extrabold text-on-surface mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-7">{children}</p>;
}

export function UL({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 text-sm">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

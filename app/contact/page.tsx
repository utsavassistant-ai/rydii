import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Contact Us — Rydii" };

const channels = [
  {
    icon: "mail",
    title: "Email support",
    detail: "support@rydii.in",
    sub: "We reply within 2 hours (7 days a week)",
    href: "mailto:support@rydii.in",
  },
  {
    icon: "phone",
    title: "Phone",
    detail: "+91 80-4600-0000",
    sub: "Mon – Sat, 9 AM – 7 PM IST",
    href: "tel:+918046000000",
  },
  {
    icon: "location_on",
    title: "Registered address",
    detail: "Rydii, 91springboard, Koramangala",
    sub: "Bengaluru, Karnataka 560034",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-14">

        <div className="max-w-xl mb-14">
          <h1 className="text-5xl font-extrabold tracking-tighter mb-4">Get in touch</h1>
          <p className="text-lg text-secondary">
            Have a question about a booking, or just want to say hi? We&apos;re a small team that genuinely cares — reach us through any of the channels below.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {channels.map((c) => (
            <div key={c.title} className="bg-surface-container-low rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                <Icon name={c.icon} className="text-on-primary-fixed !text-[20px]" />
              </div>
              <div>
                <div className="font-extrabold">{c.title}</div>
                {c.href ? (
                  <a href={c.href} className="text-primary font-semibold text-sm underline">{c.detail}</a>
                ) : (
                  <div className="text-sm font-semibold">{c.detail}</div>
                )}
                <div className="text-xs text-secondary mt-1">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ shortcuts */}
        <h2 className="text-2xl font-extrabold mb-6">Common questions</h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mb-20">
          {[
            { q: "How do I cancel my booking?", a: "Log in → My Bookings → Cancel. Refunds follow our cancellation policy." },
            { q: "What documents do I need at pickup?", a: "A valid driving licence. No advance upload required — verify at the hub." },
            { q: "Can I extend my rental?", a: "Yes — contact the vendor directly or write to us at least 2 hours before your drop time." },
            { q: "Is there a security deposit?", a: "Some vendors collect a cash deposit at pickup. This is refunded on return of the vehicle in good condition." },
          ].map(({ q, a }) => (
            <div key={q} className="bg-surface-container-lowest rounded-lg p-5">
              <div className="font-bold text-sm mb-1">{q}</div>
              <div className="text-xs text-secondary leading-relaxed">{a}</div>
            </div>
          ))}
        </div>

        <div className="text-sm text-secondary">
          For partnership or vendor enquiries: <a href="mailto:vendors@rydii.in" className="text-primary underline">vendors@rydii.in</a>
        </div>

      </main>
      <Footer />
    </>
  );
}

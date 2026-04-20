import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";

export const metadata = { title: "About Us — Rydii" };

const stats = [
  { value: "2,000+", label: "Happy riders" },
  { value: "200+", label: "Verified scootys" },
  { value: "2", label: "Cities" },
  { value: "4.8★", label: "Average rating" },
];

const values = [
  { icon: "verified", title: "Verified fleet", body: "Every scooter on Rydii is inspected and insured before it goes live. No surprises at pickup." },
  { icon: "payments", title: "Transparent pricing", body: "One-page checkout, all fees shown upfront. No hidden charges, no last-minute add-ons." },
  { icon: "electric_bolt", title: "Green mobility", body: "Over 40% of our fleet is electric. We're committed to making urban commutes cleaner." },
  { icon: "support_agent", title: "Real support", body: "Human support over email and phone, 7 days a week. We respond within 2 hours." },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-14">

        <div className="max-w-2xl mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Our story</p>
          <h1 className="text-5xl font-extrabold tracking-tighter mb-6">
            Scooty on rent,<br />done right.
          </h1>
          <p className="text-lg text-secondary leading-relaxed">
            Rydii started with a simple frustration — renting a scooty in an Indian city was slow, opaque, and unreliable. We built the platform we wished existed: instant booking, verified vendors, transparent pricing, and a checkout that takes under two minutes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-container-low rounded-lg p-6 text-center">
              <div className="text-4xl font-extrabold tracking-tighter text-primary">{s.value}</div>
              <div className="text-sm text-secondary mt-1 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-surface-container-low rounded-xl p-10 mb-20 max-w-3xl">
          <h2 className="text-2xl font-extrabold mb-4">Our mission</h2>
          <p className="text-secondary leading-relaxed">
            To make short-distance urban mobility affordable, sustainable, and delightful — by connecting riders with trusted local scooter vendors through a single, seamless platform.
          </p>
        </div>

        {/* Values */}
        <h2 className="text-2xl font-extrabold mb-8">What we stand for</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {values.map((v) => (
            <div key={v.title} className="flex gap-4 bg-surface-container-lowest rounded-lg p-6">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <Icon name={v.icon} className="text-on-primary-fixed !text-[20px]" />
              </div>
              <div>
                <h3 className="font-extrabold mb-1">{v.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{v.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Legal identity */}
        <div className="border-t border-outline-variant/30 pt-10 text-sm text-secondary space-y-1">
          <p className="font-bold text-on-surface">Rydii</p>
          <p>India's scooty rental aggregator</p>
          <p>Bengaluru, Karnataka & Delhi, India</p>
          <p>Email: <a href="mailto:support@rydii.in" className="text-primary underline">support@rydii.in</a></p>
          <p>CIN: U72900KA2024PTC000001 (placeholder — update before PhonePe submission)</p>
        </div>

      </main>
      <Footer />
    </>
  );
}

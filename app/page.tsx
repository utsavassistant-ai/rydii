import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScooterCard } from "@/components/ScooterCard";
import { Icon } from "@/components/Icon";
import { CitySelect } from "@/components/CitySelect";
import { getScooters, toScooter } from "@/lib/db";

export default async function HomePage() {
  const dbFeatured = await getScooters({ sort: "rating" });
  const featured = dbFeatured.slice(0, 4).map(toScooter);
  return (
    <>
      <Header />
      <main className="space-y-24 pb-10">
        {/* Hero */}
        <section className="relative px-6 pt-12 md:pt-20">
          <div className="max-w-screen-xl mx-auto flex flex-col items-start gap-10">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-4 py-2 text-sm font-bold text-on-surface-variant">
                <Icon name="verified" className="!text-[16px] text-primary-container" fill />
                25-point inspection on every scooty
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] text-on-background">
                Scooty on rent.{" "}
                <span className="text-primary">Starting ₹299/day.</span>
              </h1>
              <p className="text-lg text-secondary font-body max-w-xl">
                Instant booking, verified vendors, zero hidden charges. The
                smartest way to navigate urban India.
              </p>
            </div>

            {/* Search */}
            <form
              action="/browse"
              className="w-full bg-surface-container-lowest p-4 md:p-5 rounded-xl md:rounded-full shadow-ambient flex flex-col md:flex-row items-stretch md:items-center gap-3"
            >
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3">
                <CitySelect />
                <div className="flex flex-col px-4 py-2 md:py-0 md:border-r md:border-outline-variant/30">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
                    Pickup
                  </label>
                  <input
                    type="date"
                    name="from"
                    className="bg-transparent border-none p-0 focus:ring-0 text-on-surface font-semibold"
                  />
                </div>
                <div className="flex flex-col px-4 py-2 md:py-0">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
                    Return
                  </label>
                  <input
                    type="date"
                    name="to"
                    className="bg-transparent border-none p-0 focus:ring-0 text-on-surface font-semibold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto cta-gradient text-on-primary-fixed px-10 py-4 rounded-full font-bold text-lg hover:opacity-95 active:scale-95 transition-all"
              >
                Find Scooty
              </button>
            </form>

            {/* Hero image */}
            <div className="w-full h-[400px] md:h-[520px] rounded-lg overflow-hidden bg-surface-container-high relative">
              <Image
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=2000&q=80"
                alt="Scooty in the city"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-inverse-on-surface">
                <div className="text-sm font-bold uppercase tracking-widest opacity-80">
                  Bangalore • HSR Layout
                </div>
                <div className="text-3xl font-extrabold mt-1">
                  28 scootys ready to ride
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section>
          <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-end mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">
                Hottest picks
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight mt-2">
                Featured scootys this week
              </h2>
            </div>
            <Link
              href="/browse"
              className="hidden md:inline-flex items-center gap-1 font-headline font-bold text-primary hover:opacity-80"
            >
              View all <Icon name="arrow_forward" className="!text-[18px]" />
            </Link>
          </div>
          <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((s) => (
              <ScooterCard key={s.id} scooter={s} />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-surface-container-low py-16">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              How it works
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mt-2 mb-10">
              Three steps. Zero friction.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "search",
                  title: "Find your scooty",
                  body: "Search 500+ verified scootys across 12 cities. Filter by price, brand, or fuel type.",
                },
                {
                  icon: "event_available",
                  title: "Book instantly",
                  body: "Pick your dates, pay securely via UPI or card. Get your booking locked in under 60 seconds.",
                },
                {
                  icon: "two_wheeler",
                  title: "Ride away",
                  body: "Pick up from the nearest hub or get it delivered. Helmet included. Drop off anywhere.",
                },
              ].map((f) => (
                <div
                  key={f.icon}
                  className="bg-surface-container-lowest rounded-lg p-8 space-y-4"
                >
                  <div className="w-14 h-14 rounded-full cta-gradient flex items-center justify-center">
                    <Icon name={f.icon} className="!text-[28px] text-on-primary-fixed" />
                  </div>
                  <h3 className="text-2xl font-extrabold">{f.title}</h3>
                  <p className="text-secondary">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="max-w-screen-xl mx-auto px-6">
          <div className="rounded-lg bg-inverse-surface text-inverse-on-surface p-10 md:p-16 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Icon
                    key={n}
                    name="star"
                    className="!text-[20px] text-primary-container"
                    fill
                  />
                ))}
              </div>
              <p className="text-2xl md:text-3xl font-headline font-bold leading-tight">
                &ldquo;Rented an Activa in Goa for three days. Smoothest
                process ever — pickup was 90 seconds. This is how renting
                should feel.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4">
                <div className="w-12 h-12 rounded-full bg-primary-container" />
                <div>
                  <div className="font-bold">Aditya Verma</div>
                  <div className="text-sm text-inverse-on-surface/60">
                    Bangalore → Goa, Oct 2025
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { k: "12+", v: "cities live" },
                { k: "500+", v: "scootys" },
                { k: "4.9★", v: "avg rating" },
                { k: "₹299", v: "starting/day" },
                { k: "24/7", v: "support" },
                { k: "0", v: "hidden fees" },
              ].map((s) => (
                <div
                  key={s.v}
                  className="bg-inverse-on-surface/5 rounded-lg p-5 text-center"
                >
                  <div className="text-2xl font-extrabold text-primary-container">
                    {s.k}
                  </div>
                  <div className="text-xs text-inverse-on-surface/70 mt-1">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-screen-xl mx-auto px-6">
          <div className="rounded-lg cta-gradient p-10 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-on-primary-fixed/70">
                For vendors
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-primary-fixed max-w-xl mt-2">
                Own a scooty? Put it to work.
              </h2>
              <p className="text-on-primary-fixed/80 mt-3 max-w-lg">
                Join 200+ vendors earning ₹18K/month on idle scootys. Zero
                listing fees, instant payouts.
              </p>
            </div>
            <Link
              href="/vendor/add"
              className="self-start md:self-auto rounded-full bg-on-primary-fixed text-primary-container px-8 py-4 font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
            >
              List your scooty →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

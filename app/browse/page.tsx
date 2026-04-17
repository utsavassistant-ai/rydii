import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScooterCard } from "@/components/ScooterCard";
import { Icon } from "@/components/Icon";
import { MobileFilterSheet } from "@/components/MobileFilterSheet";
import { cities } from "@/lib/scooters";
import { getScooters, getBrands, toScooter } from "@/lib/db";

type SearchParams = Promise<{
  city?: string;
  category?: string;
  brand?: string;
  sort?: string;
}>;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const selectedCategory = sp.category;
  const selectedBrand = sp.brand;
  const sort = sp.sort || "popularity";

  const [dbList, brands] = await Promise.all([
    getScooters({ city: sp.city, category: selectedCategory, brand: selectedBrand, sort }),
    getBrands(),
  ]);
  const list = dbList.map(toScooter);

  return (
    <>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 md:mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              {sp.city || "Bangalore"} · {list.length} results
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
              Available scootys
            </h1>
          </div>
          {/* Desktop sort pills */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            <SortPill sort={sort} value="popularity" label="Popularity" />
            <SortPill sort={sort} value="price" label="Price" />
            <SortPill sort={sort} value="rating" label="Rating" />
          </div>
        </div>

        {/* Mobile filter + sort bar */}
        <div className="md:hidden flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          <MobileFilterSheet
            city={sp.city || "Bangalore"}
            category={selectedCategory}
            brand={selectedBrand}
            sort={sort}
            count={list.length}
          />
          <SortPill sort={sort} value="popularity" label="Popularity" />
          <SortPill sort={sort} value="price" label="Price" />
          <SortPill sort={sort} value="rating" label="Rating" />
        </div>

        <div className="grid md:grid-cols-[260px_1fr] gap-8">
          {/* Filters — desktop sidebar only */}
          <aside className="hidden md:block space-y-8">
            <FilterGroup title="City">
              <div className="flex flex-wrap gap-2">
                {cities.slice(0, 6).map((c) => (
                  <FilterChip key={c} label={c} active={c === (sp.city || "Bangalore")} href={`/browse?city=${c}`} />
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Category">
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="All"
                  active={!selectedCategory}
                  href={buildUrl(sp, { category: undefined })}
                />
                <FilterChip
                  label="Electric"
                  active={selectedCategory === "Electric"}
                  href={buildUrl(sp, { category: "Electric" })}
                />
                <FilterChip
                  label="Petrol"
                  active={selectedCategory === "Petrol"}
                  href={buildUrl(sp, { category: "Petrol" })}
                />
              </div>
            </FilterGroup>

            <FilterGroup title="Brand">
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="All"
                  active={!selectedBrand}
                  href={buildUrl(sp, { brand: undefined })}
                />
                {brands.map((b) => (
                  <FilterChip
                    key={b}
                    label={b}
                    active={selectedBrand === b}
                    href={buildUrl(sp, { brand: b })}
                  />
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Price range">
              <div className="bg-surface-container-low rounded-lg p-4">
                <div className="flex justify-between text-xs font-bold text-secondary mb-2">
                  <span>₹200</span>
                  <span>₹2000</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={2000}
                  defaultValue={1000}
                  className="w-full accent-primary-container"
                />
              </div>
            </FilterGroup>

            <FilterGroup title="Delivery">
              <label className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4 cursor-pointer">
                <input type="checkbox" className="accent-primary-container" />
                <span className="font-semibold">Free delivery to my location</span>
              </label>
            </FilterGroup>
          </aside>

          <section>
            {list.length === 0 ? (
              <div className="rounded-lg bg-surface-container-low p-16 text-center">
                <Icon name="search_off" className="!text-[48px] text-secondary" />
                <p className="mt-4 text-lg font-bold">No scootys match those filters.</p>
                <Link href="/browse" className="mt-4 inline-block text-primary font-bold">
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((s) => (
                  <ScooterCard key={s.id} scooter={s} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function buildUrl(sp: Record<string, string | undefined>, patch: Record<string, string | undefined>) {
  const merged = { ...sp, ...patch };
  const entries = Object.entries(merged).filter(([, v]) => v);
  if (!entries.length) return "/browse";
  const q = new URLSearchParams(entries as [string, string][]);
  return `/browse?${q.toString()}`;
}

function SortPill({ sort, value, label }: { sort: string; value: string; label: string }) {
  const active = sort === value;
  return (
    <Link
      href={`/browse?sort=${value}`}
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-on-surface text-surface"
          : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
      }`}
    >
      {label}
    </Link>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}

function FilterChip({
  label,
  active,
  href,
}: {
  label: string;
  active: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-primary-container text-on-primary-fixed"
          : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
      }`}
    >
      {label}
    </Link>
  );
}

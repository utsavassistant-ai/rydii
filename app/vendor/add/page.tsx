import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/lib/auth";
import { VendorLayout } from "@/components/VendorLayout";
import { Icon } from "@/components/Icon";

export default function AddScooterPage() {
  async function submit(formData: FormData) {
    "use server";

    const user = await requireAuth();

    const supabase = createClient(await cookies());

    // Verify vendor role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "vendor") {
      redirect("/");
    }

    // Read form fields
    const model = formData.get("model") as string;
    const brand = formData.get("brand") as string;
    const reg = formData.get("reg") as string;
    const year = formData.get("year") as string;
    const price = formData.get("price") as string;
    const topSpeed = formData.get("topSpeed") as string;
    const fuel = formData.get("fuel") as string; // "Petrol" or "Electric"

    // Collect checked amenities
    const amenityOptions = [
      "Helmet",
      "GPS tracking",
      "Phone mount",
      "USB charger",
      "Raincoat",
      "Fuel at start",
    ];
    const amenities = amenityOptions.filter(
      (a) => formData.get(`amenity_${a}`) === "on"
    );

    // Validate registration number (basic format check)
    if (!reg || reg.trim().length < 4) {
      redirect("/vendor/add?error=invalid_reg");
    }

    // Validate required fields
    if (!model || !brand || !price || !topSpeed) {
      redirect("/vendor/add?error=missing_fields");
    }

    // Generate slug from model name
    const slug = model
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Determine fuel-type-specific fields
    const isElectric = fuel === "Electric";
    const category = isElectric ? "Electric" : "Petrol";
    const engine = isElectric ? null : `${year} ${brand} Engine`;
    const mileage = isElectric ? null : "45 km/l";
    const range_km = isElectric ? "100 km" : null;

    const { error } = await supabase.from("scooters").insert({
      slug,
      name: model.trim(),
      brand: brand.trim(),
      category,
      price_per_day: parseInt(price, 10),
      rating: 0,
      reviews_count: 0,
      engine,
      mileage,
      range_km,
      top_speed: `${topSpeed} km/h`,
      city: "Bangalore",
      hub: "HSR Layout",
      image: null,
      gallery: [],
      amenities,
      description: null,
      available: 1,
      vendor_id: user.id,
    });

    if (error) {
      redirect("/vendor/add?error=insert_failed");
    }

    redirect("/vendor?added=1");
  }

  return (
    <VendorLayout active="Add scooty" title="List a new scooty">
      <form action={submit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Photos */}
          <Section title="Photos">
            <div className="border-2 border-dashed border-outline-variant/50 rounded-lg p-10 text-center bg-surface-container-low">
              <Icon name="cloud_upload" className="!text-[48px] text-secondary" />
              <div className="font-bold mt-3">Drop scooty photos here</div>
              <div className="text-sm text-secondary">
                JPG or PNG, up to 5MB. First photo will be the cover.
              </div>
              <button
                type="button"
                className="mt-4 rounded-full bg-on-surface text-surface px-5 py-2 text-sm font-bold"
              >
                Browse files
              </button>
            </div>
          </Section>

          {/* Basics */}
          <Section title="Scooty details">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Model name">
                <input
                  name="model"
                  required
                  placeholder="Activa 6G"
                  className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50"
                />
              </Field>
              <Field label="Brand">
                <input
                  name="brand"
                  required
                  placeholder="Honda"
                  className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50"
                />
              </Field>
              <Field label="Registration number">
                <input
                  name="reg"
                  required
                  placeholder="KA-01-AB-1234"
                  className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50"
                />
              </Field>
              <Field label="Year of manufacture">
                <input
                  name="year"
                  type="number"
                  defaultValue="2024"
                  className="w-full bg-transparent font-bold focus:ring-0 border-none p-0"
                />
              </Field>
            </div>
          </Section>

          {/* Pricing & Specs */}
          <Section title="Pricing & specs">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Daily rental price (₹)">
                <input
                  name="price"
                  type="number"
                  required
                  defaultValue="499"
                  className="w-full bg-transparent font-bold focus:ring-0 border-none p-0"
                />
              </Field>
              <Field label="Top speed (km/h)">
                <input
                  name="topSpeed"
                  type="number"
                  required
                  defaultValue="85"
                  className="w-full bg-transparent font-bold focus:ring-0 border-none p-0"
                />
              </Field>
              <div className="md:col-span-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">
                  Fuel type
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FuelOption label="Petrol" icon="local_gas_station" defaultChecked />
                  <FuelOption label="Electric" icon="bolt" />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Included amenities">
            <div className="grid md:grid-cols-3 gap-3">
              <Amenity label="Helmet" defaultChecked />
              <Amenity label="GPS tracking" />
              <Amenity label="Phone mount" defaultChecked />
              <Amenity label="USB charger" />
              <Amenity label="Raincoat" />
              <Amenity label="Fuel at start" />
            </div>
          </Section>
        </div>

        {/* Right column */}
        <aside className="space-y-6">
          <Section title="Availability">
            <div className="grid grid-cols-2 gap-3">
              <Field label="From">
                <input
                  name="availFrom"
                  type="date"
                  defaultValue="2025-10-03"
                  className="w-full bg-transparent font-bold focus:ring-0 border-none p-0"
                />
              </Field>
              <Field label="To">
                <input
                  name="availTo"
                  type="date"
                  defaultValue="2025-12-31"
                  className="w-full bg-transparent font-bold focus:ring-0 border-none p-0"
                />
              </Field>
            </div>
          </Section>

          <div className="rounded-lg bg-inverse-surface text-inverse-on-surface p-6 space-y-3">
            <Icon name="rocket_launch" className="text-primary-container" fill />
            <h3 className="text-2xl font-extrabold">Ready to list?</h3>
            <p className="text-sm text-inverse-on-surface/70">
              Your scooty will go live instantly. First booking usually lands
              within 48 hours.
            </p>
            <button
              type="submit"
              className="w-full cta-gradient text-on-primary-fixed rounded-full py-3 font-bold hover:opacity-95 active:scale-95 transition"
            >
              List scooty →
            </button>
          </div>
        </aside>
      </form>
    </VendorLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface-container-lowest rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-extrabold">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block bg-surface-container-low rounded-lg p-4">
      <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
        {label}
      </div>
      {children}
    </label>
  );
}

function FuelOption({
  label,
  icon,
  defaultChecked,
}: {
  label: string;
  icon: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4 cursor-pointer">
      <input
        type="radio"
        name="fuel"
        value={label}
        defaultChecked={defaultChecked}
        className="accent-primary-container"
      />
      <Icon name={icon} className="text-primary" />
      <span className="font-bold">{label}</span>
    </label>
  );
}

function Amenity({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4 cursor-pointer">
      <input
        type="checkbox"
        name={`amenity_${label}`}
        defaultChecked={defaultChecked}
        className="accent-primary-container"
      />
      <span className="font-semibold text-sm">{label}</span>
    </label>
  );
}

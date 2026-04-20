import { PolicyLayout, Section, P, UL } from "@/components/PolicyLayout";

export const metadata = { title: "Refund & Cancellation Policy — Rydii" };

export default function RefundPage() {
  return (
    <PolicyLayout title="Refund & Cancellation Policy" lastUpdated="20 April 2026">

      <Section title="1. Overview">
        <P>Rydii aims to provide a hassle-free cancellation and refund experience. This policy applies to all bookings made through the Rydii platform. Refunds are processed to the original payment method used at the time of booking.</P>
      </Section>

      <Section title="2. Cancellation by the Rider">
        <P>The following cancellation schedule applies from the time of cancellation to the scheduled pickup time:</P>
        <UL items={[
          "More than 48 hours before pickup: 100% refund (full amount).",
          "24 – 48 hours before pickup: 75% refund (25% cancellation fee applies).",
          "12 – 24 hours before pickup: 50% refund.",
          "Less than 12 hours before pickup: No refund.",
          "No-show (failure to collect vehicle at scheduled time): No refund.",
        ]} />
        <P>To cancel a booking, log in to your Rydii account, navigate to "My Bookings", and select "Cancel Booking". You may also write to <a href="mailto:support@rydii.in" className="text-primary underline">support@rydii.in</a> with your booking ID.</P>
      </Section>

      <Section title="3. Cancellation by Rydii or Vendor">
        <P>In the rare event that Rydii or the vendor cancels your booking due to vehicle unavailability or operational reasons:</P>
        <UL items={[
          "You will receive a 100% refund of the amount paid.",
          "We will notify you via email and SMS as soon as possible.",
          "We will attempt to offer an alternative vehicle of equal or higher value at no extra charge.",
        ]} />
      </Section>

      <Section title="4. Early Returns">
        <P>If you return the vehicle before the agreed drop-off date and time:</P>
        <UL items={[
          "No refund is issued for unused rental days unless agreed in writing by the vendor.",
          "Please contact the vendor directly to discuss any early return arrangements.",
        ]} />
      </Section>

      <Section title="5. Damage & Security Deposit">
        <P>Certain vendors may collect a refundable security deposit at the time of vehicle handover. This is separate from the booking amount paid on Rydii.</P>
        <UL items={[
          "Security deposits are managed directly by the vendor and are not processed by Rydii.",
          "Deposits are refunded by the vendor (typically within 24-48 hours of return) subject to the vehicle being returned in acceptable condition.",
          "Deductions may be made for damage beyond normal wear and tear, missing accessories, or traffic violations.",
        ]} />
      </Section>

      <Section title="6. Refund Processing Timeline">
        <UL items={[
          "UPI refunds: 1–3 business days.",
          "Credit/Debit card refunds: 5–7 business days (depending on your bank).",
          "Net banking refunds: 3–5 business days.",
          "Refunds are initiated by Rydii within 24 hours of the cancellation being approved.",
        ]} />
        <P>The exact credit date depends on your bank or payment provider. Rydii is not responsible for delays caused by the banking system once the refund is initiated.</P>
      </Section>

      <Section title="7. Non-Refundable Charges">
        <UL items={[
          "Platform fee (₹40) is non-refundable once the booking is confirmed.",
          "Delivery/pickup fees (₹79 per leg) are non-refundable once the delivery/pickup has been scheduled or completed.",
          "Promo code discounts are non-transferable and non-refundable.",
        ]} />
      </Section>

      <Section title="8. Disputes & Escalation">
        <P>If you believe a refund was processed incorrectly or have not received your refund within the stated timeline, please contact us at <a href="mailto:support@rydii.in" className="text-primary underline">support@rydii.in</a> with your booking ID and payment reference number. We will resolve disputes within 7 business days.</P>
      </Section>

    </PolicyLayout>
  );
}

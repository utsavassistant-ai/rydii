import { PolicyLayout, Section, P, UL } from "@/components/PolicyLayout";

export const metadata = { title: "Terms & Conditions — Rydii" };

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated="20 April 2026">

      <Section title="1. Acceptance of Terms">
        <P>By accessing or using the Rydii platform (website at rydii.vercel.app and any associated mobile applications), you agree to be bound by these Terms & Conditions and all applicable laws. If you do not agree, please do not use our services. These terms constitute a binding legal agreement between you and Rydii ("we", "us", "our").</P>
      </Section>

      <Section title="2. Eligibility">
        <P>To use Rydii's rental services you must:</P>
        <UL items={[
          "Be at least 18 years of age.",
          "Hold a valid motor vehicle driving licence issued by a competent authority in India.",
          "Provide accurate, current, and complete information during registration.",
          "Not be barred from using our services under any applicable law.",
        ]} />
      </Section>

      <Section title="3. Booking & Rental Agreement">
        <P>A booking on Rydii constitutes a rental agreement between you (the rider) and the vendor (vehicle owner/operator) listed on the platform. Rydii acts as an aggregator/marketplace and is not the direct service provider unless explicitly stated.</P>
        <UL items={[
          "All bookings are subject to vehicle availability at the time of confirmation.",
          "You must present a valid driving licence at the time of vehicle pickup.",
          "The vehicle must be returned in the same condition as received, with the same fuel level (for petrol vehicles).",
          "Any traffic violations, fines, or penalties incurred during the rental period are solely the rider's responsibility.",
          "Rydii reserves the right to cancel bookings at any time if fraud or misuse is detected.",
        ]} />
      </Section>

      <Section title="4. Pricing & Payments">
        <P>All prices displayed on the platform are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Payments are processed securely via PhonePe Payment Gateway. By completing a payment, you authorise us to charge the displayed amount to your selected payment method.</P>
        <UL items={[
          "Base rental price is per calendar day or part thereof.",
          "A platform fee (₹40) and smart protection fee (₹39) are added per booking.",
          "GST at 18% is applicable on the total order value.",
          "Optional home delivery/pickup attracts a fee of ₹79 per leg.",
        ]} />
      </Section>

      <Section title="5. Cancellation & Refunds">
        <P>Please refer to our <a href="/refund" className="text-primary underline">Refund & Cancellation Policy</a> for full details. Rydii processes refunds as per the timelines and conditions described therein.</P>
      </Section>

      <Section title="6. User Responsibilities">
        <UL items={[
          "Do not ride under the influence of alcohol or any controlled substance.",
          "Do not sub-let, transfer, or assign the vehicle to any third party.",
          "Do not use the vehicle for illegal purposes, racing, or off-road riding.",
          "Report any accident or damage to the vendor and Rydii immediately.",
          "Wear a helmet at all times while operating the vehicle.",
        ]} />
      </Section>

      <Section title="7. Limitation of Liability">
        <P>Rydii's aggregate liability for any claim arising out of or in connection with these terms shall not exceed the total amount paid by you for the specific booking giving rise to the claim. Rydii is not liable for indirect, incidental, or consequential damages including loss of income, data, or goodwill.</P>
      </Section>

      <Section title="8. Intellectual Property">
        <P>All content on the Rydii platform — including logos, text, graphics, and software — is the exclusive property of Rydii and is protected under Indian and international intellectual property laws. Unauthorised reproduction or distribution is strictly prohibited.</P>
      </Section>

      <Section title="9. Governing Law & Disputes">
        <P>These terms are governed by the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka, India. We encourage users to contact us at <a href="mailto:support@rydii.in" className="text-primary underline">support@rydii.in</a> to resolve disputes amicably before initiating legal proceedings.</P>
      </Section>

      <Section title="10. Changes to Terms">
        <P>Rydii reserves the right to modify these terms at any time. Changes will be posted on this page with an updated "last updated" date. Continued use of the platform after changes constitutes acceptance of the revised terms.</P>
      </Section>

      <Section title="11. Contact">
        <P>For any questions regarding these terms, please contact us at <a href="mailto:support@rydii.in" className="text-primary underline">support@rydii.in</a> or visit our <a href="/contact" className="text-primary underline">Contact Us</a> page.</P>
      </Section>

    </PolicyLayout>
  );
}

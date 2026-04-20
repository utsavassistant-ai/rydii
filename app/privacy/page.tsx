import { PolicyLayout, Section, P, UL } from "@/components/PolicyLayout";

export const metadata = { title: "Privacy Policy — Rydii" };

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="20 April 2026">

      <Section title="1. Introduction">
        <P>Rydii ("we", "us", "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and share your data when you use our platform at rydii.vercel.app. By using Rydii, you consent to the practices described in this policy.</P>
      </Section>

      <Section title="2. Information We Collect">
        <P>We collect the following categories of personal information:</P>
        <UL items={[
          "Identity data: full name, date of birth, driving licence number.",
          "Contact data: email address, phone number.",
          "Account data: username, password (stored encrypted), account preferences.",
          "Booking data: pickup/drop locations, rental dates, vehicle details.",
          "Payment data: transaction reference IDs (we do not store full card numbers; payment processing is handled by PhonePe).",
          "Location data: delivery/pickup coordinates (only when you opt for home delivery).",
          "Device data: IP address, browser type, operating system, and usage analytics.",
        ]} />
      </Section>

      <Section title="3. How We Use Your Information">
        <UL items={[
          "To process and manage your bookings.",
          "To verify your identity and driving eligibility.",
          "To process payments and issue refunds.",
          "To send booking confirmations, receipts, and support communications.",
          "To improve our platform, features, and user experience.",
          "To comply with legal obligations under Indian law.",
          "To detect and prevent fraud, abuse, or security incidents.",
        ]} />
      </Section>

      <Section title="4. Data Sharing">
        <P>We share your data only in the following circumstances:</P>
        <UL items={[
          "With the vendor from whom you rent a vehicle (name, phone, booking details) for order fulfilment.",
          "With PhonePe Payment Gateway for secure payment processing.",
          "With Supabase (our database provider) for data storage — they act as a data processor under our instructions.",
          "With law enforcement or regulatory authorities when required by law.",
          "We do not sell your personal data to third parties.",
        ]} />
      </Section>

      <Section title="5. Data Retention">
        <P>We retain your personal data for as long as your account is active or as required to provide our services. Booking records are retained for a minimum of 3 years to comply with applicable tax and financial regulations. You may request deletion of your account and associated data by writing to us at <a href="mailto:support@rydii.in" className="text-primary underline">support@rydii.in</a>.</P>
      </Section>

      <Section title="6. Cookies">
        <P>Rydii uses session cookies strictly necessary for authentication and platform functionality. We do not use third-party advertising cookies. You may disable cookies in your browser settings, but this may affect platform functionality.</P>
      </Section>

      <Section title="7. Data Security">
        <P>We implement industry-standard security measures including TLS/SSL encryption in transit and at-rest encryption for sensitive fields. Access to personal data is restricted to authorised personnel on a need-to-know basis. However, no internet transmission is 100% secure and we cannot guarantee absolute security.</P>
      </Section>

      <Section title="8. Your Rights">
        <P>Under applicable Indian law (including the Digital Personal Data Protection Act, 2023), you have the right to:</P>
        <UL items={[
          "Access the personal data we hold about you.",
          "Correct inaccurate or incomplete data.",
          "Request erasure of your data (subject to legal retention requirements).",
          "Withdraw consent at any time (which may affect your ability to use our services).",
          "Nominate a person to exercise data rights on your behalf.",
        ]} />
        <P>To exercise any of these rights, contact us at <a href="mailto:support@rydii.in" className="text-primary underline">support@rydii.in</a>.</P>
      </Section>

      <Section title="9. Children's Privacy">
        <P>Rydii does not knowingly collect data from individuals under 18 years of age. If we become aware that a minor has provided personal information, we will delete it promptly.</P>
      </Section>

      <Section title="10. Changes to This Policy">
        <P>We may update this policy periodically. The latest version will always be available on this page. Continued use of the platform after changes constitutes your acceptance of the revised policy.</P>
      </Section>

      <Section title="11. Contact">
        <P>For any privacy-related queries, email our Data Protection Officer at <a href="mailto:privacy@rydii.in" className="text-primary underline">privacy@rydii.in</a> or visit our <a href="/contact" className="text-primary underline">Contact Us</a> page.</P>
      </Section>

    </PolicyLayout>
  );
}

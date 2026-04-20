import { PolicyLayout, Section, P, UL } from "@/components/PolicyLayout";

export const metadata = { title: "Delivery Policy — Rydii" };

export default function ShippingPage() {
  return (
    <PolicyLayout title="Delivery Policy" lastUpdated="20 April 2026">

      <Section title="1. About Our Delivery Model">
        <P>Rydii offers two modes for vehicle handover — hub pickup and home delivery. This policy describes both options, applicable charges, and the terms governing vehicle delivery and return.</P>
      </Section>

      <Section title="2. Hub Pickup (Free)">
        <P>Hub pickup is available at all Rydii partner hubs across Bengaluru and Delhi at no additional charge.</P>
        <UL items={[
          "Present your valid driving licence and booking confirmation at the hub.",
          "Hub operating hours: 8:00 AM – 8:00 PM, seven days a week (including public holidays).",
          "Vehicle must be returned to the same hub unless a drop-off transfer has been arranged in advance.",
          "You will be asked to complete a vehicle condition check at pickup and return.",
        ]} />
        <P>Current hub locations include HSR Layout, Indiranagar, Koramangala, Whitefield (Bengaluru) and Connaught Place, Karol Bagh, Saket, Lajpat Nagar, Dwarka, Nehru Place (Delhi). Additional hubs are added regularly — check the app for the latest list.</P>
      </Section>

      <Section title="3. Home Delivery & Pickup">
        <P>Home delivery (vehicle delivered to your address) and home pickup (vehicle collected from your address) are available at a fee of ₹79 per leg within the serviceable delivery zone of each hub.</P>
        <UL items={[
          "Delivery zone: up to 10 km from the nearest Rydii hub.",
          "Delivery fee: ₹79 for delivery to you + ₹79 for collection from you (charged separately at checkout).",
          "Delivery is available between 8:00 AM and 7:00 PM.",
          "Our delivery partner will contact you 30 minutes prior to arrival.",
          "You must be present at the delivery address to receive/return the vehicle.",
          "Delivery areas and availability are subject to change without prior notice.",
        ]} />
      </Section>

      <Section title="4. Delivery Timeslots">
        <P>When selecting home delivery at checkout, you will choose a delivery date and time from your booking's pickup schedule. We aim to deliver within a 30-minute window of the selected time. Delays may occur due to traffic or operational reasons; Rydii is not liable for minor delays.</P>
      </Section>

      <Section title="5. Vehicle Condition at Handover">
        <UL items={[
          "You must inspect the vehicle for any pre-existing damage at the time of delivery and report discrepancies to the delivery agent immediately.",
          "A photo/video of the vehicle condition will be taken at delivery and return.",
          "You are liable for any damage that occurs during the rental period beyond pre-existing damage documented at handover.",
        ]} />
      </Section>

      <Section title="6. Failed Delivery Attempt">
        <P>If our delivery agent is unable to reach you at the provided address and time:</P>
        <UL items={[
          "One re-attempt will be made within 2 hours at no additional charge.",
          "If the second attempt also fails, the booking may be cancelled and refunded as per our Refund Policy (delivery fee non-refundable).",
        ]} />
      </Section>

      <Section title="7. Fuel Policy">
        <P>Petrol scooters are delivered with a full or agreed fuel level. You are expected to return the vehicle with the same fuel level. Fuel shortfall will be charged at actuals plus a ₹50 handling fee.</P>
        <P>Electric scooters are delivered with a minimum 80% charge. There is no charge-on-return requirement; however, you must not return a vehicle with less than 10% battery.</P>
      </Section>

      <Section title="8. Contact">
        <P>For delivery-related queries, reach us at <a href="mailto:support@rydii.in" className="text-primary underline">support@rydii.in</a> or call our support line. See our <a href="/contact" className="text-primary underline">Contact Us</a> page for full details.</P>
      </Section>

    </PolicyLayout>
  );
}

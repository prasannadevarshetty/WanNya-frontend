import DashboardContainer from "@/components/dashboard/DashboardContainer";
import BackHeader from "@/components/common/BackHeader";
import PaymentCard from "@/components/profile/payment/PaymentCard";

export default function PaymentsPage() {
  return (
    <DashboardContainer>
      <BackHeader title="Payment Methods" />
      <PaymentCard />
    </DashboardContainer>
  );
}
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import BackHeader from "@/components/common/BackHeader";
import AddressCard from "@/components/profile/address/AddressCard";

export default function AddressesPage() {
  return (
    <DashboardContainer>
      <BackHeader title="Addresses" />
      <AddressCard />
    </DashboardContainer>
  );
}
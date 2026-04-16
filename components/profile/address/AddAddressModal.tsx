"use client";

import Modal from "@/components/ui/Model";
import AddressForm from "./AddressForm";
import { useProfileStore } from "@/store/useProfileStore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; 
};

export default function AddAddressModal({ isOpen, onClose, initialData }: Props) {
  const { addAddressToDB } = useProfileStore();

  const handleSubmit = (data: any) => {
    void addAddressToDB(data);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Add New Address"
      subtitle="Save your delivery location for faster checkout"
    >
      <AddressForm onSubmit={handleSubmit} />

      <div className="mt-5 flex justify-center">
      <button
        onClick={onClose}
        className="text-sm text-gray-500 hover:text-gray-700 transition"
      >
        Cancel
      </button>
    </div>
    </Modal>
  );
}
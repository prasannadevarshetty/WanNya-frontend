"use client";

import Modal from "@/components/ui/Model";
import PaymentForm from "./PaymentForm";
import { useProfileStore } from "@/store/useProfileStore";

type PaymentFormData = {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PaymentFormData;
};

type Payment = {
  id: string;
  brand: string;
  last4: string;
  active: boolean;
};

export default function AddPaymentModal({ isOpen, onClose, initialData }: Props) {
  const { addPaymentToDB } = useProfileStore();

  const handleSubmit = (data: PaymentFormData) => {
    // Convert form data to store format
    const brand = data.number.startsWith('4') ? 'Visa' : data.number.startsWith('5') ? 'Mastercard' : 'Card';
    const last4 = data.number.slice(-4);
    
    if (initialData) {
      // For editing, we'd need to find the existing payment by some identifier
      // For now, just add as new
      const payment: Payment = {
        id: crypto.randomUUID(),
        brand,
        last4,
        active: true
      };
      void addPaymentToDB(payment);
    } else {
      const payment: Payment = {
        id: crypto.randomUUID(),
        brand,
        last4,
        active: true
      };
      void addPaymentToDB(payment);
    }
    onClose();
  };
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Add Payment Method"
    >
      <PaymentForm onSubmit={handleSubmit} initialData={initialData} />

      <div className="mt-5 flex justify-center">
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
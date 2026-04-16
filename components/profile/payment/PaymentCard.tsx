"use client";

import { useState } from "react";
import {
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { type Payment } from "@/types";
import Button from "@/components/ui/Button";
import AddPaymentModal from "./AddPaymentModal";
import EmptyPayments from "./EmptyPayments";

export default function PaymentCard() {
  const { payments } = useProfileStore();

  const [openModal, setOpenModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 space-y-5">

      {/* EMPTY STATE */}
      {payments.length === 0 ? (
        <EmptyPayments onAdd={() => setOpenModal(true)} />
      ) : (
        <>
          {payments.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedPayment(p); // ✅ edit mode
                setOpenModal(true);
              }}
              className="cursor-pointer flex justify-between items-center gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:scale-[1.01] transition"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <CreditCard className="text-[#d4a017]" size={18} />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">
                    {p.brand}{" "}
                    <span className="text-gray-500">
                      {p.last4 && `•••• ${p.last4}`}
                    </span>
                  </h4>

                  {p.active && (
                    <p className="text-xs text-gray-500">
                      Default payment
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              {p.active ? (
                <span className="flex items-center gap-1 bg-[#d4a017] text-white px-3 py-1 rounded-full text-xs">
                  <CheckCircle size={14} />
                  Active
                </span>
              ) : (
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation(); 
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
          ))}

          {/* ADD BUTTON */}
          <Button
            onClick={() => {
              setSelectedPayment(null); // add mode
              setOpenModal(true);
            }}
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
          >
            Add another payment method
          </Button>
        </>
      )}

      {/* MODAL */}
      <AddPaymentModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedPayment(null);
        }}
        initialData={selectedPayment ? {
          number: `****-****-****-${selectedPayment.last4}`,
          name: "Cardholder",
          expiry: "12/25",
          cvv: "***"
        } : undefined}
      />
    </div>
  );
}
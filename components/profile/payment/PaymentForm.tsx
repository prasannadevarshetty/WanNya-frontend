"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

type Payment = {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
};

type Props = {
  onSubmit: (data: Payment) => void;
  initialData?: Payment | null;
};

export default function PaymentForm({ onSubmit, initialData }: Props) {
  const [form, setForm] = useState<Payment>({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // ✅ Prefill (edit mode)
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">

      {/* Card Number */}
      <input
        name="number"
        value={form.number}
        placeholder="Card Number"
        onChange={handleChange}
        className="w-full input"
        required
      />

      {/* Name */}
      <input
        name="name"
        value={form.name}
        placeholder="Name on Card"
        onChange={handleChange}
        className="w-full input"
        required
      />

      {/* Expiry + CVV */}
      <div className="flex gap-3">
        <input
          name="expiry"
          value={form.expiry}
          placeholder="MM/YY"
          onChange={handleChange}
          className="w-full input"
          required
        />
        <input
          name="cvv"
          value={form.cvv}
          placeholder="CVV"
          onChange={handleChange}
          className="w-full input"
          required
        />
      </div>

      {/* Submit */}
      <Button className="w-full mt-2">
        {initialData ? "Update Payment Method" : "Save Payment Method"}
      </Button>

    </form>
  );
}
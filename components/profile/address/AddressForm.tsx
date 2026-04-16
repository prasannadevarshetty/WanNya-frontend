"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

type Address = {
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

type Props = {
  onSubmit: (data: Address) => void;
  initialData?: Address | null;
};

export default function AddressForm({ onSubmit, initialData }: Props) {
  const [form, setForm] = useState<Address>({
    label: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  // ✅ Prefill when editing
  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    }
  }, [initialData]);

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        name="label"
        value={form.label}
        placeholder="Label (Home, Office)"
        className="w-full input"
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="street"
        value={form.street}
        placeholder="Street Address"
        className="w-full input"
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="city"
        value={form.city}
        placeholder="City"
        className="w-full input"
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="state"
        value={form.state}
        placeholder="State"
        className="w-full input"
        onChange={handleChange}
      />

      <input
        type="text"
        name="country"
        value={form.country}
        placeholder="Country"
        className="w-full input"
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="zip"
        value={form.zip}
        placeholder="ZIP Code"
        className="w-full input"
        onChange={handleChange}
      />

      <Button className="w-full mt-2">
        {initialData ? "Update Address" : "Save Address"}
      </Button>

    </form>
  );
}
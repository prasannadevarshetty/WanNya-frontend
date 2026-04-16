export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  rating: number;
};

export type Address = {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  active: boolean;
};

export type Payment = {
  id: string;
  brand: string;
  last4?: string;
  active?: boolean;
};

export type Order = {
  id: string;
  title: string;
  category: "shop" | "booking" | "bento";
  price: number;
  date: string;
  status: "completed" | "ongoing" | "cancelled";
};

export type Pet = {
  id: string;
  name: string;
  breed: string;
  type: "dog" | "cat";
  gender: "M" | "F" | null;
  dob: {
    date: string;
    month: string;
    year: string;
  };
  allergies: string[];
  sensitivities: string[];
  photo?: string | null;
};

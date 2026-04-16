"use client";

import ScrollPicker from "./ScrollPicker";
import { useTranslations } from "next-intl";

const dates = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const years = Array.from({ length: 20 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

type Props = {
  date: string;
  month: string;
  year: string;
  setDate: (v: string) => void;
  setMonth: (v: string) => void;
  setYear: (v: string) => void;
};

export default function DOBPicker({
  date,
  month,
  year,
  setDate,
  setMonth,
  setYear,
}: Props) {
  const t = useTranslations("age");

  const months = [
    t("months.jan"),
    t("months.feb"),
    t("months.mar"),
    t("months.apr"),
    t("months.may"),
    t("months.jun"),
    t("months.jul"),
    t("months.aug"),
    t("months.sep"),
    t("months.oct"),
    t("months.nov"),
    t("months.dec"),
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-8 text-center">
        
        {/* Date */}
        <div className="flex flex-col items-center">
          <span className="mb-3 text-sm font-semibold text-gray-500">
            {t("date")}
          </span>
          <ScrollPicker items={dates} value={date} onChange={setDate} />
        </div>

        {/* Month */}
        <div className="flex flex-col items-center">
          <span className="mb-3 text-sm font-semibold text-gray-500">
            {t("month")}
          </span>
          <ScrollPicker items={months} value={month} onChange={setMonth} />
        </div>

        {/* Year */}
        <div className="flex flex-col items-center">
          <span className="mb-3 text-sm font-semibold text-gray-500">
            {t("year")}
          </span>
          <ScrollPicker items={years} value={year} onChange={setYear} />
        </div>

      </div>
    </div>
  );
}

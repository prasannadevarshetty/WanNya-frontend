"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  noScroll?: boolean;
};

export default function DashboardContainer({
  children,
  noScroll,
}: Props) {
  return (
    <main
      className={`
        relative
        w-full
        overflow-x-hidden

        bg-[#fff9ec]

        px-4 sm:px-6
        pt-6
        ${noScroll ? "pb-6" : "pb-28"}

        rounded-t-3xl
        shadow-[0_-6px_24px_rgba(0,0,0,0.08)]

        max-w-[1200px]
        mx-auto

        sm:rounded-none
        sm:shadow-none

        ${noScroll ? "sm:min-h-fit" : "sm:min-h-[calc(100vh-160px)]"}
      `}
    >
      {children}
    </main>
  );
}
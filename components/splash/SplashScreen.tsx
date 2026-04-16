"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import SplashCarousel from "./SplashCarousel";
import AuthButton from "@/components/ui/AuthButton";
import { useTranslations } from "next-intl";

export default function SplashScreen() {
const router = useRouter();
const t = useTranslations('welcome');

return ( <main className="min-h-screen w-full overflow-x-hidden bg-[#fff9ec] flex flex-col items-center px-6 pb-10">


  {/* Branding */}
  <div className="flex flex-col items-center mt-12 gap-2">
    <Image
      src="/logo.png"
      alt="WanNya"
      width={120}
      height={40}
      priority
      className="h-auto w-auto"
    />

    <p className="text-xl font-semibold text-[#d4a017] text-center">
      {t('subtitle')}
    </p>
  </div>

  {/* Carousel */}
  <div className="mt-10 w-full max-w-sm">
    <SplashCarousel />
  </div>

  {/* Buttons */}
  <div className="w-full max-w-sm flex flex-col items-center">
    <AuthButton
      onClick={() => router.push("/signup")}
      className="mt-5 w-full"
    >
      {t('signup')}
    </AuthButton>

    <AuthButton
      onClick={() => router.push("/login")}
      variant="secondary"
      className="mt-4 w-full"
    >
      {t('login')}
    </AuthButton>
  </div>

  {/* Try Demo */}
  <div className="mt-8 w-full max-w-sm flex items-center gap-3 text-[#d4a017] font-semibold">
    <span className="flex-1 h-px bg-[#d4a017]" />
    {t('demo')}
    <span className="flex-1 h-px bg-[#d4a017]" />
  </div>

</main>


);
}

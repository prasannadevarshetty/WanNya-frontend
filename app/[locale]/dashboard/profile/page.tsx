"use client";

import { useState, useEffect } from "react";
import ProfileHeader from "@/components/profile/core/ProfileHeader";
import PetsSection from "@/components/profile/core/PetsSection";
import ProfileMenu from "@/components/profile/core/ProfileMenu";
import EditProfileModal from "@/components/profile/core/EditProfileModal";
import { useProfileStore } from "@/store/useProfileStore";

export default function ProfilePage() {
  const [editOpen, setEditOpen] = useState(false);
  const { loadProfile } = useProfileStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <>
      <ProfileHeader onEdit={() => setEditOpen(true)} />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 mt-16 sm:mt-20">
        <PetsSection />

        <div className="mt-8 sm:mt-10">
          <ProfileMenu />
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
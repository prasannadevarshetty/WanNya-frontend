"use client";

import { X, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useProfileStore } from "@/store/useProfileStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EditProfileModal({ open, onClose }: Props) {
  const { user, updateUser } = useProfileStore();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar);

  // reset local form when modal opens or user changes
  // keep form fields in sync when modal is opened
  useEffect(() => {
    if (open) {
      setName((prev) => user.name);
      setEmail((prev) => user.email);
      setAvatar((prev) => user.avatar);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, user]);

  if (!open) return null;

  const handleSave = () => {
    updateUser({ name, email, avatar });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-[90%] max-w-md p-6 shadow-xl">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          Edit Profile
        </h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gray-300 overflow-hidden">
              {avatar && (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <label className="absolute bottom-0 right-0 bg-[#d4a017] p-2 rounded-full cursor-pointer shadow-md">
              <Camera size={18} className="text-white" />
              <input
                id="profile-avatar"
                name="avatar"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAvatar(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="profile-name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="profile-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              mt-1 w-full px-4 py-3 rounded-xl
              border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#d4a017]
            "
          />
        </div>

        {/* Email / Username */}
        <div className="mb-6">
          <label htmlFor="profile-email" className="text-sm font-medium">
            Username / Email
          </label>
          <input
            id="profile-email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              mt-1 w-full px-4 py-3 rounded-xl
              border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#d4a017]
            "
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="
              flex-1 py-3 rounded-xl
              border border-gray-300
              text-gray-700
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="
              flex-1 py-3 rounded-xl
              bg-[#d4a017] text-white font-semibold
              hover:bg-[#c79a12]
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
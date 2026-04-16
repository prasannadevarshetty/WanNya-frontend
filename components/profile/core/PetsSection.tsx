"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { PawPrint, CheckCircle, Trash2, Edit3 } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import Modal from "@/components/ui/Model";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useTranslations } from 'next-intl';

export default function PetsSection() {
  const router = useRouter();
  const { pets, selectedPetId, switchPet, isLoading, error, loadProfile, deletePetFromDB } = useProfileStore();
  const { addNotification } = useNotificationStore();
  const t = useTranslations('profile');
  const p = useTranslations('pets')
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 -mt-12 max-w-[1000px] mx-auto text-center">
        <div className="text-lg">{p("load")}</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 -mt-12 max-w-[1000px] mx-auto text-center">
        <div className="text-red-600">{p("error")} {error}</div>
      </div>
    );
  }

  // 🔥 EMPTY STATE
  if (pets.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 -mt-12 max-w-[1000px] mx-auto text-center">
        <PawPrint size={40} className="mx-auto text-[#d4a017] mb-4" />

        <h2 className="text-2xl font-bold mb-2">{p("noPets")}</h2>
        <p className="text-gray-600 mb-6">
          {p("desc")}
        </p>

        <div className="flex gap-4 justify-center mb-4">
          <Button
            className="h-12 px-8 rounded-full"
            onClick={() => router.push("/onboarding/step-1")}
          >
            {p("addFirst")}
          </Button>
          
          <Button
            className="h-12 px-6 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => loadProfile()}
            disabled={isLoading}
          >
            {p("refresh")}
          </Button>
        </div>
      </div>
    );
  }

  // 🔥 NORMAL STATE
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 -mt-12 max-w-[1000px] mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t('pets')}</h2>

      {pets.map((pet) => (
        <div
          key={pet.id}
          className={`group relative flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 p-5 mb-4 rounded-2xl border ${
            pet.id === selectedPetId
              ? "border-[#d4a017] bg-[#fdfaf2]"
              : "border-gray-100 bg-white"
          } hover:border-[#d4a017]/60 hover:shadow-md transition-all duration-300`}
        >
          {/* LEFT: Info */}
          <div className="flex items-center gap-4 flex-1 w-full">
            {/* Pet Photo */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#fcf8ef] border border-gray-100 flex-shrink-0 flex items-center justify-center">
              {pet.photo ? (
                <img 
                  src={pet.photo} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PawPrint size={28} className="text-[#d4a017]" />
              )}
            </div>
            
            {/* Pet Info */}
            <div className="flex flex-col flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold flex items-center gap-2 text-gray-900 text-base">
                  {pet.name}
                </h3>
                {pet.id === selectedPetId && (
                  <span className="flex items-center gap-1 bg-[#d4a017] text-white px-2 py-0.5 rounded-md text-xs font-medium">
                    <CheckCircle size={12} />
                    {t('active')}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
                {pet.breed} • {pet.type}
              </p>
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-100 sm:border-0 justify-between sm:justify-end shrink-0">
            {pet.id !== selectedPetId ? (
              <Button
                variant="secondary"
                onClick={() => switchPet(pet.id)}
              >
                {t('active')}
              </Button>
            ) : (
              <div className="w-[100px] hidden sm:block"></div>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={() => router.push(`/onboarding/step-1?edit=${pet.id}`)}
                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                aria-label={`Edit ${pet.name}`}
                title={`Edit ${pet.name}`}
              >
                <Edit3 size={18} />
              </button>
              
              <button
                onClick={() => {
                  setSelectedPet(pet);
                  setConfirmOpen(true);
                }}
                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                aria-label={`Delete ${pet.name}`}
                title={`Delete ${pet.name}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <Button
        className="
          w-full
          mt-6
          h-12
          rounded-full
          flex items-center justify-center gap-2
          text-sm
        "
        variant="primary"
        onClick={() => router.push("/onboarding/step-1")}
      >
        
        {t('addPet')}
      </Button>

      {/* Confirmation Modal for delete */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Pet"
        subtitle="This action cannot be undone."
      >
        <div className="py-4">
          <p className="text-gray-700">Are you sure you want to delete <strong>{selectedPet?.name}</strong>?</p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 rounded-full text-sm text-gray-600 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                if (!selectedPet) return;
                setDeleting(true);
                try {
                  await deletePetFromDB(selectedPet.id);
                  addNotification({ 
                    title: 'Pet deleted', 
                    message: `${selectedPet.name} removed successfully`, 
                    type: 'success', 
                    read: false 
                  });
                  setConfirmOpen(false);
                } catch (err) {
                  console.error('Delete failed', err);
                  addNotification({ 
                    title: 'Delete failed', 
                    message: 'Could not delete pet', 
                    type: 'error', 
                    read: false 
                  });
                } finally {
                  setDeleting(false);
                  setSelectedPet(null);
                }
              }}
              className="px-4 py-2 rounded-full text-sm bg-red-600 text-white hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete Pet'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

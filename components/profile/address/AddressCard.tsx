"use client";

import { useState } from "react";
import {
  MapPin,
  Home,
  Building2,
  CheckCircle,
  Trash2,
  Edit3,
} from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import Button from "@/components/ui/Button";
import AddAddressModal from "./AddAddressModal";
import EmptyAddresses from "./EmptyAddresses";
import Modal from "@/components/ui/Model";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function AddressCard() {
  const { addresses, setActiveAddress, deleteAddressFromDB } = useProfileStore();
  const { addNotification } = useNotificationStore();

  const [openModal, setOpenModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 space-y-5">

      {/* EMPTY STATE */}
      {addresses.length === 0 ? (
        <EmptyAddresses onAdd={() => setOpenModal(true)} />
      ) : (
        <>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`group relative flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 p-5 rounded-2xl border ${addr.active ? "border-[#d4a017] bg-[#fdfaf2]" : "border-gray-100 bg-white"
                } hover:border-[#d4a017]/60 hover:shadow-md transition-all duration-300`}
            >
              {/* LEFT: Info */}
              <div className="flex items-start gap-4 flex-1 w-full">
                <div className="bg-[#fcf8ef] p-3 rounded-xl flex-shrink-0">
                  <MapPin className="text-[#d4a017]" size={22} />
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold flex items-center gap-2 text-gray-900 text-base">
                      {addr.label.includes("Home") ? (
                        <Home size={16} className="text-gray-500" />
                      ) : (
                        <Building2 size={16} className="text-gray-500" />
                      )}
                      {addr.label}
                    </h4>
                    {addr.active && (
                      <span className="flex items-center gap-1 bg-[#d4a017] text-white px-2 py-0.5 rounded-md text-xs font-medium">
                        <CheckCircle size={12} />
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
                    {addr.street && <span className="block">{addr.street}</span>}
                    <span>
                      {addr.city}{addr.state ? `, ${addr.state}` : ""}{addr.zip ? ` ${addr.zip}` : ""} • {addr.country}
                    </span>
                  </p>
                </div>
              </div>

              {/* RIGHT: Actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-100 sm:border-0 justify-between sm:justify-end shrink-0">
                {!addr.active ? (
                  <Button
                    variant="secondary"
                    onClick={() => setActiveAddress(addr.id)}
                  >
                    Set Active
                  </Button>
                ) : (
                  <div className="w-[100px] hidden sm:block"></div>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedAddress(addr);
                      setOpenModal(true);
                    }}
                    className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    aria-label={`Edit ${addr.label}`}
                    title={`Edit ${addr.label}`}
                  >
                    <Edit3 size={18} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAddress(addr);
                      setConfirmOpen(true);
                    }}
                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    aria-label={`Delete ${addr.label}`}
                    title={`Delete ${addr.label}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* ADD BUTTON */}
          <Button
            onClick={() => {
              setSelectedAddress(null);
              setOpenModal(true);
            }}
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
          >
            Add another address
          </Button>
        </>
      )}

      {/* MODAL */}
      <AddAddressModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedAddress(null);
        }}
        initialData={selectedAddress}
      />

      {/* Confirmation Modal for delete */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Address"
        subtitle="This action cannot be undone."
      >
        <div className="py-4">
          <p className="text-gray-700">Are you sure you want to delete <strong>{selectedAddress?.label}</strong>?</p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 rounded-full text-sm text-gray-600 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                if (!selectedAddress) return;
                setDeleting(true);
                try {
                  await deleteAddressFromDB(selectedAddress.id);
                  addNotification({ title: 'Address deleted', message: `${selectedAddress.label} removed`, type: 'success', read: false });
                  setConfirmOpen(false);
                } catch (err) {
                  console.error('Delete failed', err);
                  addNotification({ title: 'Delete failed', message: 'Could not delete address', type: 'error', read: false });
                } finally {
                  setDeleting(false);
                  setSelectedAddress(null);
                }
              }}
              className="px-4 py-2 rounded-full text-sm bg-red-600 text-white hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete Address'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
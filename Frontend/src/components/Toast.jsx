import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function Toast() {
  const { showToast, toastMessage } = useCartStore();

  return (
    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-in-out ${
      showToast ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
    }`}>
      <div className="bg-gray-900 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] border border-gray-800">
        <div className="bg-green-500 p-1 rounded-full shrink-0">
          <CheckCircle size={20} className="text-white" />
        </div>
        <p className="font-bold text-sm md:text-base">{toastMessage}</p>
      </div>
    </div>
  );
}
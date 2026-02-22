"use client";

type Props = { onClose: () => void };

export default function ModalReservaEfetuada({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="bg-dark-800 rounded-2xl border border-gray-700 w-full max-w-sm p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-brand-purple flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-white">✓</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Reserva Efetuada!</h2>
        <p className="text-gray-400 text-sm mb-6">Sua reserva foi agendada com sucesso.</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 min-h-[48px] rounded-xl bg-dark-700 text-white font-medium hover:bg-dark-600 active:opacity-90 transition-colors touch-manipulation"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

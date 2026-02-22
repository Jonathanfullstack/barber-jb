"use client";

type Props = {
  onClose: () => void;
  onConfirm: () => void;
};

export default function ModalCancelarReserva({ onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="bg-dark-800 rounded-2xl border border-gray-700 w-full max-w-sm p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-white mb-2">Cancelar Reserva</h2>
        <p className="text-gray-400 text-sm mb-6">
          Tem certeza que deseja cancelar esse agendamento?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 min-h-[48px] rounded-xl bg-dark-700 text-white font-medium hover:bg-dark-600 active:opacity-90 transition-colors touch-manipulation"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-4 min-h-[48px] rounded-xl bg-brand-red text-white font-medium hover:bg-brand-red-dark active:opacity-90 transition-colors touch-manipulation"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

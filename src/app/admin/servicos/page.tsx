"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { fileToDataUrl } from "@/lib/image-upload";
import {
  getServicos,
  addServico,
  atualizarServico,
  removerServico,
  type ServicoItem,
} from "@/lib/servicos-store";

type FormServico = {
  nome: string;
  descricao: string;
  preco: string;
  duracao: string;
  imageUrl: string;
};

const emptyForm: FormServico = {
  nome: "",
  descricao: "",
  preco: "",
  duracao: "",
  imageUrl: "",
};

function toForm(s: ServicoItem | null): FormServico {
  if (!s) return emptyForm;
  return {
    nome: s.nome,
    descricao: s.descricao,
    preco: String(s.preco),
    duracao: String(s.duracao),
    imageUrl: s.imageUrl,
  };
}

export default function AdminServicosPage() {
  const [servicos, setServicos] = useState<ServicoItem[]>([]);
  const [modal, setModal] = useState<
    "novo" | { tipo: "editar"; servico: ServicoItem } | { tipo: "excluir"; servico: ServicoItem }
    | null
  >(null);
  const [form, setForm] = useState<FormServico>(emptyForm);
  const [erro, setErro] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => setServicos(getServicos()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openNovo = () => {
    setForm(emptyForm);
    setErro(null);
    setModal("novo");
  };

  const openEditar = (servico: ServicoItem) => {
    setForm(toForm(servico));
    setErro(null);
    setModal({ tipo: "editar", servico });
  };

  const openExcluir = (servico: ServicoItem) => {
    setModal({ tipo: "excluir", servico });
  };

  const closeModal = () => {
    setModal(null);
    setForm(emptyForm);
    setErro(null);
  };

  const handleSubmitNovo = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    const nome = form.nome.trim();
    if (!nome) {
      setErro("Preencha o nome do serviço.");
      return;
    }
    const preco = parseFloat(form.preco.replace(",", "."));
    const duracao = parseInt(form.duracao, 10);
    if (isNaN(preco) || preco < 0) {
      setErro("Preço inválido.");
      return;
    }
    if (isNaN(duracao) || duracao <= 0) {
      setErro("Duração deve ser um número positivo (minutos).");
      return;
    }
    addServico({
      nome,
      descricao: form.descricao.trim(),
      preco,
      duracao,
      imageUrl: form.imageUrl.trim() || undefined,
    });
    refresh();
    closeModal();
  };

  const handleSubmitEditar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal || modal === "novo" || modal.tipo !== "editar") return;
    setErro(null);
    const nome = form.nome.trim();
    if (!nome) {
      setErro("Preencha o nome do serviço.");
      return;
    }
    const preco = parseFloat(form.preco.replace(",", "."));
    const duracao = parseInt(form.duracao, 10);
    if (isNaN(preco) || preco < 0) {
      setErro("Preço inválido.");
      return;
    }
    if (isNaN(duracao) || duracao <= 0) {
      setErro("Duração deve ser um número positivo (minutos).");
      return;
    }
    atualizarServico(modal.servico.id, {
      nome,
      descricao: form.descricao.trim(),
      preco,
      duracao,
      imageUrl: form.imageUrl.trim() || undefined,
    });
    refresh();
    closeModal();
  };

  const handleConfirmarExcluir = () => {
    if (!modal || modal === "novo" || modal.tipo !== "excluir") return;
    removerServico(modal.servico.id);
    refresh();
    closeModal();
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setErro(null);
    fileToDataUrl(file)
      .then((dataUrl) => setForm((f) => ({ ...f, imageUrl: dataUrl })))
      .catch(() => setErro("Erro ao carregar a imagem. Tente outra."))
      .finally(() => {
        setUploadingImage(false);
        e.target.value = "";
      });
  };

  const isEdit = modal !== null && modal !== "novo" && modal.tipo === "editar";
  const isExcluir = modal !== null && modal !== "novo" && modal.tipo === "excluir";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Serviços</h1>
        <button
          type="button"
          onClick={openNovo}
          className="px-3 py-2 rounded-lg bg-brand-purple text-white text-xs md:text-sm font-medium hover:bg-brand-purple-dark min-h-[44px] w-full sm:w-auto"
        >
          + Novo serviço
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {servicos.map((s) => (
          <article
            key={s.id}
            className="bg-dark-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col min-w-0"
          >
            <div className="relative aspect-square">
              <Image
                src={s.imageUrl}
                alt={s.nome}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 280px"
                unoptimized
              />
            </div>
            <div className="p-3 md:p-4 flex-1 flex flex-col min-w-0">
              <h3 className="font-semibold text-white text-sm md:text-base truncate">{s.nome}</h3>
              {s.descricao && (
                <p className="text-gray-400 text-xs md:text-sm line-clamp-2 mt-0.5">{s.descricao}</p>
              )}
              <p className="text-brand-purple font-semibold text-sm md:text-base mt-1 md:mt-2">
                R$ {s.preco.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-gray-500 text-[10px] md:text-xs">{s.duracao} min</p>
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-700 flex gap-1.5 md:gap-2">
                <button
                  type="button"
                  onClick={() => openEditar(s)}
                  className="flex-1 py-2 rounded-lg bg-dark-700 text-gray-300 text-[10px] md:text-sm font-medium hover:bg-dark-600 min-h-[40px]"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => openExcluir(s)}
                  className="py-2 px-2.5 md:px-3 rounded-lg border border-gray-600 text-gray-400 text-[10px] md:text-sm hover:border-brand-red hover:text-brand-red min-h-[40px]"
                >
                  Excluir
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Novo / Editar */}
      {modal && (modal === "novo" || modal.tipo === "editar") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-servico-title"
        >
          <div
            className="bg-dark-800 border border-gray-700 rounded-xl w-full max-w-md shadow-xl my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 md:p-6">
              <h2 id="modal-servico-title" className="text-lg font-bold text-white mb-4">
                {isEdit ? "Editar serviço" : "Novo serviço"}
              </h2>
              <form
                onSubmit={isEdit ? handleSubmitEditar : handleSubmitNovo}
                className="space-y-3"
              >
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Nome</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                    className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Ex: Corte de Cabelo"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Descrição (opcional)</label>
                  <textarea
                    value={form.descricao}
                    onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                    className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm min-h-[80px]"
                    placeholder="Breve descrição do serviço"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Preço (R$)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.preco}
                      onChange={(e) => setForm((f) => ({ ...f, preco: e.target.value }))}
                      className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="50,00"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Duração (min)</label>
                    <input
                      type="number"
                      min={1}
                      value={form.duracao}
                      onChange={(e) => setForm((f) => ({ ...f, duracao: e.target.value }))}
                      className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="45"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Imagem do serviço</label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-dark-700 border border-gray-600 shrink-0">
                        {form.imageUrl ? (
                          <img
                            src={form.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center">
                            Sem imagem
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFile}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() => imageInputRef.current?.click()}
                          className="w-full py-2 rounded-lg bg-dark-700 border border-gray-600 text-gray-300 text-sm font-medium hover:bg-dark-600 disabled:opacity-50"
                        >
                          {uploadingImage ? "Carregando…" : "Escolher do celular"}
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl}
                      onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                      className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="Ou cole uma URL da imagem"
                    />
                  </div>
                </div>
                {erro && <p className="text-red-400 text-sm">{erro}</p>}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2 rounded-lg bg-dark-700 text-gray-300 text-sm font-medium hover:bg-dark-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-brand-purple text-white text-sm font-medium hover:bg-brand-purple-dark"
                  >
                    {isEdit ? "Salvar" : "Adicionar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Excluir */}
      {isExcluir && modal && modal !== "novo" && modal.tipo === "excluir" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-excluir-title"
        >
          <div
            className="bg-dark-800 border border-gray-700 rounded-xl w-full max-w-sm shadow-xl p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-excluir-title" className="text-lg font-bold text-white mb-2">
              Excluir serviço
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Tem certeza que deseja excluir &quot;{modal.servico.nome}&quot;? Ele deixará de aparecer na lista de serviços.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 py-2 rounded-lg bg-dark-700 text-gray-300 text-sm font-medium hover:bg-dark-600"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarExcluir}
                className="flex-1 py-2 rounded-lg bg-brand-red text-white text-sm font-medium hover:opacity-90"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import BarbeiroAvatar from "@/components/BarbeiroAvatar";
import { getBarbeiros, addBarbeiro, atualizarBarbeiro, type BarbeiroItem } from "@/lib/barbeiros-store";
import { fileToDataUrl } from "@/lib/image-upload";

type FormBarbeiro = {
  name: string;
  login: string;
  senha: string;
  avatar: string;
};

const emptyForm: FormBarbeiro = { name: "", login: "", senha: "", avatar: "" };

function toForm(b: BarbeiroItem | null): FormBarbeiro {
  if (!b) return emptyForm;
  return { name: b.name, login: b.login, senha: b.senha, avatar: b.avatar };
}

export default function AdminBarbeirosPage() {
  const [barbeiros, setBarbeiros] = useState<BarbeiroItem[]>([]);
  const [modal, setModal] = useState<"novo" | { tipo: "editar"; barbeiro: BarbeiroItem } | null>(null);
  const [form, setForm] = useState<FormBarbeiro>(emptyForm);
  const [erro, setErro] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => setBarbeiros(getBarbeiros()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openNovo = () => {
    setForm(emptyForm);
    setErro(null);
    setModal("novo");
  };

  const openEditar = (barbeiro: BarbeiroItem) => {
    setForm(toForm(barbeiro));
    setErro(null);
    setModal({ tipo: "editar", barbeiro });
  };

  const closeModal = () => {
    setModal(null);
    setForm(emptyForm);
    setErro(null);
  };

  const handleSubmitNovo = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    const nome = form.name.trim();
    const login = form.login.trim();
    const senha = form.senha;
    if (!nome || !login || !senha) {
      setErro("Preencha nome, login e senha.");
      return;
    }
    const lista = getBarbeiros();
    if (lista.some((b) => b.login === login)) {
      setErro("Já existe um barbeiro com este login.");
      return;
    }
    addBarbeiro({ name: nome, login, senha, avatar: form.avatar || undefined });
    refresh();
    closeModal();
  };

  const handleSubmitEditar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal || modal === "novo" || modal.tipo !== "editar") return;
    setErro(null);
    const nome = form.name.trim();
    const login = form.login.trim();
    if (!nome || !login) {
      setErro("Preencha nome e login.");
      return;
    }
    const lista = getBarbeiros();
    const outro = lista.find((b) => b.login === login && b.id !== modal.barbeiro.id);
    if (outro) {
      setErro("Já existe outro barbeiro com este login.");
      return;
    }
    atualizarBarbeiro(modal.barbeiro.id, {
      name: nome,
      login,
      ...(form.senha ? { senha: form.senha } : {}),
      ...(form.avatar ? { avatar: form.avatar } : {}),
    });
    refresh();
    closeModal();
  };

  const isEdit = modal !== null && modal !== "novo";

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setErro(null);
    fileToDataUrl(file)
      .then((dataUrl) => setForm((f) => ({ ...f, avatar: dataUrl })))
      .catch(() => setErro("Erro ao carregar a imagem. Tente outra."))
      .finally(() => {
        setUploadingAvatar(false);
        e.target.value = "";
      });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Barbeiros</h1>
        <button
          type="button"
          onClick={openNovo}
          className="px-3 py-2 rounded-lg bg-brand-purple text-white text-xs md:text-sm font-medium hover:bg-brand-purple-dark min-h-[44px] w-full sm:w-auto"
        >
          + Novo barbeiro
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {barbeiros.map((b) => (
          <article
            key={b.id}
            className="bg-dark-800 rounded-xl border border-gray-700 p-3 md:p-4 flex items-center gap-3 md:gap-4 min-w-0"
          >
            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0">
              <BarbeiroAvatar src={b.avatar} alt={b.name} sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-sm md:text-base truncate">{b.name}</h3>
              <p className="text-gray-500 text-xs md:text-sm">Barbeiro</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditar(b)}
                  className="py-1.5 px-2.5 md:px-3 rounded-lg bg-dark-700 text-gray-300 text-[10px] md:text-xs hover:bg-dark-600 min-h-[36px]"
                >
                  Editar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Novo / Editar */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-dark-800 border border-gray-700 rounded-xl w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 md:p-6">
              <h2 id="modal-title" className="text-lg font-bold text-white mb-4">
                {isEdit ? "Editar barbeiro" : "Novo barbeiro"}
              </h2>
              <form
                onSubmit={isEdit ? handleSubmitEditar : handleSubmitNovo}
                className="space-y-3"
              >
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Nome</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Ex: João Silva"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Login</label>
                  <input
                    type="text"
                    value={form.login}
                    onChange={(e) => setForm((f) => ({ ...f, login: e.target.value }))}
                    className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Ex: joao"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Senha {isEdit && "(deixe em branco para não alterar)"}
                  </label>
                  <input
                    type="password"
                    value={form.senha}
                    onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
                    className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder={isEdit ? "••••••••" : "Mín. 6 caracteres"}
                    autoComplete={isEdit ? "new-password" : "new-password"}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Foto do barbeiro</label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-dark-700 border border-gray-600 shrink-0">
                        {form.avatar ? (
                          <img
                            src={form.avatar}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                            Sem foto
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFile}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploadingAvatar}
                          onClick={() => avatarInputRef.current?.click()}
                          className="w-full py-2 rounded-lg bg-dark-700 border border-gray-600 text-gray-300 text-sm font-medium hover:bg-dark-600 disabled:opacity-50"
                        >
                          {uploadingAvatar ? "Carregando…" : "Escolher do celular"}
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={form.avatar.startsWith("data:") ? "" : form.avatar}
                      onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
                      className="w-full bg-dark-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      placeholder="Ou cole uma URL da imagem"
                    />
                  </div>
                </div>
                {erro && (
                  <p className="text-red-400 text-sm">{erro}</p>
                )}
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
    </div>
  );
}

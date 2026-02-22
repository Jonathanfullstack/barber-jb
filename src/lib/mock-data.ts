// JB Barber — imagens relacionadas (Unsplash: barbearia, corte, barba, etc.). Fallback se não carregar.
const W = (id: string, width = 400, q = 80) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=${q}`;

// Fallback quando a imagem do Unsplash não carregar (picsum sempre responde)
export const FALLBACK_IMAGE = "https://picsum.photos/seed/barber-fallback/400/400";

// Hero: maior resolução e qualidade para a foto do topo
const HERO_IMAGE_ID = "1599351431202-1e0f0137899a";
export const BARBEARIA_HERO_IMAGE = W(HERO_IMAGE_ID, 1400, 95);

export const BARBEARIA = {
  id: "jb1",
  name: "JB Barber",
  address: "Avenida São Sebastião, 357, São Paulo",
  imageUrl: W(HERO_IMAGE_ID, 800), // interior barbearia (uso geral)
  about:
    "Bem-vindo à JB Barber, onde tradição encontra estilo. Nossa equipe de barbeiros transforma cortes de cabelo e barbas em obras de arte. Agende com o profissional de sua preferência e cuide da sua aparência em um ambiente acolhedor.",
  phone1: "(11) 98204-5108",
  phone2: "(11) 99503-2351",
  rating: 5,
  totalAvaliacoes: 889,
  horarios: [
    { diaSemana: 0, abre: null, fecha: null },
    { diaSemana: 1, abre: null, fecha: null },
    { diaSemana: 2, abre: "09:00", fecha: "21:00" },
    { diaSemana: 3, abre: "09:00", fecha: "21:00" },
    { diaSemana: 4, abre: "09:00", fecha: "21:00" },
    { diaSemana: 5, abre: "09:00", fecha: "21:00" },
    { diaSemana: 6, abre: "08:00", fecha: "17:00" },
  ],
} as const;

// Foto dos funcionários: mesma imagem para todos. Coloque em public/funcionarios/prv.png (ou prv.jpg)
export const AVATAR_FUNCIONARIOS = "/funcionarios/prv.png";
// Fallback se a foto local não existir (evita ícone quebrado)
export const AVATAR_FUNCIONARIOS_FALLBACK = W("1560250097-0b93528e311e", 200);

// Barbeiros (funcionários): login e senha para o painel. Senhas em texto apenas para demonstração.
export const BARBEIROS = [
  { id: "b1", name: "João Silva", avatar: AVATAR_FUNCIONARIOS, login: "joao", senha: "123456" },
  { id: "b2", name: "Miguel Santos", avatar: AVATAR_FUNCIONARIOS, login: "miguel", senha: "123456" },
  { id: "b3", name: "Carlos Oliveira", avatar: AVATAR_FUNCIONARIOS, login: "carlos", senha: "123456" },
];

export function buscarBarbeiroPorLogin(login: string, senha: string) {
  return BARBEIROS.find((b) => b.login === login && b.senha === senha) ?? null;
}

// Serviços: fotos temáticas (corte, barba, bigode, sobrancelha, massagem, cabelo, etc.)
export const SERVICOS = [
  { id: "s1", nome: "Corte de Cabelo", descricao: "Estilo personalizado com as últimas tendências.", preco: 50, duracao: 45, imageUrl: W("1585747860715-2ba37e788b70") },
  { id: "s2", nome: "Barba", descricao: "Modelagem completa para destacar sua masculinidade.", preco: 45, duracao: 30, imageUrl: W("1621605815971-fbc98d665033") },
  { id: "s3", nome: "Bigode", descricao: "Aparar e modelar o bigode com precisão.", preco: 25, duracao: 20, imageUrl: W("1605497788044-5a32c7078486") },
  { id: "s4", nome: "Pézinho", descricao: "Acabamento perfeito para um visual renovado.", preco: 20, duracao: 15, imageUrl: W("1599351431202-1e0f0137899a") },
  { id: "s5", nome: "Sobrancelha", descricao: "Expressão acentuada com modelagem precisa.", preco: 25, duracao: 20, imageUrl: W("1621605815971-fbc98d665033") },
  { id: "s6", nome: "Relaxamento / Massagem", descricao: "Relaxe e renove com nossos tratamentos revitalizantes.", preco: 35, duracao: 25, imageUrl: W("1544161515-4ab6ce6db874") },
  { id: "s7", nome: "Hidratação Capilar", descricao: "Fios hidratados, macios e brilhantes.", preco: 30, duracao: 20, imageUrl: W("1522338242762-31fcf643fee6") },
  { id: "s8", nome: "Combo Corte + Barba", descricao: "Corte de cabelo e barba com desconto.", preco: 85, duracao: 60, imageUrl: W("1599351431202-1e0f0137899a") },
  { id: "s9", nome: "Coloração", descricao: "Cobertura de fios brancos ou mudança de visual.", preco: 60, duracao: 50, imageUrl: W("1522338242762-31fcf643fee6") },
  { id: "s10", nome: "Luzes", descricao: "Destaques naturais para dar profundidade ao cabelo.", preco: 70, duracao: 55, imageUrl: W("1512496015852-a32a7c00f8b0") },
];

const DIAS = ["Domingo", "Segunda", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

export function getDiaLabel(diaSemana: number) {
  return DIAS[diaSemana] ?? "";
}

export function formatHorario(abre: string | null, fecha: string | null) {
  if (!abre || !fecha) return "Fechado";
  return `${abre} - ${fecha}`;
}

// Agendamentos: cada um tem barbeiroId e clienteNome (para o funcionário ver quem é o cliente)
export const AGENDAMENTOS = [
  { id: "a1", status: "confirmado" as const, servicoNome: "Corte de Cabelo", barbeiroNome: "João Silva", barbeiroId: "b1", clienteNome: "Ricardo Oliveira", clienteTelefone: "(11) 98765-4321", data: "2025-02-06", horario: "09:45", preco: 50, dataLabel: "06 de Fevereiro", dataLabelLong: "06 de Fevereiro" },
  { id: "a2", status: "finalizado" as const, servicoNome: "Corte de Cabelo", barbeiroNome: "João Silva", barbeiroId: "b1", clienteNome: "Pedro Santos", clienteTelefone: "(11) 97654-3210", data: "2025-01-22", horario: "09:00", preco: 50, dataLabel: "Janeiro 22", dataLabelLong: "22 de Janeiro" },
  { id: "a3", status: "finalizado" as const, servicoNome: "Barba", barbeiroNome: "Miguel Santos", barbeiroId: "b2", clienteNome: "Lucas Ferreira", clienteTelefone: "(11) 96543-2109", data: "2025-01-07", horario: "12:40", preco: 45, dataLabel: "Janeiro 07", dataLabelLong: "07 de Janeiro" },
  { id: "a4", status: "finalizado" as const, servicoNome: "Corte de Cabelo", barbeiroNome: "Carlos Oliveira", barbeiroId: "b3", clienteNome: "Bruno Costa", clienteTelefone: "(11) 95432-1098", data: "2024-12-23", horario: "19:10", preco: 50, dataLabel: "Dezembro 23", dataLabelLong: "23 de Dezembro" },
  { id: "a5", status: "finalizado" as const, servicoNome: "Barba", barbeiroNome: "João Silva", barbeiroId: "b1", clienteNome: "André Lima", clienteTelefone: "(11) 91234-5678", data: "2025-02-10", horario: "10:00", preco: 45, dataLabel: "10 de Fevereiro", dataLabelLong: "10 de Fevereiro" },
  { id: "a6", status: "finalizado" as const, servicoNome: "Combo Corte + Barba", barbeiroNome: "João Silva", barbeiroId: "b1", clienteNome: "Felipe Souza", clienteTelefone: "(11) 92345-6789", data: "2025-02-15", horario: "14:30", preco: 85, dataLabel: "15 de Fevereiro", dataLabelLong: "15 de Fevereiro" },
  { id: "a7", status: "finalizado" as const, servicoNome: "Corte de Cabelo", barbeiroNome: "Miguel Santos", barbeiroId: "b2", clienteNome: "Rafael Costa", clienteTelefone: "(11) 93456-7890", data: "2025-02-12", horario: "11:00", preco: 50, dataLabel: "12 de Fevereiro", dataLabelLong: "12 de Fevereiro" },
];

/** Tipo mínimo para cálculo de faturamento (compatível com AGENDAMENTOS e AgendamentoItem[]) */
type AgendamentoParaFaturamento = Array<{
  barbeiroId: string;
  status: string;
  data: string;
  preco: number;
}>;

/** Faturamento de um barbeiro em um mês/ano (soma dos agendamentos finalizados) */
export function faturamentoNoMes(
  barbeiroId: string,
  ano: number,
  mes: number,
  lista?: AgendamentoParaFaturamento
): number {
  const pad = (n: number) => String(n).padStart(2, "0");
  const prefix = `${ano}-${pad(mes)}`;
  const ags = (lista ?? AGENDAMENTOS) as AgendamentoParaFaturamento;
  return ags
    .filter((a) => a.barbeiroId === barbeiroId && a.status === "finalizado" && a.data.startsWith(prefix))
    .reduce((s, a) => s + a.preco, 0);
}

export const MOCK_BARBEARIAS = [BARBEARIA];
export const MOCK_SERVICOS: Record<string, typeof SERVICOS> = { [BARBEARIA.id]: SERVICOS };
export const MOCK_AGENDAMENTOS = AGENDAMENTOS;

import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const ROLES = ["comando", "editor", "operador"] as const;
export type Role = (typeof ROLES)[number];
export const NOME_ROLE: Record<Role, string> = {
  comando: "Comando",
  editor: "Operador c/ permissão",
  operador: "Operador",
};

export const ranks = pgTable("ranks", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  abreviatura: text("abreviatura").notNull(),
  ordem: integer("ordem").notNull().default(0),
  imagem: text("imagem"),
  categoria: text("categoria").notNull().default("praca"),
});

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  ordem: integer("ordem").notNull().default(0),
});

export const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  abreviatura: text("abreviatura").notNull(),
  ordem: integer("ordem").notNull().default(0),
});

export const statuses = pgTable("statuses", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  cor: text("cor").notNull().default("#94a3b8"),
  ordem: integer("ordem").notNull().default(0),
});

export const rosters = pgTable("rosters", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  notas: text("notas"),
  ordem: integer("ordem").notNull().default(0),
});

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  abreviatura: text("abreviatura"),
  descricao: text("descricao"),
  rosterId: integer("roster_id").references(() => rosters.id, { onDelete: "set null" }),
  ordem: integer("ordem").notNull().default(0),
});

export const awards = pgTable("awards", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  designacao: text("designacao"),
  descricao: text("descricao"),
  imagem: text("imagem"),
  ordem: integer("ordem").notNull().default(0),
});

export const qualifications = pgTable("qualifications", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  abreviatura: text("abreviatura"),
  ordem: integer("ordem").notNull().default(0),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  nomeGuerra: text("nome_guerra"),
  numeroServico: text("numero_servico"),
  discord: text("discord"),
  steam: text("steam"),
  bio: text("bio"),
  foto: text("foto"),
  login: text("login"),
  passwordHash: text("password_hash"),
  role: text("role").notNull().default("operador"),
  contaEstado: text("conta_estado").notNull().default("aprovada"),
  registoNotas: text("registo_notas"),
  rankId: integer("rank_id").references(() => ranks.id, { onDelete: "set null" }),
  positionId: integer("position_id").references(() => positions.id, { onDelete: "set null" }),
  specialtyId: integer("specialty_id").references(() => specialties.id, { onDelete: "set null" }),
  statusId: integer("status_id").references(() => statuses.id, { onDelete: "set null" }),
  unitId: integer("unit_id").references(() => units.id, { onDelete: "set null" }),
  serverId: integer("server_id").references(() => servers.id, { onDelete: "set null" }),
  dataAlistamento: timestamp("data_alistamento", { withTimezone: true }),
  ultimoLogin: timestamp("ultimo_login", { withTimezone: true }),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  tipo: text("tipo").notNull().default("Treino"),
  briefing: text("briefing"),
  local: text("local"),
  dataInicio: timestamp("data_inicio", { withTimezone: true }).notNull(),
  dataFim: timestamp("data_fim", { withTimezone: true }),
  obrigatorio: boolean("obrigatorio").notNull().default(false),
  unitId: integer("unit_id").references(() => units.id, { onDelete: "set null" }),
  serverId: integer("server_id").references(() => servers.id, { onDelete: "set null" }),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const eventAttendance = pgTable("event_attendance", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  estado: text("estado").notNull().default("Presente"),
});

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rankId: integer("rank_id").references(() => ranks.id, { onDelete: "set null" }),
  data: timestamp("data", { withTimezone: true }).defaultNow().notNull(),
  notas: text("notas"),
});

export const userAwards = pgTable("user_awards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  awardId: integer("award_id")
    .notNull()
    .references(() => awards.id, { onDelete: "cascade" }),
  data: timestamp("data", { withTimezone: true }).defaultNow().notNull(),
});

export const userQualifications = pgTable("user_qualifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  qualificationId: integer("qualification_id")
    .notNull()
    .references(() => qualifications.id, { onDelete: "cascade" }),
  data: timestamp("data", { withTimezone: true }).defaultNow().notNull(),
});

export const combatRecords = pgTable("combat_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  data: timestamp("data", { withTimezone: true }).defaultNow().notNull(),
});

export const enlistmentApplications = pgTable("enlistment_applications", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  nomeGuerra: text("nome_guerra"),
  discord: text("discord"),
  idade: text("idade"),
  experiencia: text("experiencia"),
  motivacao: text("motivacao"),
  status: text("status").notNull().default("Pendente"),
  serverId: integer("server_id").references(() => servers.id, { onDelete: "set null" }),
  data: timestamp("data", { withTimezone: true }).defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  tipo: text("tipo").notNull().default("Certificado"),
  corpo: text("corpo").notNull(),
  referencia: text("referencia"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const userDocuments = pgTable("user_documents", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  corpo: text("corpo").notNull(),
  numero: text("numero").notNull(),
  emitidoPor: text("emitido_por"),
  notas: text("notas"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  campos: text("campos").notNull().default("[]"),
  activo: boolean("activo").notNull().default(true),
});

export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull().default("Arma 3"),
  endereco: text("endereco"),
  porta: text("porta"),
  password: text("password"),
  modpack: text("modpack"),
  notas: text("notas"),
  ordem: integer("ordem").notNull().default(0),
  estadoManual: boolean("estado_manual"),
});

export const colocacoes = pgTable("colocacoes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  unitId: integer("unit_id").references(() => units.id, { onDelete: "set null" }),
  positionId: integer("position_id").references(() => positions.id, { onDelete: "set null" }),
  notas: text("notas"),
  data: timestamp("data", { withTimezone: true }).defaultNow().notNull(),
});

export const passwordResets = pgTable("password_resets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  login: text("login").notNull(),
  passwordPlain: text("password_plain").notNull(),
  criadoPor: text("criado_por"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const radioFrequencies = pgTable("radio_frequencies", {
  id: serial("id").primaryKey(),
  equipa: text("equipa").notNull(),
  canal: text("canal").notNull(),
  tipo: text("tipo").notNull().default("SR"),
  notas: text("notas"),
  ordem: integer("ordem").notNull().default(0),
});

export const reactions = pgTable("reactions", {
  id: serial("id").primaryKey(),
  targetType: text("target_type").notNull(),
  targetId: integer("target_id").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tipo: text("tipo").notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  alvoId: integer("alvo_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  autorId: integer("autor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  texto: text("texto"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const reconhecimentos = pgTable("reconhecimentos", {
  id: serial("id").primaryKey(),
  alvoId: integer("alvo_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  autorId: integer("autor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tipo: text("tipo").notNull(),
});

export const bugReports = pgTable("bug_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  pagina: text("pagina"),
  estado: text("estado").notNull().default("Aberto"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const sugestoes = pgTable("sugestoes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  estado: text("estado").notNull().default("Em análise"),
  resposta: text("resposta"),
  respondidoPor: text("respondido_por"),
  respondidoEm: timestamp("respondido_em", { withTimezone: true }),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const operacoes = pgTable("operacoes", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull().default("Operação"),
  estado: text("estado").notNull().default("Planeada"),
  dataInicio: timestamp("data_inicio", { withTimezone: true }),
  unidadeId: integer("unidade_id").references(() => units.id, { onDelete: "set null" }),
  servidorId: integer("servidor_id").references(() => servers.id, { onDelete: "set null" }),
  briefing: text("briefing"),
  objectivos: text("objectivos"),
  criadoPor: text("criado_por"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const appSettings = pgTable("app_settings", {
  chave: text("chave").primaryKey(),
  valor: text("valor").notNull(),
});

export const serverStatus = pgTable("server_status", {
  serverId: integer("server_id")
    .primaryKey()
    .references(() => servers.id, { onDelete: "cascade" }),
  online: boolean("online").notNull().default(false),
  jogadores: text("jogadores"),
  operadores: text("operadores"),
  actualizadoEm: timestamp("actualizado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  actor: text("actor"),
  accao: text("accao").notNull(),
  detalhe: text("detalhe"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  corpo: text("corpo").notNull(),
  autor: text("autor"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  corpo: text("corpo"),
  href: text("href"),
  tipo: text("tipo").notNull().default("evento"),
  lida: boolean("lida").notNull().default(false),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  url: text("url").notNull(),
  album: text("album").notNull().default("Geral"),
  autorId: integer("autor_id").references(() => users.id, { onDelete: "set null" }),
  serverId: integer("server_id").references(() => servers.id, { onDelete: "set null" }),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const tabPermissions = pgTable("tab_permissions", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  tab: text("tab").notNull(),
  permitido: boolean("permitido").notNull().default(true),
});

export const userTabPermissions = pgTable("user_tab_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tab: text("tab").notNull(),
  permitido: boolean("permitido").notNull().default(true),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  canal: text("canal").notNull(),
  texto: text("texto").notNull(),
  foto: text("foto"),
  destinoId: integer("destino_id").references(() => users.id, { onDelete: "cascade" }),
  autorId: integer("autor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
});

export const ranksRelations = relations(ranks, ({ many }) => ({
  users: many(users),
  promotions: many(promotions),
}));

export const positionsRelations = relations(positions, ({ many }) => ({
  users: many(users),
}));

export const specialtiesRelations = relations(specialties, ({ many }) => ({
  users: many(users),
}));

export const statusesRelations = relations(statuses, ({ many }) => ({
  users: many(users),
}));

export const rostersRelations = relations(rosters, ({ many }) => ({
  units: many(units),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  roster: one(rosters, { fields: [units.rosterId], references: [rosters.id] }),
  users: many(users),
  events: many(events),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  rank: one(ranks, { fields: [users.rankId], references: [ranks.id] }),
  position: one(positions, { fields: [users.positionId], references: [positions.id] }),
  specialty: one(specialties, { fields: [users.specialtyId], references: [specialties.id] }),
  status: one(statuses, { fields: [users.statusId], references: [statuses.id] }),
  unit: one(units, { fields: [users.unitId], references: [units.id] }),
  promotions: many(promotions),
  awards: many(userAwards),
  qualifications: many(userQualifications),
  combatRecords: many(combatRecords),
  attendance: many(eventAttendance),
  photos: many(photos),
  messages: many(chatMessages),
  documents: many(userDocuments),
  notifications: many(notifications),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  unit: one(units, { fields: [events.unitId], references: [units.id] }),
  attendance: many(eventAttendance),
}));

export const eventAttendanceRelations = relations(eventAttendance, ({ one }) => ({
  event: one(events, { fields: [eventAttendance.eventId], references: [events.id] }),
  user: one(users, { fields: [eventAttendance.userId], references: [users.id] }),
}));

export const serverStatusRelations = relations(serverStatus, ({ one }) => ({
  server: one(servers, { fields: [serverStatus.serverId], references: [servers.id] }),
}));

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(users, { fields: [pushSubscriptions.userId], references: [users.id] }),
}));

export const colocacoesRelations = relations(colocacoes, ({ one }) => ({
  user: one(users, { fields: [colocacoes.userId], references: [users.id] }),
  unit: one(units, { fields: [colocacoes.unitId], references: [units.id] }),
  position: one(positions, { fields: [colocacoes.positionId], references: [positions.id] }),
}));

export const operacoesRelations = relations(operacoes, ({ one }) => ({
  unidade: one(units, { fields: [operacoes.unidadeId], references: [units.id] }),
  servidor: one(servers, { fields: [operacoes.servidorId], references: [servers.id] }),
}));

export const bugReportsRelations = relations(bugReports, ({ one }) => ({
  user: one(users, { fields: [bugReports.userId], references: [users.id] }),
}));

export const reactionsRelations = relations(reactions, ({ one }) => ({
  user: one(users, { fields: [reactions.userId], references: [users.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  alvo: one(users, { fields: [reviews.alvoId], references: [users.id] }),
  autor: one(users, { fields: [reviews.autorId], references: [users.id] }),
}));

export const reconhecimentosRelations = relations(reconhecimentos, ({ one }) => ({
  alvo: one(users, { fields: [reconhecimentos.alvoId], references: [users.id] }),
  autor: one(users, { fields: [reconhecimentos.autorId], references: [users.id] }),
}));

export const passwordResetsRelations = relations(passwordResets, ({ one }) => ({
  user: one(users, { fields: [passwordResets.userId], references: [users.id] }),
}));

export const sugestoesRelations = relations(sugestoes, ({ one }) => ({
  user: one(users, { fields: [sugestoes.userId], references: [users.id] }),
}));



export const promotionsRelations = relations(promotions, ({ one }) => ({
  user: one(users, { fields: [promotions.userId], references: [users.id] }),
  rank: one(ranks, { fields: [promotions.rankId], references: [ranks.id] }),
}));

export const awardsRelations = relations(awards, ({ many }) => ({
  recipients: many(userAwards),
}));

export const userAwardsRelations = relations(userAwards, ({ one }) => ({
  user: one(users, { fields: [userAwards.userId], references: [users.id] }),
  award: one(awards, { fields: [userAwards.awardId], references: [awards.id] }),
}));

export const qualificationsRelations = relations(qualifications, ({ many }) => ({
  holders: many(userQualifications),
}));

export const userQualificationsRelations = relations(userQualifications, ({ one }) => ({
  user: one(users, { fields: [userQualifications.userId], references: [users.id] }),
  qualification: one(qualifications, {
    fields: [userQualifications.qualificationId],
    references: [qualifications.id],
  }),
}));

export const combatRecordsRelations = relations(combatRecords, ({ one }) => ({
  user: one(users, { fields: [combatRecords.userId], references: [users.id] }),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  autor: one(users, { fields: [photos.autorId], references: [users.id] }),
  server: one(servers, { fields: [photos.serverId], references: [servers.id] }),
}));

export const enlistmentApplicationsRelations = relations(enlistmentApplications, ({ one }) => ({
  server: one(servers, { fields: [enlistmentApplications.serverId], references: [servers.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  autor: one(users, { fields: [chatMessages.autorId], references: [users.id] }),
  destino: one(users, { fields: [chatMessages.destinoId], references: [users.id] }),
}));

export const documentsRelations = relations(documents, ({ many }) => ({
  emitidos: many(userDocuments),
}));

export const userDocumentsRelations = relations(userDocuments, ({ one }) => ({
  document: one(documents, { fields: [userDocuments.documentId], references: [documents.id] }),
  user: one(users, { fields: [userDocuments.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

/**
 * Modelo RIS · FEV-RIPS — esquemas Zod (una sola definición → tipos TS + validación runtime)
 *
 * Pensado para el BACKEND futuro: la misma validación que hoy corre en el prototipo
 * (motor.js sobre reglas.dmn.json) expresada en Zod, para reutilizarla server-side.
 * Los cruces entre campos van en .superRefine() (equivalen a las reglas ORD.* / CONT.*).
 *
 * Certeza: inferido (arquitectura) sobre datos verificados. Cubre las reglas que el
 * prototipo implementa HOY — NO las 103 RVC + 20 RVG completas del DT1 v002.
 * Los códigos/enums son autoritativos en enums.json (Regla 1.6: tabla viva SISPRO manda).
 */
import { z } from "zod";

/* ---------- Enums (códigos; etiquetas en enums.json) ---------- */
export const TipoDocumento = z.enum(["CC","TI","RC","CE","PT","PE","PA","CN","NV","AS","MS","SI","CD","DE","SC","NI"]);
export const TipoIdPagador = z.enum(["NI","CC","CE"]);
export const TipoUsuario   = z.enum(["01","02","03","04","05","06","07","08","09","10","11","12","13"]);
export const Sexo          = z.enum(["M","F","I"]);
export const Zona          = z.enum(["01","02"]);
export const Cobertura     = z.enum(["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17"]);
export const ModalidadPago = z.enum(["01","02","03","04"]);
export const RConcepto     = z.enum(["01","02","05"]);
export const TipoDx        = z.enum(["01","02","03"]);
export const Finalidad     = z.enum(["15","16","17","18","11","12","13","14","44"]);
export const FormaPago     = z.enum(["1","2"]);
export const MedioPago     = z.enum(["10","47","42","48","49","20","1"]);
export const IvaOpc        = z.enum(["NO","SI"]);
export const Nivel         = z.enum(["1","2","3"]);

/* ---------- Convenio ---------- */
export const Convenio = z.object({
  id: z.string().regex(/^CV[0-9]+$/).optional(),
  nombre: z.string().min(1, "El convenio necesita nombre y NIT."),
  tipoId: TipoIdPagador,
  nid: z.string().min(1, "El convenio necesita nombre y NIT."),
  razon: z.string().optional().default(""),
  tipoUsuarios: z.array(TipoUsuario).min(1, "Selecciona al menos un tipo de usuario que atiende el convenio."),
  forma: FormaPago,
  medio: MedioPago,
  plazo: z.string().regex(/^[0-9]+$/).optional(),
  iva: IvaOpc,
  ret: z.string().optional(),
  reqAut: z.boolean(),
  reqMipres: z.boolean(),
  reqSiras: z.boolean(),
});
export type Convenio = z.infer<typeof Convenio>;

/* ---------- Contrato ---------- */
const TarifaItem = z.object({ c: z.string(), n: z.string(), p: z.number().positive() });
const InsumoItem = z.object({ c: z.string(), n: z.string(), tipo: z.enum(["medicamento","dispositivo"]), p: z.number().positive() });

/** Tabla de decisión: tipo de usuario del paciente → figura de recaudo. Acuerdo 260, POR VALIDAR.
 *  Espejo del mapa RECAUDO_TU en reglas.dmn.json. Los tipos no listados ⇒ no aplica recaudo. */
export const RECAUDO_TU: Record<string, "copago" | "cuota"> = {
  "01": "cuota", "02": "cuota", "03": "cuota", "06": "cuota",
  "04": "copago", "07": "copago", "13": "copago",
};

/** El contrato guarda AMBAS figuras (todas opcionales); cuál aplica lo decide el tipo de usuario. */
export const Recaudo = z.object({
  copago: z.object({
    n1: z.string().optional(), n2: z.string().optional(), n3: z.string().optional(), tope: z.string().optional(),
  }).optional(),
  cuota: z.object({
    n1: z.string().optional(), n2: z.string().optional(), n3: z.string().optional(),
  }).optional(),
});

export const Contrato = z.object({
  id: z.string().regex(/^CT[0-9]+$/).optional(),
  nombre: z.string().trim().min(1, "El contrato necesita un nombre."),
  convId: z.string().regex(/^CV[0-9]+$/, "Selecciona el convenio."),
  cob: Cobertura,
  mod: ModalidadPago,
  desde: z.string(),
  hasta: z.string(),
  tarifa: z.array(TarifaItem).min(1, "Agrega al menos un estudio a la tarifa."),
  insumos: z.array(InsumoItem).default([]),
  recaudo: Recaudo,
}).superRefine((k, ctx) => {
  // CONT.vigencia
  if (k.desde && k.hasta && k.desde > k.hasta)
    ctx.addIssue({ path: ["hasta"], code: z.ZodIssueCode.custom, message: "Vigencia inválida." });
  // CONT.copagoRango — copago opcional; de los valores digitados (no-NaN), cada uno 0–100
  const cop = k.recaudo.copago ?? {};
  const ps = [cop.n1, cop.n2, cop.n3].map((x) => parseFloat(String(x))).filter((x) => !isNaN(x));
  if (ps.some((x) => x < 0 || x > 100))
    ctx.addIssue({ path: ["recaudo", "copago"], code: z.ZodIssueCode.custom, message: "El copago es un porcentaje entre 0 y 100." });
});
export type Contrato = z.infer<typeof Contrato>;

/* ---------- Orden ----------
 * 'contexto' son los datos resueltos del convenio/contrato (join server-side):
 * reqAut, recaudoConcepto, tiposUsuario. Sobre ellos corren los cruces condicionales.
 */
const Municipio = z.object({ c: z.string().min(1), n: z.string().optional(), d: z.string().optional() });

const Estudio = z.object({
  c: z.string(), n: z.string(), p: z.number(),
  dx: z.object({ c: z.string().min(1), n: z.string().optional() }).nullable(),
  tdx: TipoDx.default("01"),
  fin: Finalidad.default("15"),
});

const InsumoOrden = z.object({
  c: z.string(), n: z.string(), tipo: z.enum(["medicamento","dispositivo"]), p: z.number(),
  cantidad: z.union([z.string(), z.number()]),
});

const Contexto = z.object({
  reqAut: z.boolean().optional(),
  tiposUsuario: z.array(z.string()).optional().default([]),
});

export const Orden = z.object({
  convId: z.string().min(1),
  contId: z.string().min(1, "Selecciona el contrato"),
  nivel: z.string().optional().default(""),
  aut: z.string().optional().default(""),
  pac: z.object({
    tipo: TipoDocumento,
    num: z.string().min(1),
    nom: z.string().min(1),
    sexo: Sexo.optional(),
    fnac: z.string().min(1),
    incap: z.boolean().optional(),
    zona: Zona.optional(),
    tipoUsuario: z.string().optional().default(""),
    mun: Municipio.nullable(),
  }),
  estudios: z.array(Estudio).min(1, "Agrega al menos un estudio"),
  insumos: z.array(InsumoOrden).default([]),
  contexto: Contexto.optional().default({}),
}).superRefine((o, ctx) => {
  // ORD.pacIdentidad (mensaje agregado, como en el prototipo)
  if (!o.pac.tipo || !o.pac.num || !o.pac.nom || !o.pac.fnac)
    ctx.addIssue({ path: ["pac"], code: z.ZodIssueCode.custom, message: "Completa identidad del paciente (tipo, número, nombre, fecha nac.)" });
  // ORD.pacMunicipio
  if (!o.pac.mun || !o.pac.mun.c)
    ctx.addIssue({ path: ["pac", "mun"], code: z.ZodIssueCode.custom, message: "Municipio de residencia del paciente" });
  // ORD.pacTipoUsuario
  if ((o.contexto?.tiposUsuario?.length ?? 0) > 0 && !o.pac.tipoUsuario)
    ctx.addIssue({ path: ["pac", "tipoUsuario"], code: z.ZodIssueCode.custom, message: "Tipo de usuario del paciente" });
  // ORD.autorizacion
  if (o.contexto?.reqAut && !o.aut)
    ctx.addIssue({ path: ["aut"], code: z.ZodIssueCode.custom, message: "Código de autorización (lo exige el convenio)" });
  // ORD.nivel — el nivel se exige si el tipo de usuario del paciente genera recaudo (RECAUDO_TU)
  const conc = RECAUDO_TU[o.pac.tipoUsuario ?? ""];
  if (o.contId && (conc === "copago" || conc === "cuota") && !o.nivel)
    ctx.addIssue({ path: ["nivel"], code: z.ZodIssueCode.custom, message: "Selecciona el nivel de contribución del paciente" });
  // ORD.estudioDx
  o.estudios.forEach((e, i) => {
    if (!e.dx || !e.dx.c)
      ctx.addIssue({ path: ["estudios", i, "dx"], code: z.ZodIssueCode.custom, message: `Estudio ${e.c}: falta diagnóstico (CIE-10)` });
  });
  // ORD.insumoCantidad
  o.insumos.forEach((e, i) => {
    if (!e.cantidad || Number(e.cantidad) <= 0)
      ctx.addIssue({ path: ["insumos", i, "cantidad"], code: z.ZodIssueCode.custom, message: `Insumo ${e.c}: cantidad inválida` });
  });
});
export type Orden = z.infer<typeof Orden>;

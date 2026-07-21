/* ============================================================
 *  orden-a-rips.mjs — transform Orden (captura) → RIPS 948 (destino)
 *  Fusión P0 · Fase 4 · implementación de REFERENCIA (portar a TS en generador-rips).
 *
 *  Toma el modelo de captura (Orden + Contrato + Convenio + Config-IPS + fecha de
 *  atención del RIS) y produce el JSON RIPS de la Res. 948 (estructura de rips-tipos.ts).
 *  Rellena lo capturable HOY y DEVUELVE la lista de `faltantes` (campos obligatorios que
 *  aún no se capturan) → base del gate honesto: "faltan N campos para el RIPS".
 *
 *  Alcance honesto: NO calcula recaudo (conceptoRecaudo/valorPagoModerador) — eso es P1,
 *  por-validar (ver "Recaudo — hoja de validación"). Los CIE-11 son opcionales (no ptbles).
 *  Estructura destino 1:1 de rips-tipos.ts. Nada inventado; los GAP quedan null + listados.
 * ============================================================ */
"use strict";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

/** RIPS usa el catálogo de 13; para la FEV se traduce (crosswalk §2, por-validar). Aquí RIPS. */
const incapacidadNoSi = (b) => (b ? "SI" : "NO");

/**
 * @param {object} orden     modelo de captura (pac, estudios[], insumos[], aut, ...)
 * @param {object} contrato  contrato resuelto (cob, mod, tarifa, ...)
 * @param {object} convenio  convenio resuelto (reqMipres, reqSiras, ...)
 * @param {object} configIPS { numDocumentoIdObligado, codPrestador, codServicio, numFactura }
 * @param {string} fechaAtencion  "YYYY-MM-DD HH:mm" heredada del inicio de atención del RIS
 * @returns {{rips: object, faltantes: string[]}}
 */
export function transformOrdenARips(orden, contrato, convenio, configIPS = {}, fechaAtencion = null) {
  const faltantes = [];
  const req = (cond, campo) => { if (!cond) faltantes.push(campo); };

  req(configIPS.numDocumentoIdObligado, "config-ips: numDocumentoIdObligado (NIT prestador)");
  req(configIPS.codPrestador, "config-ips: codPrestador (REPS sede)");
  req(fechaAtencion, "fechaInicioAtencion (del RIS)");

  const pac = orden.pac || {};
  req(pac.tipo, "pac.tipo"); req(pac.num, "pac.num"); req(pac.fnac, "pac.fnac");
  req(pac.sexo, "pac.codSexo"); req(pac.mun && pac.mun.c, "pac.codMunicipioResidencia");

  const usuario = {
    tipoDocumentoIdentificacion: pac.tipo || null,
    numDocumentoIdentificacion: pac.num || null,
    tipoUsuario: pac.tipoUsuario || null,
    fechaNacimiento: pac.fnac || null,
    codSexo: pac.sexo || null,
    codPaisResidencia: pac.paisRes || "170",     // default Colombia; GAP si se exige otro
    codMunicipioResidencia: (pac.mun && pac.mun.c) || null,
    codZonaTerritorialResidencia: pac.zona || null,
    incapacidad: incapacidadNoSi(!!pac.incap),
    consecutivo: 1,
    codPaisOrigen: pac.paisOrig || "170",
    registroSIRAS: pac.tipoUsuario === "10" ? (orden.registroSIRAS || null) : null,
    servicios: {},
  };
  if (pac.tipoUsuario === "10" && !orden.registroSIRAS) faltantes.push("registroSIRAS (tipoUsuario 10 SOAT)");

  // --- procedimientos: los estudios del RIS (imágenes = CUPS de procedimiento) ---
  const procedimientos = (orden.estudios || []).map((e, i) => {
    const s = {
      codPrestador: configIPS.codPrestador || null,
      fechaInicioAtencion: fechaAtencion || null,
      idMIPRES: e.idMIPRES || null,
      numAutorizacion: orden.aut || null,
      codProcedimiento: e.c || null,
      viaIngresoServicioSalud: e.via || null,
      modalidadGrupoServicioTecSal: e.modalidadGrupo || null,   // GAP captura
      grupoServicios: e.grupoServicios || null,                 // GAP captura
      codServicio: configIPS.codServicio != null ? configIPS.codServicio : null, // config REPS
      finalidadTecnologiaSalud: e.fin || null,
      tipoDocumentoIdentificacion: e.profTipo || null,          // GAP profesional
      numDocumentoIdentificacion: e.profNum || null,            // GAP profesional
      codDiagnosticoPrincipal: (e.dx && e.dx.c) || null,
      codDiagnosticoPrincipalCIE11: null,
      nomCodDiagnosticoPrincipalCIE11: null,
      codDiagnosticoRelacionado: e.dxRel || null,               // GAP
      codDiagnosticoRelacionadoCIE11: null,
      nomCodDiagnosticoRelacionadoCIE11: null,
      codComplicacion: null,
      codComplicacionCIE11: null,
      nomComplicacionCIE11: null,
      vrServicio: e.p != null ? e.p : null,
      conceptoRecaudo: null,        // P1 · por-validar (hoja de recaudo)
      valorPagoModerador: null,     // P1 · por-validar
      numFEVPagoModerador: null,    // GAP (RVC036)
      codigoVIDA: null,
      consecutivo: i + 1,
    };
    if (!s.modalidadGrupoServicioTecSal) faltantes.push(`estudio[${i}] ${e.c}: modalidadGrupoServicioTecSal`);
    if (!s.grupoServicios) faltantes.push(`estudio[${i}] ${e.c}: grupoServicios`);
    if (!s.codServicio) faltantes.push(`estudio[${i}] ${e.c}: codServicio (REPS)`);
    if (!s.tipoDocumentoIdentificacion) faltantes.push(`estudio[${i}] ${e.c}: documento del profesional`);
    if (!s.codDiagnosticoPrincipal) faltantes.push(`estudio[${i}] ${e.c}: codDiagnosticoPrincipal (CIE-10)`);
    return s;
  });
  if (!procedimientos.length) faltantes.push("servicios: ≥1 procedimiento");
  if (procedimientos.length) usuario.servicios.procedimientos = procedimientos;

  // --- insumos → medicamentos (CUM/IUM) / otrosServicios (dispositivo) ---
  const meds = [], otros = [];
  (orden.insumos || []).forEach((it, i) => {
    if (it.tipo === "medicamento") {
      meds.push({
        codPrestador: configIPS.codPrestador || null,
        numAutorizacion: orden.aut || null, idMIPRES: it.idMIPRES || null,
        fechaDispensAdmon: fechaAtencion || null,
        codDiagnosticoPrincipal: (it.dx && it.dx.c) || null,
        codDiagnosticoPrincipalCIE11: null, nomCodDiagnosticoPrincipalCIE11: null,
        codDiagnosticoRelacionado: null, codDiagnosticoRelacionadoCIE11: null, nomCodDiagnosticoRelacionadoCIE11: null,
        tipoMedicamento: it.tipoMedicamento || null,             // GAP
        codTecnologiaSalud: it.c || null, nomTecnologiaSalud: it.n || null,
        concentracionMedicamento: it.concentracion || null,      // GAP
        unidadMedida: it.unidadMedida || null,                   // GAP
        formaFarmaceutica: it.formaFarmaceutica || null,         // GAP
        unidadMinDispensa: it.unidadMinDispensa || null,         // GAP
        cantidadMedicamento: it.cantidad != null ? Number(it.cantidad) : null,
        diasTratamiento: it.diasTratamiento || null,             // GAP
        tipoDocumentoIdentificacion: it.profTipo || null, numDocumentoIdentificacion: it.profNum || null,
        vrUnitMedicamento: it.p != null ? it.p : null, vrDispensacion: null,
        vrServicio: (it.p != null && it.cantidad != null) ? it.p * Number(it.cantidad) : null,
        conceptoRecaudo: null, valorPagoModerador: null, numFEVPagoModerador: null,
        codigoVIDA: null, consecutivo: i + 1,
      });
      faltantes.push(`insumo[${i}] ${it.c} (medicamento): campos farmacéuticos (tipoMedicamento, concentración, unidadMedida, formaFarmacéutica, unidadMinDispensa, díasTratamiento)`);
    } else {
      otros.push({
        codPrestador: configIPS.codPrestador || null,
        numAutorizacion: orden.aut || null, idMIPRES: it.idMIPRES || null,
        fechaSuministroTecnologia: fechaAtencion || null,
        tipoOS: it.tipoOS || null,                               // GAP
        codTecnologiaSalud: it.c || null, nomTecnologiaSalud: it.n || null,
        cantidadOS: it.cantidad != null ? Number(it.cantidad) : null,
        tipoDocumentoIdentificacion: it.profTipo || null, numDocumentoIdentificacion: it.profNum || null,
        vrUnitOS: it.p != null ? it.p : null, vrDispensacion: null,
        vrServicio: (it.p != null && it.cantidad != null) ? it.p * Number(it.cantidad) : null,
        conceptoRecaudo: null, valorPagoModerador: null, numFEVPagoModerador: null,
        codigoVIDA: null, consecutivo: i + 1,
      });
      faltantes.push(`insumo[${i}] ${it.c} (dispositivo): tipoOS`);
    }
  });
  if (meds.length) usuario.servicios.medicamentos = meds;
  if (otros.length) usuario.servicios.otrosServicios = otros;

  const rips = {
    numDocumentoIdObligado: configIPS.numDocumentoIdObligado || null,
    numFactura: orden.numFactura || configIPS.numFactura || null,
    tipoNota: null,
    numNota: null,
    usuarios: [usuario],
  };
  return { rips, faltantes };
}

/* --- demo/auto-test node: node modelo-formal/transform/orden-a-rips.mjs --- */
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const orden = {
    convId: "CV1", contId: "CT1", nivel: "", aut: "AUT-000123",
    pac: { tipo: "CC", num: "1017254896", nom: "Jhonathan Pérez", sexo: "M", fnac: "1990-05-14",
           incap: false, zona: "02", tipoUsuario: "02", mun: { c: "05266", n: "Envigado", d: "Antioquia" } },
    estudios: [{ c: "879111", n: "TAC DE CRANEO SIMPLE", p: 280000, dx: { c: "R51X", n: "Cefalea" }, tdx: "01", fin: "15", via: "02" }],
    insumos: [{ c: "1I1002971000100", n: "IOPAMIDOL", tipo: "medicamento", p: 48000, cantidad: 1 }],
  };
  const configIPS = { numDocumentoIdObligado: "900123456", codPrestador: "050010123401", codServicio: 710 };
  const { rips, faltantes } = transformOrdenARips(orden, {}, {}, configIPS, "2026-07-20 09:30");
  const u = rips.usuarios[0], p = u.servicios.procedimientos[0];
  const total = Object.keys(p).length;
  const llenos = Object.values(p).filter((v) => v !== null).length;
  console.log("✓ RIPS generado. Cabecera numFactura:", rips.numFactura, "| usuario tipoUsuario:", u.tipoUsuario, "incapacidad:", u.incapacidad);
  console.log(`✓ procedimiento[0]: ${llenos}/${total} campos llenos; codProcedimiento=${p.codProcedimiento} via=${p.viaIngresoServicioSalud} vrServicio=${p.vrServicio}`);
  console.log(`✓ arreglos servicios: ${Object.keys(u.servicios).join(", ")}`);
  console.log(`⚠ faltantes para RIPS válido (${faltantes.length}):`);
  faltantes.forEach((f) => console.log("   -", f));
}

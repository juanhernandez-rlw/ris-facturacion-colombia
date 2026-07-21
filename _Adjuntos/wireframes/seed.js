/* ============================================================
 *  seed.js — datos DEMO del prototipo (window.RIS_SEED)
 *
 *  Extraídos VERBATIM del prototipo (Regla 1.2: no se alteran).
 *  · Convenios: nombres de entidades REALES; NIT/retenciones son de demo (no hay registro EAPB cargado).
 *  · Contratos: CUPS/IUM REALES; precios (tarifa negociada) y % de recaudo son de demo
 *    (Acuerdo 260: copago 11.5/17.3/23%).
 *  · recaudo: guarda AMBAS figuras {copago:{n1,n2,n3,tope}, cuota:{n1,n2,n3}}; la que aplica
 *    la determina el tipo de usuario del paciente en la orden (mapa RECAUDO_TU del modelo).
 *  · _E/_I: estudios e insumos REALES (código · nombre de la tabla viva SISPRO) para el seed.
 *
 *  Separado del motor y del modelo: esto es DATO de ejemplo, no reglas ni catálogo.
 * ============================================================ */
(function (root) {
  "use strict";

  /* estudios e insumos REALES para el seed (código · nombre de la tabla viva SISPRO) */
  var _E = {
    rxcraneo: ["870001", "RADIOGRAFIA DE CRANEO SIMPLE"],
    rxcervical: ["871010", "RADIOGRAFIA DE COLUMNA CERVICAL"],
    rxlumbar: ["871040", "RADIOGRAFIA DE COLUMNA LUMBOSACRA"],
    rxtorax: ["871121", "RADIOGRAFIA DE TORAX (P.A. O A.P. Y LATERAL)"],
    rxabdomen: ["872002", "RADIOGRAFIA DE ABDOMEN SIMPLE"],
    mamo: ["876802", "XEROMAMOGRAFIA O MAMOGRAFIA BILATERAL"],
    taccraneo: ["879111", "TOMOGRAFIA AXIAL COMPUTADA DE CRANEO SIMPLE"],
    taccraneoc: ["879112", "TOMOGRAFIA AXIAL COMPUTADA DE CRANEO CON CONTRASTE"],
    tacsenos: ["879131", "TOMOGRAFIA AXIAL COMPUTADA DE SENOS PARANASALES O CARA"],
    rmcerebro: ["883101", "RESONANCIA NUCLEAR MAGNETICA DE CEREBRO"],
    rmlumbarc: ["883231", "RESONANCIA NUCLEAR MAGNETICA DE COLUMNA LUMBAR CON CONTRASTE"],
    rmrodilla: ["883522", "RESONANCIA NUCLEAR MAGNETICA DE ARTICULACIONES DE MIEMBRO INFERIOR"],
    ecoobst: ["881436", "ECOGRAFIA OBSTETRICA CON TRANSLUCENCIA NUCAL"],
    dopcuello: ["882111", "DUPLEX SCANNING (DOPPLER) DE VASOS DEL CUELLO"],
    dopmmii: ["882308", "ECOGRAFIA DOPPLER DE VASOS ARTERIALES DE MIEMBROS INFERIORES"],
    densito: ["886011", "OSTEODENSITOMETRIA POR TAC"]
  };
  var _I = {
    iopamidol: ["1I1002971000100", "IOPAMIDOL 612.4mg/ml SOLUCION INTRAVENOSA (IOPA) VIAL 50 ml"],
    iodixanol: ["1I1035061000100", "IODIXANOL 652mg/ml SOLUCION INYECTABLE"],
    gadoterico: ["1G1027771000100", "ACIDO GADOTERICO 279.3mg/ml SOLUCION INTRAVENOSA (CLARISCAN)"],
    gadoteridol: ["1G1003021000100", "GADOTERIDOL 279.3mg/ml SOLUCION INTRAVENOSA (PROHANCE)"],
    bario: ["1B1008531000100", "BARIO 4922.4mg/100ml SUSPENSION ORAL (EZCAT) 225 ml"]
  };
  var mkE = function (k, p) { return { c: _E[k][0], n: _E[k][1], p: p }; };
  var mkI = function (k, p) { return { c: _I[k][0], n: _I[k][1], tipo: "medicamento", p: p }; };

  /* recaudo demo idéntico en todos los contratos del seed (placeholder del rediseño copago/cuota) */
  var REC = function () { return { copago: { n1: "11.5", n2: "17.3", n3: "23", tope: "400000" }, cuota: { n1: "4500", n2: "18000", n3: "47000" } }; };

  var convenios = [
    { id: "CV1", nombre: "EPS Sura", tipoId: "NI", nid: "800088702", razon: "EPS y Medicina Prepagada Suramericana S.A.", tipoUsuarios: ["01", "02", "03"], forma: "2", medio: "47", plazo: "60", iva: "NO", ret: "2.5", reqAut: true, reqMipres: false, reqSiras: false },
    { id: "CV2", nombre: "Nueva EPS (Contributivo)", tipoId: "NI", nid: "900156264", razon: "Nueva EPS S.A.", tipoUsuarios: ["01", "02", "03"], forma: "2", medio: "47", plazo: "60", iva: "NO", ret: "2.5", reqAut: true, reqMipres: false, reqSiras: false },
    { id: "CV3", nombre: "Nueva EPS (Subsidiado)", tipoId: "NI", nid: "900156264", razon: "Nueva EPS S.A.", tipoUsuarios: ["04"], forma: "2", medio: "47", plazo: "90", iva: "NO", ret: "0", reqAut: true, reqMipres: false, reqSiras: false },
    { id: "CV4", nombre: "EPS Sanitas", tipoId: "NI", nid: "900249425", razon: "EPS Sanitas S.A.S.", tipoUsuarios: ["01", "02", "03"], forma: "2", medio: "47", plazo: "45", iva: "NO", ret: "2.5", reqAut: true, reqMipres: false, reqSiras: false },
    { id: "CV5", nombre: "Salud Total EPS", tipoId: "NI", nid: "800130907", razon: "Salud Total S.A. EPS-S", tipoUsuarios: ["01", "02", "03"], forma: "2", medio: "47", plazo: "60", iva: "NO", ret: "2.5", reqAut: true, reqMipres: false, reqSiras: false },
    { id: "CV6", nombre: "Coosalud EPS-S", tipoId: "NI", nid: "900226715", razon: "Coosalud EPS S.A.", tipoUsuarios: ["04"], forma: "2", medio: "47", plazo: "90", iva: "NO", ret: "0", reqAut: true, reqMipres: false, reqSiras: false },
    { id: "CV7", nombre: "Positiva ARL", tipoId: "NI", nid: "860011153", razon: "Positiva Compañía de Seguros S.A.", tipoUsuarios: ["09"], forma: "2", medio: "47", plazo: "30", iva: "NO", ret: "2", reqAut: true, reqMipres: false, reqSiras: false },
    { id: "CV8", nombre: "Seguros del Estado (SOAT)", tipoId: "NI", nid: "860009578", razon: "Seguros del Estado S.A.", tipoUsuarios: ["10"], forma: "2", medio: "47", plazo: "45", iva: "NO", ret: "1", reqAut: false, reqMipres: false, reqSiras: true },
    { id: "CV9", nombre: "Colsanitas Medicina Prepagada", tipoId: "NI", nid: "860003411", razon: "Colsanitas S.A.S.", tipoUsuarios: ["11"], forma: "2", medio: "48", plazo: "30", iva: "NO", ret: "0", reqAut: true, reqMipres: false, reqSiras: false },
    { id: "CV10", nombre: "Particular", tipoId: "CC", nid: "222222222222", razon: "Consumidor final (particular)", tipoUsuarios: ["12"], forma: "1", medio: "10", plazo: "0", iva: "NO", ret: "0", reqAut: false, reqMipres: false, reqSiras: false }
  ];

  var contratos = [
    { id: "CT1", nombre: "Imágenes ambulatorias 2026", convId: "CV1", cob: "01", mod: "04", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("rxtorax", 42000), mkE("rxlumbar", 48000), mkE("ecoobst", 96000), mkE("taccraneo", 280000), mkE("taccraneoc", 420000), mkE("rmcerebro", 620000)],
      insumos: [mkI("iopamidol", 48000), mkI("gadoteridol", 120000)], recaudo: REC() },
    { id: "CT2", nombre: "Alta complejidad RM/TAC 2026", convId: "CV1", cob: "16", mod: "01", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("taccraneoc", 430000), mkE("rmlumbarc", 980000), mkE("rmrodilla", 760000), mkE("densito", 130000)],
      insumos: [mkI("iopamidol", 48000), mkI("gadoterico", 95000)], recaudo: REC() },
    { id: "CT3", nombre: "Detección temprana (mama/densito)", convId: "CV1", cob: "01", mod: "04", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("mamo", 95000), mkE("densito", 135000), mkE("ecoobst", 98000)], insumos: [], recaudo: REC() },
    { id: "CT4", nombre: "Radiología básica contributivo", convId: "CV2", cob: "01", mod: "04", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("rxcraneo", 28000), mkE("rxtorax", 40000), mkE("rxcervical", 45000), mkE("rxabdomen", 38000), mkE("mamo", 92000)],
      insumos: [], recaudo: REC() },
    { id: "CT5", nombre: "Imágenes subsidiado 2026", convId: "CV3", cob: "17", mod: "03", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("rxtorax", 38000), mkE("ecoobst", 88000), mkE("taccraneo", 260000)], insumos: [], recaudo: REC() },
    { id: "CT6", nombre: "Ambulatorio Sanitas 2026", convId: "CV4", cob: "01", mod: "04", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("ecoobst", 99000), mkE("dopcuello", 210000), mkE("dopmmii", 230000), mkE("taccraneo", 290000), mkE("rmcerebro", 640000)],
      insumos: [mkI("gadoteridol", 125000)], recaudo: REC() },
    { id: "CT7", nombre: "Imágenes Salud Total 2026", convId: "CV5", cob: "01", mod: "04", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("rxtorax", 41000), mkE("mamo", 90000), mkE("densito", 120000), mkE("taccraneoc", 415000)],
      insumos: [mkI("iopamidol", 47000)], recaudo: REC() },
    { id: "CT8", nombre: "Subsidiado Coosalud imágenes", convId: "CV6", cob: "17", mod: "03", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("rxcraneo", 26000), mkE("rxtorax", 37000), mkE("ecoobst", 85000)], insumos: [], recaudo: REC() },
    { id: "CT9", nombre: "Accidente laboral - imágenes", convId: "CV7", cob: "05", mod: "04", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("rxcervical", 46000), mkE("rxlumbar", 49000), mkE("taccraneoc", 440000), mkE("rmlumbarc", 990000), mkE("rmrodilla", 780000)],
      insumos: [mkI("gadoterico", 98000)], recaudo: REC() },
    { id: "CT10", nombre: "SOAT - trauma imágenes", convId: "CV8", cob: "04", mod: "04", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("taccraneo", 300000), mkE("taccraneoc", 450000), mkE("rxtorax", 44000), mkE("rmlumbarc", 1000000)],
      insumos: [mkI("iopamidol", 50000)], recaudo: REC() },
    { id: "CT11", nombre: "Prepagada alta gama 2026", convId: "CV9", cob: "11", mod: "04", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("rmcerebro", 720000), mkE("rmlumbarc", 1080000), mkE("taccraneoc", 520000), mkE("densito", 150000)],
      insumos: [mkI("gadoteridol", 130000)], recaudo: REC() },
    { id: "CT12", nombre: "Tarifa particular 2026", convId: "CV10", cob: "15", mod: "04", desde: "2026-01-01", hasta: "2026-12-31",
      tarifa: [mkE("rxtorax", 65000), mkE("ecoobst", 160000), mkE("taccraneo", 380000), mkE("taccraneoc", 560000), mkE("rmcerebro", 900000), mkE("rmlumbarc", 1150000), mkE("mamo", 140000), mkE("densito", 160000)],
      insumos: [mkI("iopamidol", 60000), mkI("gadoteridol", 150000), mkI("bario", 42000)], recaudo: REC() }
  ];

  var RIS_SEED = { convenios: convenios, contratos: contratos, nC: 10, nK: 12 };

  if (typeof module !== "undefined" && module.exports) module.exports = RIS_SEED;
  if (typeof window !== "undefined") window.RIS_SEED = RIS_SEED;
})(this);

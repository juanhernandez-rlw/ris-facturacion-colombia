/* ============================================================
 *  GENERADO por modelo-formal/build.mjs — NO EDITAR A MANO.
 *  Fuente: modelo-formal/enums.json + modelo-formal/reglas.dmn.json
 *  Regenerar:  node modelo-formal/build.mjs
 * ============================================================ */
"use strict";
(function (root) {
  var RIS_MODELO = {
    "_meta": {
      "generado_por": "modelo-formal/build.mjs",
      "fuente": [
        "modelo-formal/enums.json",
        "modelo-formal/reglas.dmn.json"
      ],
      "nota": "GENERADO — no editar a mano. Edita los JSON canónicos y re-ejecuta build.mjs.",
      "alcance": "IMPORTANTE (Regla 3.2): esto formaliza SOLO las reglas que el prototipo implementa HOY (su validate(), sus guardas de guardado y su visibilidad condicional). NO son las 103 RVC + 20 RVG completas del DT1 v002. La cobertura total está inventariada, pendiente, en [[Inventario de cruces (RVC-RVG) — cobertura del validador]]. Los ids RVC/RVG concretos quedan por-verificar (Regla 1.1: no se inventan números)."
    },
    "enums": {
      "TIPO_DOCUMENTO": [
        [
          "CC",
          "CC · Cédula de ciudadanía"
        ],
        [
          "TI",
          "TI · Tarjeta de identidad"
        ],
        [
          "RC",
          "RC · Registro civil"
        ],
        [
          "CE",
          "CE · Cédula de extranjería"
        ],
        [
          "PT",
          "PT · Permiso por protección temporal"
        ],
        [
          "PE",
          "PE · Permiso especial de permanencia"
        ],
        [
          "PA",
          "PA · Pasaporte"
        ],
        [
          "CN",
          "CN · Certificado de nacido vivo"
        ],
        [
          "NV",
          "NV · Certificado nacido vivo"
        ],
        [
          "AS",
          "AS · Adulto sin identificación"
        ],
        [
          "MS",
          "MS · Menor sin identificación"
        ],
        [
          "SI",
          "SI · Sin identificación"
        ],
        [
          "CD",
          "CD · Carné diplomático"
        ],
        [
          "DE",
          "DE · Documento extranjero"
        ],
        [
          "SC",
          "SC · Salvoconducto"
        ],
        [
          "NI",
          "NI · NIT"
        ]
      ],
      "TIPO_ID_PAGADOR": [
        [
          "NI",
          "NI · NIT"
        ],
        [
          "CC",
          "CC · Cédula de ciudadanía"
        ],
        [
          "CE",
          "CE · Cédula de extranjería"
        ]
      ],
      "TIPO_USUARIO": [
        [
          "01",
          "01 · Contributivo cotizante"
        ],
        [
          "02",
          "02 · Contributivo beneficiario"
        ],
        [
          "03",
          "03 · Contributivo adicional"
        ],
        [
          "04",
          "04 · Subsidiado"
        ],
        [
          "05",
          "05 · No afiliado"
        ],
        [
          "06",
          "06 · Especial/excepción cotizante"
        ],
        [
          "07",
          "07 · Especial/excepción beneficiario"
        ],
        [
          "08",
          "08 · Privados de la libertad (FNS)"
        ],
        [
          "09",
          "09 · Tomador/amparado ARL"
        ],
        [
          "10",
          "10 · Tomador/amparado SOAT"
        ],
        [
          "11",
          "11 · Tomador/amparado planes voluntarios"
        ],
        [
          "12",
          "12 · Particular"
        ],
        [
          "13",
          "13 · Especial/excepción no cotizante (Ley 352/1997)"
        ]
      ],
      "SEXO": [
        [
          "M",
          "M · Masculino"
        ],
        [
          "F",
          "F · Femenino"
        ],
        [
          "I",
          "I · Indeterminado / intersexual"
        ]
      ],
      "ZONA": [
        [
          "01",
          "01 · Rural"
        ],
        [
          "02",
          "02 · Urbano"
        ]
      ],
      "COBERTURA": [
        [
          "01",
          "01 · Plan de beneficios (UPC)"
        ],
        [
          "02",
          "02 · Presupuesto máximo"
        ],
        [
          "03",
          "03 · Prima EPS/EOC, no asegurados SOAT"
        ],
        [
          "04",
          "04 · Cobertura póliza SOAT"
        ],
        [
          "05",
          "05 · Cobertura ARL"
        ],
        [
          "06",
          "06 · Cobertura ADRES"
        ],
        [
          "07",
          "07 · Salud pública"
        ],
        [
          "08",
          "08 · Entidad territorial (oferta)"
        ],
        [
          "09",
          "09 · Urgencias población migrante"
        ],
        [
          "10",
          "10 · Plan complementario"
        ],
        [
          "11",
          "11 · Medicina prepagada"
        ],
        [
          "12",
          "12 · Otras pólizas en salud"
        ],
        [
          "13",
          "13 · Régimen especial o excepción"
        ],
        [
          "14",
          "14 · Fondo Nacional Salud PPL"
        ],
        [
          "15",
          "15 · Particular"
        ],
        [
          "16",
          "16 · UPC Contributivo"
        ],
        [
          "17",
          "17 · UPC Subsidiado"
        ]
      ],
      "MODALIDAD_PAGO": [
        [
          "01",
          "01 · Paquete / Canasta / Conjunto Integral en Salud"
        ],
        [
          "02",
          "02 · Grupos Relacionados por diagnóstico"
        ],
        [
          "03",
          "03 · Integral por grupo de riesgo"
        ],
        [
          "04",
          "04 · Pago por contacto por especialidad"
        ],
        [
          "05",
          "05 · Pago por escenario de atención"
        ],
        [
          "06",
          "06 · Pago por tipo de servicio"
        ],
        [
          "07",
          "07 · Pago global prospectivo por episodio"
        ],
        [
          "08",
          "08 · Pago global prospectivo por grupo de riesgo"
        ],
        [
          "09",
          "09 · Pago global prospectivo por especialidad"
        ],
        [
          "10",
          "10 · Pago global prospectivo por nivel de complejidad"
        ],
        [
          "11",
          "11 · Capitación"
        ],
        [
          "12",
          "12 · Pago por Servicio"
        ]
      ],
      "RCONCEPTO": [
        [
          "01",
          "01 · Copago"
        ],
        [
          "02",
          "02 · Cuota moderadora"
        ],
        [
          "03",
          "03 · Pagos compartidos en planes voluntarios de salud"
        ],
        [
          "04",
          "04 · Anticipo"
        ],
        [
          "05",
          "05 · No aplica"
        ]
      ],
      "TIPO_DX": [
        [
          "01",
          "01 · Impresión diagnóstica"
        ],
        [
          "02",
          "02 · Confirmado nuevo"
        ],
        [
          "03",
          "03 · Confirmado repetido"
        ]
      ],
      "FINALIDAD": [
        [
          "15",
          "15 · Diagnóstico"
        ],
        [
          "16",
          "16 · Tratamiento"
        ],
        [
          "17",
          "17 · Rehabilitación"
        ],
        [
          "18",
          "18 · Paliación"
        ],
        [
          "11",
          "11 · Valoración integral PyM"
        ],
        [
          "12",
          "12 · Detección temprana enf. general"
        ],
        [
          "13",
          "13 · Detección temprana enf. laboral"
        ],
        [
          "14",
          "14 · Protección específica"
        ],
        [
          "44",
          "44 · Otra"
        ]
      ],
      "VIA_INGRESO": [
        [
          "01",
          "01 · Demanda espontánea"
        ],
        [
          "02",
          "02 · Derivado de consulta externa"
        ]
      ],
      "FORMAPAGO": [
        [
          "1",
          "1 · Contado"
        ],
        [
          "2",
          "2 · Crédito"
        ]
      ],
      "MEDIOPAGO": [
        [
          "10",
          "10 · Efectivo"
        ],
        [
          "47",
          "47 · Transferencia débito bancaria"
        ],
        [
          "42",
          "42 · Consignación bancaria"
        ],
        [
          "48",
          "48 · Tarjeta crédito"
        ],
        [
          "49",
          "49 · Tarjeta débito"
        ],
        [
          "20",
          "20 · Cheque"
        ],
        [
          "1",
          "1 · Instrumento no definido"
        ]
      ],
      "IVAOPC": [
        [
          "NO",
          "No responsable de IVA"
        ],
        [
          "SI",
          "Responsable de IVA"
        ]
      ],
      "NIVELES": [
        [
          "1",
          "Nivel 1 · menor IBC"
        ],
        [
          "2",
          "Nivel 2 · IBC intermedio"
        ],
        [
          "3",
          "Nivel 3 · mayor IBC"
        ]
      ]
    },
    "mapas": {
      "RECAUDO_TU": {
        "13": "copago",
        "_doc": "Tabla de decisión: tipo de usuario del paciente → figura de recaudo. ⚠️ POR VALIDAR / EN CONFLICTO (revisado 2026-07-20, Regla §3.4). (1) CONTRADICE la nota verificada [[Cuota moderadora y copago (recaudo del usuario)]], que dice que el concepto se fija POR CONTRATO, no por tipo de usuario. (2) Frente al Acuerdo 260: la cuota moderadora es SOLO del régimen contributivo (DT1 RVC035), así que 04 Subsidiado→copago es correcto; pero asignar UNA sola figura por tipo de usuario simplifica de más — los beneficiarios del contributivo pagan cuota Y copago según el servicio, y las finalidades P y M / materno-perinatal están exentas (RVC084). Es una DECISIÓN de modelado del usuario, PENDIENTE de resolver. Los tipos no listados ⇒ 'no' (no aplica).",
        "01": "cuota",
        "02": "cuota",
        "03": "cuota",
        "06": "cuota",
        "04": "copago",
        "07": "copago"
      },
      "RECAUDO_NOMBRE": {
        "cuota": "Cuota moderadora",
        "copago": "Copago",
        "no": "No aplica"
      }
    },
    "reglas": [
      {
        "id": "ORD.contrato",
        "scope": "orden",
        "severidad": "rechazo",
        "when": {
          "empty": "orden.contId"
        },
        "message": "Selecciona el contrato",
        "ref": "Una orden se factura contra un solo contrato (supuesto pregunta #12). por-verificar vs DT1."
      },
      {
        "id": "ORD.pacIdentidad",
        "scope": "orden",
        "severidad": "rechazo",
        "when": {
          "or": [
            {
              "empty": "pac.tipo"
            },
            {
              "empty": "pac.num"
            },
            {
              "empty": "pac.nom"
            },
            {
              "empty": "pac.fnac"
            }
          ]
        },
        "message": "Completa identidad del paciente (tipo, número, nombre, fecha nac.)",
        "ref": "Obligatoriedad de datos del usuario (RIPS)."
      },
      {
        "id": "ORD.pacMunicipio",
        "scope": "orden",
        "severidad": "rechazo",
        "when": {
          "empty": "pac.mun.c"
        },
        "message": "Municipio de residencia del paciente",
        "ref": "codMunicipioResidencia (catálogo DANE)."
      },
      {
        "id": "ORD.pacTipoUsuario",
        "scope": "orden",
        "severidad": "rechazo",
        "when": {
          "and": [
            {
              "nonempty": "cv.tipoUsuarios"
            },
            {
              "empty": "pac.tipoUsuario"
            }
          ]
        },
        "message": "Tipo de usuario del paciente",
        "ref": "tipoUsuario del RIPS; del conjunto que declara el convenio. Además, determina el recaudo (RECAUDO_TU)."
      },
      {
        "id": "ORD.autorizacion",
        "scope": "orden",
        "severidad": "rechazo",
        "when": {
          "and": [
            {
              "truthy": "cv.reqAut"
            },
            {
              "empty": "orden.aut"
            }
          ]
        },
        "message": "Código de autorización (lo exige el convenio)",
        "ref": "Campo condicional: requerido solo si el convenio exige autorización previa. Cruce Orden↔Convenio."
      },
      {
        "id": "ORD.nivel",
        "scope": "orden",
        "severidad": "rechazo",
        "when": {
          "and": [
            {
              "truthy": "cont"
            },
            {
              "mapIn": {
                "map": "RECAUDO_TU",
                "key": "pac.tipoUsuario",
                "in": [
                  "copago",
                  "cuota"
                ]
              }
            },
            {
              "empty": "orden.nivel"
            }
          ]
        },
        "message": "Selecciona el nivel de contribución del paciente",
        "ref": "El nivel se exige solo si el TIPO DE USUARIO del paciente genera recaudo (copago o cuota) según RECAUDO_TU. Base del cálculo. por-verificar (Acuerdo 260)."
      },
      {
        "id": "ORD.estudios",
        "scope": "orden",
        "severidad": "rechazo",
        "when": {
          "emptyArray": "orden.estudios"
        },
        "message": "Agrega al menos un estudio",
        "ref": "Una orden facturable requiere ≥1 servicio."
      },
      {
        "id": "ORD.estudioDx",
        "scope": "orden",
        "severidad": "rechazo",
        "forEach": "orden.estudios",
        "as": "e",
        "when": {
          "empty": "e.dx.c"
        },
        "message": "Estudio ${e.c}: falta diagnóstico (CIE-10)",
        "ref": "codDiagnosticoPrincipal por servicio (CIE-10)."
      },
      {
        "id": "ORD.insumoCantidad",
        "scope": "orden",
        "severidad": "rechazo",
        "forEach": "orden.insumos",
        "as": "e",
        "when": {
          "or": [
            {
              "empty": "e.cantidad"
            },
            {
              "lte": [
                "e.cantidad",
                0
              ]
            }
          ]
        },
        "message": "Insumo ${e.c}: cantidad inválida",
        "ref": "Cantidad de insumo > 0."
      },
      {
        "id": "CONV.nombreNit",
        "scope": "convenio",
        "severidad": "bloqueo-guardado",
        "when": {
          "or": [
            {
              "empty": "nombre"
            },
            {
              "empty": "nid"
            }
          ]
        },
        "message": "El convenio necesita nombre y NIT.",
        "ref": "Identificación mínima del pagador."
      },
      {
        "id": "CONV.tiposUsuario",
        "scope": "convenio",
        "severidad": "bloqueo-guardado",
        "when": {
          "emptyArray": "tipoUsuarios"
        },
        "message": "Selecciona al menos un tipo de usuario que atiende el convenio.",
        "ref": "El convenio declara el CONJUNTO de tipos de usuario que atiende."
      },
      {
        "id": "CONT.nombre",
        "scope": "contrato",
        "severidad": "bloqueo-guardado",
        "when": {
          "emptyTrim": "nombre"
        },
        "message": "El contrato necesita un nombre.",
        "ref": "Identificación del contrato."
      },
      {
        "id": "CONT.convenio",
        "scope": "contrato",
        "severidad": "bloqueo-guardado",
        "when": {
          "empty": "conv"
        },
        "message": "Selecciona el convenio.",
        "ref": "Todo contrato cuelga de un convenio."
      },
      {
        "id": "CONT.tarifa",
        "scope": "contrato",
        "severidad": "bloqueo-guardado",
        "when": {
          "emptyArray": "tarifa"
        },
        "message": "Agrega al menos un estudio a la tarifa.",
        "ref": "La tarifa (precio) vive en el contrato; requiere ≥1 estudio."
      },
      {
        "id": "CONT.vigencia",
        "scope": "contrato",
        "severidad": "bloqueo-guardado",
        "when": {
          "and": [
            {
              "truthy": "desde"
            },
            {
              "truthy": "hasta"
            },
            {
              "gt": [
                "desde",
                {
                  "$": "hasta"
                }
              ]
            }
          ]
        },
        "message": "Vigencia inválida.",
        "ref": "desde <= hasta."
      },
      {
        "id": "CONT.copagoRango",
        "scope": "contrato",
        "severidad": "bloqueo-guardado",
        "when": {
          "copRango": [
            "copN1",
            "copN2",
            "copN3"
          ]
        },
        "message": "El copago es un porcentaje entre 0 y 100.",
        "ref": "Copago (opcional) por nivel: si se digita, cada valor 0–100. Cuota moderadora se guarda tal cual (valor fijo). Ref. Acuerdo 260."
      }
    ],
    "visibilidad": [
      {
        "field": "orden.pac.tipoUsuario",
        "descripcion": "Select de tipo de usuario del paciente. Solo existe si el convenio declara tipos; sus opciones son ese conjunto. Además, su valor determina el recaudo (RECAUDO_TU).",
        "visibleWhen": {
          "nonempty": "cv.tipoUsuarios"
        },
        "requiredWhen": {
          "nonempty": "cv.tipoUsuarios"
        },
        "opcionesDe": {
          "enum": "TIPO_USUARIO",
          "filtradoPor": "cv.tipoUsuarios"
        }
      },
      {
        "field": "orden.aut",
        "descripcion": "Código de autorización. Solo existe si el convenio exige autorización previa; si no, se muestra 'No la exige el convenio' (solo lectura).",
        "visibleWhen": {
          "truthy": "cv.reqAut"
        },
        "requiredWhen": {
          "truthy": "cv.reqAut"
        }
      },
      {
        "field": "orden.nivel",
        "descripcion": "Nivel de contribución del paciente. Solo existe si el TIPO DE USUARIO del paciente genera recaudo (copago o cuota) según RECAUDO_TU.",
        "visibleWhen": {
          "mapIn": {
            "map": "RECAUDO_TU",
            "key": "pac.tipoUsuario",
            "in": [
              "copago",
              "cuota"
            ]
          }
        },
        "requiredWhen": {
          "mapIn": {
            "map": "RECAUDO_TU",
            "key": "pac.tipoUsuario",
            "in": [
              "copago",
              "cuota"
            ]
          }
        }
      },
      {
        "field": "contrato.recaudoFields",
        "descripcion": "El contrato configura AMBAS figuras (copago: 3 % + tope · cuota: 3 valores fijos), todas opcionales. En la orden se aplica la que determine el tipo de usuario (RECAUDO_TU). Forma canónica en contrato.schema.json.",
        "campos": {
          "copago": [
            "copN1(%)",
            "copN2(%)",
            "copN3(%)",
            "copTope"
          ],
          "cuota": [
            "cuoN1($)",
            "cuoN2($)",
            "cuoN3($)"
          ]
        }
      }
    ]
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = RIS_MODELO;
  if (typeof window !== 'undefined') window.RIS_MODELO = RIS_MODELO;
})(this);

---
tipo: sintesis
categoria: arquitectura
titulo: "Inventario de cruces (RVC/RVG) — cobertura del validador"
estado: en-progreso
es_fuente_de_verdad: false
fuente_de_verdad: "[[DT1 v002]] · SISPRO (tablas vivas)"
fecha: 2026-07-17
areas: [validacion, modelo-datos, normativo]
etiquetas: [rips, rvc, rvg, validacion, cruces]
---

# Inventario de cruces (RVC/RVG) — cobertura del validador

> [!abstract] Qué es esto
> Auditoría **exhaustiva** de todas las reglas de validación del **[[DT1 v002]]** (97 `RVC` por campo + `RVG` generales + `CIN006`) para responder: **¿qué cruces existen y cuáles ya valida la app `generador-rips`?** Complementa [[Estrategia de validación y prevención de errores del RIPS]]. Fuente: DT1 v002 (págs. 108-129), leído verbatim. Regla [[Reglas#1.6|1.6]]: los **valores** se confirman contra las tablas vivas de SISPRO.

## 🧭 Resumen ejecutivo
**Sí hay cruces adicionales** a los ya implementados. De ~118 reglas:

| Estado | Cuenta aprox. | Qué significa |
|---|---|---|
| ✅ **Implementado** | ~40+ | El motor ya lo valida en vivo (**Batch B1-B9**, hecho 2026-07-17). |
| ⏳ **Implementable ya (GAP)** | ~pocos | Falta: **RVC050/066** (requieren campos nuevos en el modelo), **B10** (nicho: RVC053/062/064). |
| 📚 **Requiere catálogo SISPRO** | ~28 | CUPS / CIE / CUM-IUM / MIPRES / REPS / UNIRS (tarea #7). Hoy se avisa como "verificar contra catálogo". |
| 🌐 **Requiere FEV/XML o sistema nacional** | ~15 | Cuadre con la factura, RETHUS, RUAF-ND, régimen/cobertura. Fuera del alcance de un validador de RIPS aislado; se listan como reglas externas. |

**Conclusión:** el validador cubre bien el núcleo, pero faltan ~30 cruces que **sí podemos implementar sin dependencias**. El resto está correctamente delimitado como externo/catálogo.

---

## ✅ A · Cruces ya implementados
| RVC/RVG | Cruce | Regla en el motor |
|---|---|---|
| RVC006 | fechaNacimiento ≤ fecha de validación | `FECHA` |
| RVC007 | edad ↔ tipoDocumento (tolerancia 1 año − 1 día) | `DOC-EDAD` |
| RVC008 | datos de RN ⇒ usuario (madre) 9-60 años | `RN-EDAD` |
| RVC013/038/043/045 | fechas de servicio/ingreso/egreso/nacimiento no futuras | `FECHA` (parcial) |
| RVC039 | fecha ingreso ≤ fecha egreso | `validarFechasEgreso` |
| RVC042 | condición egreso "Paciente muerto" ⇒ dx causa de muerte | `MUERTE` |
| RVC060/061 | valorPagoModerador coherente con el concepto | `RECAUDO` (parcial) |
| RVC095 | registroSIRAS obligatorio si tipoUsuario = 10 (SOAT) | `SIRAS` |
| — | código CIE-11 ↔ nombre CIE-11 (van juntos) | `CIE10`/`CIE11` |
| — | aplicabilidad finalidad/vía/causa/condición por tipo de servicio | `APLIC` |
| RVG12 | usuarios duplicados (mismo documento) | `RVG12` |
| RVG13 | medicamentos duplicados (mismo código + fecha) | `RVG13` |
| RVG05 | **tamaño (longitud) por campo** (mapa DT1 v002) | `RVG05` ✱ recién hecho |

---

## ⏳ B · Cruces implementables YA (GAP — sin dependencias)
Lógica pura sobre el propio JSON; ninguno requiere catálogo ni FEV.

> [!success] B1-B4 implementados (2026-07-17)
> En `rips-validaciones.ts` con helpers reutilizables (`validarDxUnicos`, `familiaCIE10`/`validarFamiliaDx`, `validarFechaVsNacimiento`). **Verificado:** los 7 ejemplos oficiales siguen en 0 rechazos / 0 notificaciones; prueba negativa dispara cada RVC. Nota de alcance: los cruces de familia CIE-10 (RVC031-033) se aplican solo a diagnósticos de **desenlace** (egreso, complicación, causa de muerte) para no marcar como error un Z legítimo (Z38 recién nacido, Z30 anticoncepción) ni síntomas de ingreso.

### ✅ B1 · Unicidad de diagnósticos (rechazo) — IMPLEMENTADO
| RVC | Cruce |
|---|---|
| RVC086 | dx relacionado ≠ dx principal (C11-13, P14, M06) |
| RVC087 | dx relacionado ≠ otro dx relacionado (C11-13) |
| RVC088 | dx relacionado de egreso ≠ dx principal de egreso (R/H) |
| RVC089 | dx relacionado de egreso ≠ otro dx relacionado de egreso (R/H) |

### ✅ B2 · Coherencia de fechas contra nacimiento/estancia — IMPLEMENTADO
| RVC | Cruce | Nivel |
|---|---|---|
| RVC079 | fecha de servicio ≥ fechaNacimiento del usuario | rechazo |
| RVC080 | fecha de egreso ≥ fechaNacimiento del usuario | rechazo |
| RVC081 | fecha de ingreso ≥ fechaNacimiento del usuario | rechazo |
| RVC046 | fecha egreso RN ≥ fecha nacimiento RN | rechazo |
| RVC040 | urgencias: estancia (ingreso→egreso) ≤ 48 h | notif |
| RVC041 | hospitalización: estancia < 6 h | notif |

### ✅ B3 · Rangos clínicos de recién nacido — IMPLEMENTADO
| RVC | Cruce | Nivel |
|---|---|---|
| RVC057 | edad gestacional 20-46 semanas | rechazo |
| RVC058 | peso RN 500-5000 g | rechazo |
| RVC097 | nº de consultas de finalidad "cuidado prenatal" ≤ 15 | notif |

### ✅ B4 · Familias CIE-10 por rango (prefijo del código) — IMPLEMENTADO
| RVC | Cruce | Nivel |
|---|---|---|
| RVC031 | dx principal/complicación/egreso/muerte **debería** ser A00-Q99 o S00-T98 | notif |
| RVC032 | dx principal/compl./egreso/muerte **no** puede ser R00-R99 (síntomas/signos) | notif |
| RVC033 | dx **no debería** ser Z00-Z99 (factores que influyen en salud) | notif |
| RVC085 | finalidad "Valoración integral P y M" ⇒ dx principal **solo** Z00-Z99 | notif |

### ✅ B5 · Pagos moderadores / conceptos — IMPLEMENTADO (RVC084/092/060)
| RVC | Cruce | Nivel |
|---|---|---|
| RVC092 | concepto "Anticipos" **no** debe usarse en RIPS | notif |
| RVC084 | finalidades de P y M/materno-perinatal ⇒ "No aplica pago moderador" | rechazo |
| RVC060/061 | reforzar: tipo pago mod ⇒ valor ≥ 1 / no aplica ⇒ 0 | rechazo |

### ✅ B6 · Coherencia sexo / finalidad — IMPLEMENTADO (RVC009/010)
| RVC | Cruce | Nivel |
|---|---|---|
| RVC009 | datos de RN ⇒ usuario (madre) sexo Femenino | notif |
| RVC010 | finalidad "IVE" ⇒ usuario sexo Femenino | notif |

### ⚠️ B7 · Campos condicionales (obligatorio-si) — PARCIAL (RVC047 ✓; RVC050/066 requieren campos nuevos en el modelo: "quién ordena" y "descripción del dispositivo")
| RVC | Cruce | Nivel |
|---|---|---|
| RVC047 | doc. de la madre (RN sin documento) = documento del usuario | rechazo |
| RVC050 | "Dispositivos médicos/insumos" y "Servicios complementarios" ⇒ registrar quién ordena (S09/S10) | rechazo |
| RVC066 | tipoOS "01 Dispositivos médicos e insumos" ⇒ descripción obligatoria (S07) | rechazo |

### ✅ B8 · Aritmética y conteos — IMPLEMENTADO (RVC094/018)
| RVC | Cruce | Nivel |
|---|---|---|
| RVC094 | vrServicio (M19) = cantidadMedicamento (M14) × vrUnitMedicamento (M18) | notif |
| RVC018 | mismo CUPS no repetido para el mismo paciente y el mismo día | notif |

### ✅ B9 · Finalidad ↔ causa (materno-perinatal) — IMPLEMENTADO (RVC052/067-078; la causa "42 materno perinatal" ya estaba en la tabla viva CAUSA_MOTIVO)
| RVC | Cruce | Nivel |
|---|---|---|
| RVC052, RVC067-078 | finalidades (IVE, prenatal, parto, preconcepcional, seguimiento RN, P y M…) ⇒ causa que motiva la atención debe ser de "Atención de población materno perinatal" / P y M | notif |

> Requiere un mapa **finalidad → causas permitidas** (derivable del texto de estas RVC + tabla viva de SISPRO). Es lógica local una vez armado el mapa.

### B10 · Estados de egreso / muerte
| RVC | Cruce | Nivel |
|---|---|---|
| RVC053 | "Paciente muerto" ⇒ no informar servicios con fecha > 24 h tras el fallecimiento | rechazo |
| RVC062 | "Paciente derivado a otro servicio" ⇒ deben existir servicios prestados | rechazo |
| RVC064 | preparación magistral de cannabis ⇒ código DCI (02887/50840/50941) | rechazo |

---

## 📚 C · Cruces que requieren catálogo SISPRO (tarea #7)
Hoy se avisa con la regla agregada `RVC · catálogos`. Para validarlos hay que **cargar** el catálogo respectivo (típicamente typeahead + validación).

| Catálogo | RVC que lo usan |
|---|---|
| **CUPS** (`CUPSRips`) | RVC015, 016, 019, 020, 021, 022, 023, 024, 026, 027, 059, 082, 083, 090, 096 + RVG14 |
| **CIE** (sexo/edad/CUPS) | RVC028, 029, 030 |
| **CUM / IUM** | RVC063 |
| **UNIRS** | RVC055 |
| **MIPRES** | RVC025, 048, 049 |
| **REPS** (IPSCodHabilitación / IPSnoREPS / EntidadesnoREPS) | RVC002, 011, 012 |

> El **traslado ↔ CUPS** que dejamos parqueado es **RVC024** (S06): el código de traslado/transporte/estancia debe ser un CUPS válido. Vive aquí.

---

## 🌐 D · Cruces que requieren FEV/XML o sistema nacional (externos)
No se pueden resolver desde un RIPS aislado; se listan como reglas externas para que el usuario las verifique en el flujo completo.

| RVC/RVG | Cruce | Depende de |
|---|---|---|
| RVC001, RVC004 | NIT y nº de factura del RIPS = los de la FEV | FEV/XML |
| RVC005 | tipoUsuario ↔ cobertura/plan de beneficios | FEV/XML |
| RVC014, RVC044 | fecha servicio/egreso dentro del periodo de facturación | FEV (periodo) |
| RVC017 | CUPS ↔ cobertura/plan | FEV + CUPS |
| RVC034 | valor > 0 si modalidad "Pago por evento" | modalidad de pago (FEV) |
| RVC035, RVC037 | cuota moderadora solo contributivo; subsidiado sin planes voluntarios | régimen (FEV) |
| RVC036 | valor pago mod. FEV = suma de detalles en RIPS | FEV |
| RVC091 | RIPS sin FEV / EOSD ⇒ reglas de valor | tipo de prestador |
| RVC098 | fecha servicio ≤ fallecimiento + 48 h | RUAF-ND |
| RVG02/08/09/19 | cuadres varios con la FEV; NIT pagador = PSS/PTS | FEV |
| RVG10 | un solo facturador por RIPS/factura | FEV |
| RVG11 | profesionales en RETHUS / inscritos en MIPRES | RETHUS/MIPRES |
| CIN006 | cobertura/plan ↔ conceptoRecaudo | FEV |

---

## 🔧 Método (Regla 3.6)
- Fuente: `DT1-v002-doc-tec1-...txt`, sección "REGLAS DE VALIDACIÓN" (RVG) y "VALIDACIONES POR CAMPO" (RVC001-098; **RVC093 no existe** en el documento).
- "Implementado" = verificado contra las reglas que hoy emite `rips-validaciones.ts`.
- Niveles (rechazo/notificación) tomados de la columna "Validación Y" del DT1 (R/N).
- Los **valores/enled** de cada cruce (p. ej. qué finalidad es "IVE", qué causas son "materno perinatal") se confirman contra la **tabla viva de SISPRO** antes de codificarlos ([[Reglas#1.6|Regla 1.6]]).

## 🔗 Relacionado
- [[Estrategia de validación y prevención de errores del RIPS]]
- [[Tablas de referencia vigentes (SISPRO) — enums del RIPS]]
- [[Preparación del cruce — DT1 v002 (cambios, erratas, tablas)]]
- [[Objetivo]] · [[Reglas]] · [[Preguntas abiertas]]

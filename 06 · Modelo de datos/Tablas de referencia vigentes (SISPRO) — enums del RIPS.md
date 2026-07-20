---
tipo: referencia
area: modelo-datos
estado: vigente
fecha_captura: 2026-07-16
origen: "SISPRO · Consulta de referencias básicas (tablas vivas)"
etiquetas: [rips, tablas-referencia, enums, cruce]
---

# Tablas de referencia vigentes (SISPRO) — enums del RIPS

> [!abstract] Fuente de la verdad para los VALORES de los campos
> Capturadas de la **Consulta de referencias básicas** de SISPRO el 2026-07-16 (tablas vivas). Son la autoridad para los **enums** de cada campo del RIPS. Cada tabla trae su **`Fecha_Actualizacion`** — algunas están actualizadas 2024/2025 (reflejan cambios post-2275), otras siguen en 2022. Ver también [[Preparación del cruce — DT1 v002 (cambios, erratas, tablas)]].
> **Banderas de aplicabilidad:** varias tablas indican para qué tipo de servicio aplica cada código: **C**=Consultas · **P**=Procedimientos · **U**=Urgencias · **H**=Hospitalización · **RN**=ReciénNacidos · **M**=Medicamentos · **OS**=OtrosServicios (SI/NO/NA en la fuente).

## Índice de tablas capturadas
| Tabla (código SISPRO) | # | Actualizada | Campo(s) RIPS que gobierna |
| --- | --- | --- | --- |
| RIPSTipoUsuarioVersion2 | 13 | 2024-09 | `tipoUsuario` |
| RIPSCausaExternaVersion2 | 29 | 2024-12 | `causaMotivoAtencion` (ex-`causaExterna`) |
| RIPSFinalidadConsultaVersion2 | 34 | 2024-08 | `finalidadTecnologiaSalud` |
| RIPSTipoDiagnosticoPrincipalVersion2 | 3 | 2022 | `tipoDiagnosticoPrincipal` |
| ViaIngresoUsuario | 14 | 2024-08 | `viaIngresoServicioSalud` |
| ModalidadAtencion | 8 | 2022 | `modalidadGrupoServicioTecSal` |
| GrupoServicios | 5 | 2022 | `grupoServicios` |
| CondicionyDestinoUsuarioEgreso | 8 | 2024-09 | `condicionDestinoUsuarioEgreso` (urg/hosp/RN) |
| conceptoRecaudo | 5 | 2025-05 | `conceptoRecaudo` |
| TipoPagoModerador | 4 | 2023 | (pago moderador) |
| TipoPagoCompartido | 5 | 2022 | (pagos compartidos) |
| TipoNota | 4 | 2025-03 | `tipoNota` |
| TipoIDPISIS | 16 | 2021-22 | `tipoDocumentoIdentificacion` (usuario/profesional) |
| Sexo | 3 | 2025 | `codSexo` (⚠️ ver nota) |
| ZonaVersion2 | 2 | 2022 | `codZonaTerritorialResidencia` |
| LstSiNo | 2 | 2021 | `incapacidad` |
| TipoMedicamentoPOSVersion2 | 5 | 2023 | `tipoMedicamento` |
| TipoOtrosServicios | 6 | 2025-11 | `tipoServicio` (otros servicios) |
| ModalidadContratoyPago | 12 | 2022 | modalidad de contrato/pago |
| CoberturaPlanBeneficios | 15 | 2022 | cobertura (⚠️ lado XML; ver nota) |

> [!warning] Notas críticas (Regla 3.4)
> - **`codSexo`:** la tabla `Sexo` tiene código **H/I/M**, pero en el RIPS se reporta el valor de **Extra_III = `M` (masculino) · `F` (femenino) · `I` (indeterminado)** — NO H/M. En **recién nacidos** se usa otra convención: `01` hombre · `02` mujer · `03` indeterminado (DT1).
> - **`incapacidad`:** se reporta **`SI` / `NO`** (código `LstSiNo`), como en el JSON de ejemplo (`"incapacidad":"NO"`).
> - **Cobertura 16/17:** la tabla viva `CoberturaPlanBeneficios` sigue en **01–15 (2022, 01 activo)** — **no** trae los códigos 16/17 que menciona el video; esos son del **lado XML/FEV-salud** (Anexo Técnico 2 / `salud_cobertura`). El RIPS JSON no lleva cobertura a nivel de servicio. **Verificar 16/17 en DT2** antes de usarlos.

---

## RIPSTipoUsuarioVersion2 — `tipoUsuario` (13 · 2024-09)
`01` Contributivo cotizante · `02` Contributivo beneficiario · `03` Contributivo adicional · `04` Subsidiado · `05` No afiliado · `06` Especial o Excepción cotizante · `07` Especial o Excepción beneficiario · `08` Personas privadas de la libertad a cargo del Fondo Nacional de Salud · `09` Tomador/Amparado ARL · `10` Tomador/Amparado SOAT · `11` Tomador/Amparado Planes voluntarios de salud · `12` Particular · `13` Especial o Excepción no cotizante Ley 352 de 1997

## RIPSCausaExternaVersion2 — `causaMotivoAtencion` (29 · 2024-12) · aplica C/U/H
`21` Accidente de trabajo · `22` Accidente en el hogar · `23` Accidente de tránsito origen común · `24` Accidente de tránsito origen laboral · `25` Accidente entorno educativo · `26` Otro tipo de accidente · `27` Evento catastrófico origen natural · `28` Lesión por agresión · `29` Lesión autoinfligida · `30` Sospecha de violencia física · `31` Sospecha de violencia psicológica · `32` Sospecha de violencia sexual · `33` Sospecha de negligencia y abandono · `34` IVE peligro salud/vida mujer · `35` IVE malformación congénita incompatible con la vida · `36` IVE por violencia sexual/incesto/inseminación no consentida · `37` Evento adverso en salud · `38` Enfermedad general · `39` Enfermedad laboral · `40` Promoción y mantenimiento de la salud – intervenciones individuales (solo C) · `41` Intervención colectiva (solo C) · `42` Atención de población materno perinatal · `43` Riesgo ambiental · `44` Otros eventos catastróficos · `45` Accidente de mina antipersonal MAP · `46` Accidente de artefacto explosivo improvisado AEI · `47` Accidente de munición sin explotar MUSE · `48` Otra víctima de conflicto armado colombiano · `49` IVE por decisión de la persona gestante hasta la semana 24

## RIPSFinalidadConsultaVersion2 — `finalidadTecnologiaSalud` (34 · 2024-08) · aplica C/P
`11` Valoración integral PyM · `12` Detección temprana enfermedad general · `13` Detección temprana enfermedad laboral · `14` Protección específica (solo P) · `15` Diagnóstico · `16` Tratamiento · `17` Rehabilitación · `18` Paliación · `19` Planificación familiar y anticoncepción · `20` Promoción y apoyo a la lactancia materna · `21` Atención básica de orientación familiar (solo C) · `22` Cuidado preconcepcional · `23` Cuidado prenatal · `24` Interrupción voluntaria del embarazo · `25` Atención del parto y puerperio · `26` Cuidado del recién nacido (solo P) · `27` Seguimiento del recién nacido · `28`–`42` (promoción/prevención, solo P) · `43` Modificación de la estética corporal fines estéticos · `44` Otra

## RIPSTipoDiagnosticoPrincipalVersion2 — `tipoDiagnosticoPrincipal` (3 · 2022)
`01` Impresión diagnóstica · `02` Confirmado nuevo · `03` Confirmado repetido

## ViaIngresoUsuario — `viaIngresoServicioSalud` (14 · 2024-08) · aplica P/U/H (Consultas y RN = NA)
`01` Demanda espontánea · `02` Derivado de consulta externa · `03` Derivado de urgencias · `04` Derivado de hospitalización · `05` Derivado de sala de cirugía · `06` Derivado de sala de partos · `07` Recién nacido en la institución · `08` Recién nacido en otra institución · `09` Derivado o referido de hospitalización domiciliaria · `10` Derivado de atención domiciliaria · `11` Derivado de telemedicina · `12` Derivado de jornada de salud · `13` Referido de otra institución · `14` Contrareferido de otra institución

## ModalidadAtencion — `modalidadGrupoServicioTecSal` (8 · 2022)
`01` Intramural · `02` Extramural unidad móvil · `03` Extramural domiciliaria · `04` Extramural jornada de salud · `06` Telemedicina interactiva · `07` Telemedicina no interactiva · `08` Telemedicina telexperticia · `09` Telemedicina telemonitoreo *(no existe 05)*

## GrupoServicios — `grupoServicios` (5 · 2022)
`01` Consulta externa · `02` Apoyo diagnóstico y complementación terapéutica · `03` Internación · `04` Quirúrgico · `05` Atención inmediata *(Imagenología → 02)*

## CondicionyDestinoUsuarioEgreso — `condicionDestinoUsuarioEgreso` (8 · 2024-09) · aplica U/H/RN
`01` Paciente con destino a su domicilio · `02` Paciente muerto · `03` Paciente derivado a otro servicio · `04` Referido a otra institución · `05` Contrareferido a otra institución · `06` Derivado o referido a hospitalización domiciliaria · `07` Derivado a servicio social · `08` Paciente continúa en el servicio (corte facturación)

## conceptoRecaudo — `conceptoRecaudo` (5 · 2025-05)
`01` Copago · `02` Cuota moderadora · `03` Pagos compartidos en planes voluntarios de salud · `04` Anticipo · `05` No aplica

## TipoPagoModerador (4 · 2023) · aplica C/P/M/OS
`01` Cuota moderadora · `02` Copago (no aplica en Consultas) · `03` Bono o vale de plan voluntario · `04` No aplica pago moderador

## TipoPagoCompartido (5 · 2022)
`01` Cuota moderadora · `02` Copago · `03` Cuota de recuperación · `04` Bono o vale de plan voluntario · `05` No aplica pago compartido

## TipoNota — `tipoNota` (4 · 2025-03)
`NA` Nota ajuste RIPS · `NC` Nota crédito · `ND` Nota débito · `RS` RIPS sin factura

## TipoIDPISIS — `tipoDocumentoIdentificacion` (16 · 2021-22)
`AS` Adulto sin identificación · `CC` Cédula de ciudadanía · `CD` Carné diplomático · `CE` Cédula de extranjería · `CN` Certificado de nacido vivo · `DE` Documento extranjero · `MS` Menor sin identificación · `NI` NIT · `NV` Certificado nacido vivo · `PA` Pasaporte · `PE` Permiso Especial de Permanencia · `PT` Permiso por Protección Temporal · `RC` Registro civil · `SC` Salvoconducto · `SI` Sin identificación · `TI` Tarjeta de identidad *(la fuente marca aplicabilidad por servicio y para usuario vs. profesional)*

## Sexo — `codSexo` (3 · 2025) ⚠️ reportar Extra_III
Código `H` (Extra_III=`M`, Masculino) · `M` (Extra_III=`F`, Femenino) · `I` (Extra_III=`I`, Indeterminado/Intersexual). **En el RIPS se reporta M/F/I** (Extra_III), no H/M.

## ZonaVersion2 — `codZonaTerritorialResidencia` (2 · 2022)
`01` Rural · `02` Urbano

## LstSiNo — `incapacidad` (2 · 2021)
`SI` (=1) · `NO` (=2). En el RIPS se reporta la cadena **`SI`/`NO`**.

## TipoMedicamentoPOSVersion2 — `tipoMedicamento` (5 · 2023)
`01` Medicamento con registro sanitario · `02` Vital no disponible (INVIMA) · `03` Preparación magistral · `04` Uso no incluido en registro sanitario (UNIRS) · `05` Autorización sanitaria de uso de emergencia (ASUE)

## TipoOtrosServicios — `tipoServicio` otros servicios (6 · 2025-11)
`01` Dispositivos médicos e insumos · `02` Traslados · `03` Estancias · `04` Servicios complementarios · `05` Honorarios · `06` Servicios de salud propios para comunidades indígenas *(deshabilitado)*

## ModalidadContratoyPago (12 · 2022)
`01` Paquete/Canasta/Conjunto integral · `02` Grupos relacionados por diagnóstico · `03` Integral por grupo de riesgo · `04` Pago por contacto por especialidad · `05` Pago por escenario de atención · `06` Pago por tipo de servicio · `07` Pago global prospectivo por episodio · `08` PGP por grupo de riesgo · `09` PGP por especialidad · `10` PGP por nivel de complejidad · `11` Capitación · `12` Pago por servicio

## CoberturaPlanBeneficios (15 · 2022) — ⚠️ lado XML; el 01 sigue activo y NO hay 16/17 en la tabla viva
`01` Plan de beneficios en salud financiado con UPC · `02` Presupuesto máximo · `03` Prima EPS no asegurados SOAT · `04` Cobertura Póliza SOAT · `05` Cobertura ARL · `06` Cobertura ADRES · `07` Cobertura salud pública · `08` Cobertura entidad territorial recursos de oferta · `09` Urgencias población migrante · `10` Plan complementario en salud · `11` Plan medicina prepagada · `12` Pólizas en salud · `13` Cobertura Régimen Especial o Excepción · `14` Cobertura Fondo Nacional Salud PPL · `15` Particular

---

## Catálogos masivos NO volcados (referencia externa)
No se copian completos (miles de filas); se consultan por `?Code=` en SISPRO o en su catálogo:
`CIE10`, CIE-11, `CUPSRips`, `CatalogoCUMs`, `IUM`, `DCI`, `UMM`, `UPR`, `FFM` (tecnologías/medicamentos), `Municipio`, `Pais`, `EntidadResponsablePago`, `IPSCodHabilitacion`, `Servicios`.

## Fuente
Consulta: `https://web.sispro.gov.co/WebPublico/Consultas/ConsultarDetalleReferenciaBasica.aspx?Code=<TABLA>`. Ver [[SISPRO — Micrositio FEV-RIPS]].

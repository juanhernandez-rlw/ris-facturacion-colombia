---
tipo: transcripcion
fuente: "[[Facturación RIS - Colombia]]"
origen: "Vault Eden — documento 'Facturación RIS - Colombia' (5 imágenes)"
estado_datos: por-verificar
fecha_captura: 2026-07-16
etiquetas: [rips, modelo-datos, transcripcion]
---

# Facturación RIS - Colombia — RIPS (transcripción)

> [!quote] Transcripción fiel de la fuente
> Texto extraído **literalmente** de las 5 imágenes del documento [[Facturación RIS - Colombia]] (vault Eden). **Aún no está cruzado** contra los documentos técnicos oficiales (DT1/DT2) → estado `por-verificar` (Regla 4). Originales en `_Adjuntos/Facturación RIS - Colombia/`.

> [!warning] Actualización 2026-07-16 · el oficial corrige partes de esta transcripción
> Ya se descargaron los documentos oficiales ([[SISPRO — Micrositio FEV-RIPS]]). El cruce preliminar muestra que la **estructura JSON v002** añade campos no listados aquí (CIE-11, `causaMotivoAtencion`, `codigoVIDA`, `codPaisOrigen`) y que algunos enums difieren del catálogo oficial `.gc` (p. ej. `tipoUsuario`). Prevalece el oficial; el mapa verificado se construirá en el cruce.

**Convenciones (según la fuente):** `Campo` = nombre del campo · `Tipo·Tam.` = tipo (**C** = carácter/texto, **N** = numérico) y tamaño · `Regla` = obligatoriedad · `Qué es` = definición y tabla de referencia/enum · `De dónde sale` = sección/formulario del RIS/app donde se captura (*en proceso de definición; a veces es solo un comentario*).

## Panorama · los 4 insumos que produce el RIS
> El RIS no radica ni factura, pero es la fuente de casi todo el dato. Produce 4 insumos: los 2 primeros son estructuras de datos; los otros 2, campos y documentos anexos.

| # | Insumo | Formato | Destino | Contenido |
| --- | --- | --- | --- | --- |
| 1 | **RIPS** | JSON | MinSalud (validación única) → **CUV** | Detalle clínico-administrativo de la atención |
| 2 | **Factura hacia software contable** | Plano / tablas (import) · ⚠️ *Validar API* | Software de facturación (PSL) → genera la **FEV** → DIAN | Detalle clínico-administrativo de la atención |
| 3 | **Campos FEV-salud hacia software contable** | XML (extensión salud, **UBL**) | MinSalud (validación única) → **CUV** | Detalle clínico-administrativo de la atención |
| 4 | **Soportes de cobro** | Documentos digitales | ERP · Auditoría | *TBD* |

## RIPS · Transacción — relaciona el RIPS con la factura
| Campo | Tipo·Tam. | Regla | Qué es | De dónde sale |
| --- | --- | --- | --- | --- |
| numDocumentoIdObligado | C · 4–12 | Obligatorio | NIT del facturador; debe coincidir con la FEV. RIS: NIT de la IPS. | Definido por backend |
| numFactura | C · s/DIAN | Condicional | Número de la factura; coincide con la FEV. Si es RIPS sin factura, null. RIS: lo asigna el software de facturación. (Lista de facturas) | Consecutivos provistos por la DIAN |
| tipoNota | C · 0–2 | Condicional | Tabla TipoNota: NC crédito · ND débito · NA ajuste RIPS · RS sin factura. null si no aplica. | — |
| numNota | C · 0–20 | Condicional | Número de la nota; coincide con la reportada a la DIAN. null si no aplica. | ✅ *DT1 v002 T04: lo **genera el facturador electrónico**; = nº reportado a la DIAN* |

## RIPS · Usuarios — el paciente
| Campo | Tipo·Tam. | Regla | Qué es | De dónde sale |
| --- | --- | --- | --- | --- |
| tipoDocumentoIdentificacion | C · 2 | Obligatorio | Tabla TipoIdPISIS: CC cédula · TI tarjeta · RC registro civil · CE extranjería · PA pasaporte · CN nacido vivo · AS/MS sin identificar. RIS: registro del paciente. | Creación de la orden / Información del paciente / Documento (Selector) |
| numDocumentoIdentificacion | C · 4–20 | Obligatorio | Número de documento del usuario. | Creación de la orden / Información del paciente / Documento (Input) |
| tipoUsuario | C · 2 | Obligatorio | Tabla RIPSTipoUsuarioVersion2: 01 cotizante · 02 beneficiario · 04 subsidiado · 05 no afiliado · 09 ARL · 10 SOAT (01–10). | Contrato / Régimen del paciente |
| fechaNacimiento | C · 10 | Obligatorio | AAAA-MM-DD. Condiciona el tipo de documento válido según la edad. | Creación de la orden / Información del paciente / Fecha de nacimiento |
| codSexo | C · 1 | Obligatorio | M masculino · F femenino · I indeterminado. Ver columna Extra III de la tabla Sexo. | Creación de la orden / Información del paciente / Sexo |
| codPaisResidencia | C · 3 | Obligatorio | ISO 3166-1; 170 = Colombia. | Creación de la orden / Información del paciente / País |
| codMunicipioResidencia | C · 0–5 | Condicional | Código DANE (tabla Municipio). Obligatorio si país = 170. | Creación de la orden / Información del paciente / Municipio |
| codZonaTerritorialResidencia | C · 0–2 | Condicional | Tabla ZonaVersion2: 01 rural · 02 urbano. Obligatorio si país = 170. | Creación de la orden / Información del paciente / Zona territorial |
| incapacidad | C · 2 | Obligatorio | Tabla LstSiNo: 1 sí · 2 no. | Creación de la orden / Información del paciente / Incapacidad |
| consecutivo | N · 1–7 | Obligatorio | Numera al usuario dentro del arreglo (1, 2, 3…). | — |
| registroSIRAS | C · 0–60 | Condicional | Obligatorio si tipoUsuario = 10 (SOAT); si no, null. | Validar si la institución hace integración con SIRAS |

## RIPS · Procedimientos — el estudio de imagen
| Campo | Tipo·Tam. | Regla | Qué es | De dónde sale |
| --- | --- | --- | --- | --- |
| codPrestador | C · 12 | Obligatorio | Código de habilitación (IPSCodHabilitación). RIS: sede que realiza el estudio. | Definido por backend |
| fechaInicioAtencion | C · 16 | Obligatorio | AAAA-MM-DD HH:MM; dentro del periodo de la factura. RIS: momento de realización. | — |
| numAutorizacion | C · 0–30 | Condicional | Autorización del pagador; null si no requiere. RIS: autorización de la orden. | Creación de orden · Información del estudio e ingreso del paciente · Número de autorización |
| idMIPRES | C · 0/19–25 | Condicional | ID de entrega MIPRES si el estudio se prescribió por ahí; si no, null. | — |
| codProcedimiento | C · 6 | Obligatorio | CUPS del estudio. Se valida con sexo, edad, diagnóstico y cobertura. Tabla CUPSRips. RIS: CUPS del catálogo de estudios. | Creación del contrato |
| viaIngresoServicioSalud | C · 2 | Obligatorio | Tabla ViaIngresoUsuario: 01 demanda espontánea · 02 derivado de consulta externa · 03 de urgencias (01–10). | Información del estudio (se muestra en la ubicación del paciente) |
| modalidadGrupoServicioTecSal | C · 2 | Obligatorio | Tabla ModalidadAtencion: 01 intramural · 02 extramural u. móvil · 06–09 telemedicina. | Backend |
| grupoServicios | C · 2 | Obligatorio | Tabla GrupoServicios: 01 consulta externa · 02 apoyo diagnóstico · 03 internación · 04 quirúrgico · 05 atención inmediata. Imagenología → 02. | Backend |
| codServicio | N · 3–4 | Obligatorio | Servicio habilitado (tabla Servicios, catálogo amplio). RIS: servicio de imagenología. | Backend |
| finalidadTecnologiaSalud | C · 2 | Obligatorio | Tabla RIPSFinalidadConsultaVersion2: 15 diagnóstico · 16 tratamiento · 11 valoración PyM (11–20). Estudio diagnóstico → 15. | Creación del estudio (default) · Creación de la orden (prefilled) |
| tipoDocumentoIdentificacion | C · 2 | Obligatorio | Documento del profesional que ordenó o realizó. Solo CC · CE · CD · PA · SC · PE · DE · PT. RIS: médico solicitante / radiólogo. | Información del médico referente / Documento (Dropdown) |
| numDocumentoIdentificacion | C · 4–20 | Obligatorio | Número del profesional. | Información del médico referente / Documento (Input) |
| codDiagnosticoPrincipal | C · 4 | Obligatorio | CIE-10 (tabla CIE10); se valida con el CUPS, sexo y edad. RIS: diagnóstico de la orden. | Edición de la orden · Reporte |
| codDiagnosticoRelacionado | C · 0–4 | Condicional | CIE-10 secundario; distinto al principal. null si no aplica. | Edición de la orden · Reporte |
| vrServicio | N · 1–15 | Obligatorio | Valor del estudio. Mayor a 0 si es pago por evento; 0 en otras modalidades o RIPS sin factura. RIS: precio del estudio. | Contrato |
| conceptoRecaudo | C · 2 | Obligatorio | Tabla conceptoRecaudo: 01 copago · 02 cuota moderadora · 03 pagos compartidos · 04 anticipo · 05 no aplica. | Contrato (validar si nota débito → aquí va «No aplica») |
| valorPagoModerador | N · 1–10 | Obligatorio | Valor de copago/cuota moderadora; 0 si no aplica. | Contrato |
| numFEVPagoModerador | C · s/DIAN | Condicional | Factura del pago moderador; null si no aplica. | Consecutivos habilitados por la DIAN |
| consecutivo | N · 1–7 | Obligatorio | Numera el registro (1, 2, 3…). | Consecutivo interno |

## Campos FEV-salud (XML · extensión salud UBL)
> ⚠️ En la imagen original, las dos últimas columnas («Qué es» y «De dónde sale») aparecen parcialmente duplicadas; se transcribe lo legible y se marca lo dudoso.

| Campo | Grupo | Regla | Qué es | De dónde sale |
| --- | --- | --- | --- | --- |
| CODIGO_PRESTADOR | UBLExtension | Obligatorio | Código de habilitación REPS (tabla IPSCodHabilitación). RIS: sede prestadora. | Backend |
| MODALIDAD_PAGO | UBLExtension | Obligatorio | Tabla modalidadPago: 01 caso/paquete · 02 global prospectivo · 03 capitación · 04 evento. RIS: contrato con el pagador. | Ingreso del paciente |
| COBERTURA_PLAN_BENEFICIOS | UBLExtension | Obligatorio | Tabla coberturaPlan: 01 UPC · 02 presupuesto máximo · 04 SOAT · 05 ARL · 06 ADRES · 10 plan complementario (01–10). | Contrato |
| NUMERO_CONTRATO | UBLExtension | Condicional | CUCON, según cronograma de implementación. RIS: contrato (en hold). | — |
| NUMERO_POLIZA | UBLExtension | Condicional | — | — |
| FACTURA_SIN_CONTRATO | UBLExtension | Condicional | Tabla facturaSinContrato: 01 urgencias · 02 ADRES/SOAT · 03 tutela/orden judicial (01–07). Hoy genera notificación. | ⚠️ *(celda duplicada en la fuente — por-verificar)* |
| COPAGO | PrepaidPayment | Condicional | Valor total; debe cuadrar con el copago del RIPS. | Contrato |
| CUOTA_MODERADORA | PrepaidPayment | Condicional | Valor total; debe cuadrar con el RIPS. | Contrato |
| PAGOS_COMPARTIDOS | PrepaidPayment | Condicional | — | — |
| ANTICIPO | PrepaidPayment | Condicional | — | — |
| Periodo de facturación | InvoicePeriod | Obligatorio | — | Validar formato |
| Codificación · descripción del ítem | Item | Obligatorio | Código y descripción del bien o servicio. RIS: estudio y su código. | ⚠️ *(celda duplicada en la fuente — por-verificar)* |

## Observaciones y puntos a verificar (Reglas 3.4 / 4)
- **numNota** (Transacción): la columna «De dónde sale» repite el texto de «Qué es» en la fuente → confirmar el origen real.
- **Campos FEV-salud**: columnas «Qué es»/«De dónde sale» parcialmente duplicadas en la imagen → confirmar contra el **DT2**.
- **Soportes de cobro**: contenido marcado *TBD* en la fuente.
- **«Validar API»** (insumo 2) y **CUCON en hold** (NUMERO_CONTRATO) → pendientes señalados por el propio documento.
- Todo lo anterior debe **cruzarse con DT1 (RIPS) y DT2 (FEV-salud)** oficiales antes de pasar a `verificado`.

## Fuente y relacionados
- Ficha de fuente: [[Facturación RIS - Colombia]]
- Originales (imágenes + .md): `_Adjuntos/Facturación RIS - Colombia/`
- Conceptos: [[RIPS — Registro Individual de Prestación de Servicios]] · [[FEV-RIPS — Facturación electrónica en salud]] · [[MUV — Mecanismo Único de Validación]]

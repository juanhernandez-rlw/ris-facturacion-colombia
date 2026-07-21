---
tipo: nota
area: arquitectura
tema: facturacion
estado: en-construccion
fuentes: ["[[Dónde vive cada campo — FEV × RIS]]", "[[Diccionario de construcción de la FEV en salud]]", "[[Cuota moderadora y copago (recaudo del usuario)]]", "[[Insumos (medicamentos y otros servicios)]]", "[[Loggro — API de facturación electrónica]]"]
etiquetas: [arquitectura, flujos, facturacion, ris, desarrollo]
actualizado: 2026-07-20
---

# Mapa de flujos del sistema (para desarrollo)

> [!abstract] Qué es
> Documentación de **todos los flujos** de la app de facturación (RIS · FEV-RIPS), pensada para que el equipo de desarrollo entienda **qué debe construir**. Es el complemento textual de los **diagramas visuales en Figma** → archivo *RIS — Colombia*, página **"Diagramas de flujo · Facturación"** (≈28 flujos en 8 filas: ① Creación · ② Gestión · ③ Correcciones · ④ Config · ⑤ Modalidades · ⑥ Ciclo E2E · ⑦ Transversales · ⑧ Alcance ampliado). Los wireframes de las pantallas están en la página **"Wireframes LF · Facturación"**.
> Estado: `inferido` (propuesta de arquitectura) sobre datos `verificados`; a afinar con el equipo. Los precios y NITs de ejemplo son de demo.

## Convenciones de los diagramas
● inicio/fin (pastilla) · ◆ decisión (rombo) · ▭ paso · ▭ rama alterna / bloqueo (rosa). Arriba, una **cinta macro** encadena las 4 etapas: **① Convenio → ② Contrato → ③ Orden → ④ Factura electrónica**.

## Modelo base (recordatorio)
**Convenio** (maestro del pagador) → **Contrato** (tarifa de estudios+insumos, cobertura/modalidad, vigencia, recaudo por nivel) → **Orden** (paciente + estudios/insumos, hereda del contrato) → **Factura electrónica** (FEV + RIPS → Loggro/DIAN → MUV). Detalle campo-por-campo en [[Dónde vive cada campo — FEV × RIS]].

---

## ① Creación (flujos base)

### 1.1 Creación de convenio
- **Propósito:** dar de alta el pagador y sus reglas. Prerequisito de todo contrato.
- **Pasos:** identificación (nombre · tipo id · NIT · razón social · **tipo de usuario** por defecto) → facturación FEV (forma/medio de pago DIAN · plazo · IVA · retención) → banderas (autorización / MIPRES / SIRAS) → guardar.
- **Validaciones/guardas:** nombre y NIT obligatorios.
- **Integraciones:** EAPB/ADRES (NIT y tipo de pagador), SISPRO (enums), DIAN (forma/medio de pago).

### 1.2 Creación de contrato *(el más ramificado — ver diagrama)*
- **Propósito:** definir la **tarifa** (precio al pagador) y las reglas de recaudo, atados a un convenio.
- **Pasos:** ¿existe convenio? → datos base (nombre · convenio · cobertura · modalidad · vigencia · CUCON) → tarifa de **estudios** (buscar en CUPS + precio, ≥1) → **insumos** (opcional) → **recaudo** → guardar.
- **Variaciones:**
  - **Insumo:** medicamento/contraste → código **CUM/IUM**; dispositivo → **UDI / código interno IPS**.
  - **Recaudo (concepto por contrato):** **Copago** (% por nivel 1/2/3 · **máx 100 %** + tope, Acuerdo 260) · **Cuota moderadora** (valor fijo por nivel) · **No aplica**.
- **Validaciones/guardas:** vigencia `desde ≤ hasta`; ≥1 estudio en tarifa; copago 0–100 %.
- **Integraciones:** CUPS y CUM/IUM (tablas vivas SISPRO); CUCON (SIIFA).

### 1.3 Creación de orden
- **Propósito:** registrar la atención y armar la prefactura.
- **Pasos:** convenio → **¿tiene contratos vigentes?** → contrato (**hereda** pagador/cobertura/modalidad/recaudo) → paciente (identidad · municipio DANE · sexo · fecha nac.) → **autorización** (si el convenio la exige) → **nivel** (si el contrato define recaudo → calcula copago %×tarifa+tope / cuota fija) → estudios (de la tarifa) + **diagnóstico CIE-10** → insumos (opcional) + cantidad → **validación (gate)** → generar (arma **FEV + RIPS**).
- **Variaciones:** autorización sí/no; recaudo sí/no; con/sin insumos.
- **Validaciones/guardas:** identidad completa · municipio · dx por estudio · ≥1 estudio · nivel si aplica · autorización si el convenio la exige. La **fecha de atención NO se digita** aquí: se hereda del **inicio de la atención** del RIS.
- **Nota abierta #12:** una orden = un solo contrato (por validar).

### 1.4 Facturación electrónica y transmisión
- **Propósito:** timbrar y radicar. Delegación parcial en **Loggro** (solo la pierna DIAN).
- **Pasos:** RIS arma FEV (UBL 2.1) + RIPS (JSON) → Loggro/DIAN → **¿CUFE?** → transmitir {FEV+RIPS} al **MUV** → **¿CUV?** → radicar ante el pagador.
- **Variaciones/errores:** rechazo DIAN (sin CUFE) o rechazo MUV (sin CUV) → ver flujo de correcciones.
- **Integraciones:** Loggro (timbrado), MUV (validación/CUV). Ver [[Loggro — API de facturación electrónica]] y preguntas #13–16.

---

## ② Gestión — editar · inactivar · anular · casos alternos

### 2.1 Editar / inactivar convenio
- Editar campos operativos del pagador. **Guarda:** si ya hay FEV emitidas, **no** permitir cambiar NIT/razón social (rompe la FEV histórica). Inactivar solo si **no** tiene contratos vigentes; conserva histórico (no borra). Auditoría en cada cambio.

### 2.2 Editar / inactivar contrato
- Editar tarifa/recaudo/cobertura/modalidad/vigencia. **Guardas:** no borrar/rebajar ítems ya facturados → **versionar tarifa** (los precios nuevos aplican solo a órdenes futuras); vigencia válida y copago ≤100 %. Inactivar/expirar → bloquea nuevas órdenes; las en curso continúan.

### 2.3 Editar / anular orden
- **Antes de facturar:** editable (contrato, paciente, nivel, estudios, insumos) → re-validar → guardar; anulable con motivo + auditoría.
- **Después de facturar (con FEV):** **no** editable → requiere **nota crédito/débito** (2.anular = nota crédito total).

### 2.4 Caso sin contrato *(pregunta #17)*
- Ramas por tipo de caso: **Particular** (cob. 15 · tarifa particular · consumidor final NIT 222222222222) · **SOAT** (cob. 04 · requiere **SIRAS** · tipoUsuario 10) · **Urgencias/migrante** (cob. 09 · sin autorización previa). Registra `facturaSinContrato` (01–07) + soportes; genera FEV+RIPS **sin** NÚMERO_CONTRATO/CUCON.

---

## ③ Correcciones de factura · operación

### 3.1 Rechazo y reproceso (DIAN / MUV)
- Rama por origen: **DIAN** (errores UBL/firma/estructura) · **MUV** (errores RIPS / cruces RVC → validador). Corregir → **reintentar** (mismo consecutivo si no se timbró; nuevo si ya tenía CUFE) con **tope de reintentos** → si se agota, escalar a soporte.

### 3.2 Nota crédito *(RIPS `tipoNota` = NC)*
- Sobre una FEV radicada. Motivos: anulación total · devolución parcial · descuento. Genera NC referenciando el **CUFE** → timbrar → transmitir MUV → ajusta cartera.

### 3.3 Nota débito *(RIPS `tipoNota` = ND)*
- Ajuste al alza / cargo adicional (intereses, ítems no facturados). Genera ND referenciando el CUFE → timbrar → transmitir MUV.

### 3.4 Bandeja de órdenes / facturación
- Punto de entrada operativo. Filtros (convenio · estado · fecha · paciente · N.º factura). Por **estado** entra al flujo que corresponda: **Borrador** → editar/generar · **Generada** → ver/transmitir · **Rechazada** → corregir · **Radicada** → soportes / nota crédito.

---

## ④ Configuración e infraestructura

### 4.1 Configuración IPS + numeración DIAN
- Una vez / renovación anual. Datos IPS (NIT+DV · **REPS** cód. habilitación · RUT · domicilio) → cargar **resolución de numeración DIAN** (prefijo · rango desde–hasta · vigencia · **clave técnica**) → CUCON/SIIFA → **ambiente** (pruebas/habilitación vs producción).

### 4.2 Sincronización de catálogos (SISPRO / DANE)
- Programada/manual. Consulta tablas vivas (CUPS · CIE-10 · CUM/IUM · cobertura · tipos) + municipios DANE → **¿versión nueva?** → descargar + versionar (fecha_actualización · total) → **validar conteo** vs total esperado (si no cuadra, alertar y no publicar) → publicar a typeahead + validación de membresía. Ver [[Captura de catálogos SISPRO]].

### 4.3 Asignación de consecutivo (numeración en runtime)
- En cada factura: toma el siguiente consecutivo del **rango DIAN activo** → **¿vigente y con cupo?** (bloquea si vencido/agotado → cargar nueva resolución) → asigna prefijo+consecutivo → clave técnica → CUFE.

### 4.4 Auditoría y trazabilidad *(transversal)*
- Toda acción (crear/editar/anular/timbrar) registra evento (usuario · fecha · antes/después) en **bitácora inmutable** por documento, enlazada a factura/RIPS/CUFE/CUV. Soporta glosas y conciliación con el pagador.

---

## ⑤ Modalidades de pago ≠ evento *(pregunta #21)*
Cuando el contrato **no** es pago por evento, la factura **no es 1:1 por atención**:
- **Paquete / caso (01):** 1 factura por el **valor del paquete** (canasta); no se suman ítems; el RIPS detalla los servicios.
- **Global prospectivo / PGP (02):** factura el **valor pactado del período** (o por avance) → **conciliar** prestación real vs presupuesto → **nota crédito** (subejecución) / **nota débito** (sobreejecución).
- **Capitación (03):** factura = **población afiliada × valor per cápita** al cierre del período; los RIPS son de **seguimiento** (NO determinan el valor); se registran **novedades de afiliación**.
- Evento (04) = 1 factura por atención (flujo ①).

## ⑥ Ciclo end-to-end

### 6.1 Estados de la orden / factura *(máquina de estados)*
- Ciclo: `borrador → generada → timbrada (CUFE) → transmitida (MUV/CUV) → radicada → conciliada → pagada`. Estados de **excepción**: `rechazada` (DIAN/MUV → corregir → vuelve a *generada*), `glosada` (→ responder → *radicada*/avanza), `anulada` (vía nota crédito). Es el mapa que amarra todos los flujos.

### 6.2 Glosas y conciliación con el pagador
- El pagador objeta → recibir glosa (**causal + valor** por ítem) → responder (**aceptar** / **subsanar** reenviando soporte / **ratificar**) **dentro de términos** → conciliar → saldo definitivo (o segunda instancia).

### 6.3 Radicación de la cuenta + soportes
- Ensamblar **soportes** (orden, autorización, informe, resultados) → **AttachedDocument** (tipos del anexo) → validar completitud según pagador → **radicar** ante EPS/pagador (portal/API) → acuse. Es el paso **posterior al CUV**.

### 6.4 Autorización previa ante el pagador
- Solicitar (paciente · CUPS · dx · soportes) → **aprobada** (número + vigencia → **alimenta la orden**) / **negada o pendiente** (notificar, recurso, no factura).

## ⑦ Transversales

### 7.1 Roles y permisos (RBAC)
- Verificación de permiso por rol en **cada acción**; bloqueo + auditoría del intento. Roles sugeridos: **Admin** (config) · **Facturador** · **Cajero** (recaudo) · **Auditor/Glosas** · **Consulta** (solo lectura).

### 7.2 Admisión e inicio de la atención + recaudo en caja
- Admisión (verificar identidad/convenio/autorización) → **inicio de atención** = **origen de la fecha de atención** → **recaudo en caja** del copago/cuota por nivel (si aplica) + **recibo** → ejecución del estudio → listo para facturar (el recaudo cuadra con el RIPS).

### 7.3 Contingencia DIAN / Loggro
- Si el timbrado en línea **no** está disponible: **numeración de contingencia** → entregar factura sin CUFE en línea → **timbrar en diferido** dentro del plazo → regularizar.

## ⑧ Alcance ampliado *(confirmar alcance)*
- **Agendamiento** de cita → atención (verificar convenio/autorización · agendar · confirmar · no-show → reprogramar).
- **Reportes regulatorios:** **MIPRES** (no-PBS) · **SIRAS** (SOAT) · **FURIPS/FURTRAN** (SOAT), adjuntos al soporte de la cuenta.
- **Facturación masiva/lotes** (por período/convenio) y **anticipos** (campo `ANTICIPO` de la FEV).
- **Reportes:** facturación por convenio/período · estado de glosas/cartera · RIPS por período · producción/operación.

---

## Decisiones de diseño registradas
- **Tipo de usuario (multi) (2026-07-20):** es atributo del **paciente**, no del pagador. El **convenio declara el conjunto** de `tipoUsuario` que atiende (multi-select); el tipo **real se elige por paciente** en la orden, filtrado a ese conjunto (∩ la cobertura del contrato, matriz numeral 8). Implementado en el prototipo (convenio con chips + `p_tipoUsuario` por paciente + validación).
- **Patrón «conjunto por cobertura» (numeral 8):** la matriz `COBERTURA_APLICA` define, por cobertura, **conjuntos** válidos de `{tipoUsuario, modalidadPago, conceptoRecaudo}` — o sea son *conjuntos*, no valores únicos. **Casos análogos por revisar** (mismo patrón): **`conceptoRecaudo`** — copago vs cuota moderadora **depende del `tipoUsuario`** del paciente (Acuerdo 260), hoy es un valor fijo por contrato; **IVA por línea** — depende del servicio/CUPS (salud casi todo excluido; pregunta #19); **multi-sede** — `codPrestador` varía por sede REPS.
- **Fecha de atención (2026-07-20):** **no** se captura en el formulario de orden; se **hereda del inicio de la atención** en el flujo del RIS. Aplicado en el prototipo (quitada del formulario y del gate de validación).
- **Recaudo (actualizado 2026-07-20):** el **concepto** (copago vs cuota moderadora) lo **determina el tipo de usuario del paciente**, no el contrato (Acuerdo 260 · **regla POR VALIDAR** — propuesta: contributivo `01/02/03`→cuota moderadora; subsidiado `04`→copago; ARL/SOAT/particular→no aplica). El **contrato guarda AMBAS tablas** (copago %+tope y cuota fija, por nivel); en la orden se aplica la que corresponda al tipo de usuario + nivel. Copago limitado a **≤100 %**. Implementado en el prototipo. ⚠️ Falta verificar la regla contra el articulado del Acuerdo 260 (art. 5–9) y el detalle por tipo de servicio.
- **Insumo:** vive en el **contrato** (tarifa) y llega al RIPS a nivel de **orden/usuario** (no anidado al estudio).

## Pendientes / a afinar
- Preguntas abiertas relacionadas: **#12** (orden = un contrato), **#17** (casos sin contrato), **#13–16** (Loggro), **#21** (modalidades ≠ evento: cápita/PGP), **#22** (montos UVB del recaudo 2026), **#23** (contraste línea vs bundled).
- Modalidades **≠ evento** (cápita / PGP / paquete): **ya diagramadas** (fila ⑤); falta confirmar **alcance** y **montos** (preguntas #21/#22).
- Flujos ⑧ (agendamiento, MIPRES/SIRAS, masiva/anticipos, reportes): **por confirmar alcance** con el equipo (algunos pueden quedar fuera del RIS de facturación).

## Fuentes / Relacionado
- Figma: página *Diagramas de flujo · Facturación* y *Wireframes LF · Facturación* (archivo RIS — Colombia).
- [[Dónde vive cada campo — FEV × RIS]] · [[Diccionario de construcción de la FEV en salud]] · [[Cuota moderadora y copago (recaudo del usuario)]] · [[Insumos (medicamentos y otros servicios)]] · [[Loggro — API de facturación electrónica]] · [[Preguntas abiertas]]

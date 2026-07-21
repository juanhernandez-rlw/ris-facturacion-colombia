---
tipo: adr
id: ADR-001
estado: propuesta
fecha: 2026-07-20
decisores: [Juan Hernández (edenmed)]
relacionado: ["[[Loggro — API de facturación electrónica]]", "[[Diccionario de construcción de la FEV en salud]]", "[[Preguntas abiertas]]"]
etiquetas: [adr, cufe, clave-tecnica, loggro, numeracion, seguridad, por-confirmar]
---

# ADR-001 · Cómputo del CUFE / SS-CUFE y custodia de la clave técnica

> [!warning] Estado: propuesta · **por-confirmar con Loggro** (pregunta abierta #13)
> Decisión de diseño tomada sobre la mejor evidencia disponible; **debe confirmarse** contra el Excel de estructura de Loggro + su soporte + el contrato de servicio antes de producción. No se asume nada no verificado (Regla §1.1).

## Contexto
- La **clave técnica** (`ClaveTecnica`) es un **secreto** que la DIAN asocia a cada **resolución de numeración**; es insumo del **CUFE** (hash del documento). El perfil salud usa **`SS-CUFE`** (DT2 §J).
- **Loggro** es FE **convencional**, ingiere el **XML ya armado** (`generarDocumentoElectronicoXML`) y **no expone sector salud** (ver [[Loggro — API de facturación electrónica]]).
- **Consulta a la doc de Loggro (2026-07-20):** `consultarInformacionResolucionDIAN` es una **consulta** (trae la clave técnica *desde la DIAN*), **no un repositorio**; y `generarDocumentoElectronicoXML` **no especifica** si Loggro computa el CUFE/firma o si vienen pre-calculados (lo difiere a su Excel de estructura + soporte + contrato).
- Por tanto **NO es viable asumir** que Loggro custodia la clave técnica y computa el CUFE.

## Decisión
1. **El RIS (app) computa el `SS-CUFE`** y arma el UBL con la extensión de salud del DT2 (coherente con la posición ya registrada en el diccionario FEV).
2. **La clave técnica se custodia en Config-IPS**, **cifrada en reposo + control de acceso por rol (RBAC)**, **por resolución** (incluida la de **contingencia**). Nunca en texto plano.
3. **El cómputo del CUFE se implementa como frontera intercambiable** (estrategia/adaptador): `app-computa` ↔ `delegar-a-Loggro`. Así no se acopla a un supuesto: si Loggro confirma que lo hace, se delega sin reescribir.
4. **Numeración:** el RIS asigna el `numFactura` desde el rango DIAN autorizado (ver decisión de numeración en el diccionario FEV); el mismo número va en FEV y RIPS (PFP001).

## Alternativas consideradas
- **Delegar el CUFE a Loggro (asumir que tiene la clave técnica).** Descartada: no verificada en la doc pública; Loggro no expone salud (el `SS-CUFE` quedaría fuera de su alcance); movería un secreto fiscal a un tercero sin confirmar el flujo.
- **App computa (elegida).** Default seguro: la clave técnica es de *nuestra* resolución, el secreto queda in-house, y no bloquea el diseño.

## Consecuencias
**Positivas:**
- Control in-house del secreto fiscal → mejor postura frente a Ley 1581 (menos superficie de terceros).
- No bloquea el diseño del modelo/persistencia mientras Loggro confirma.
- La frontera intercambiable evita reescritura si la respuesta de Loggro cambia.

**Negativas / riesgos:**
- El RIS asume la complejidad de computar el `SS-CUFE` (hash + clave técnica) correctamente.
- **Riesgo abierto (#13):** si Loggro resultara computar el CUFE, hay que ajustar el adaptador (mitigado por diseño).
- Si en el flujo final la clave técnica **pasara** por Loggro, se requiere **contrato de encargado del tratamiento** (ver hallazgo S-01 de la auditoría).

## Cómo se confirma / cierra
- Excel **"Estructura Documentos Electrónicos - Facturación Electrónica - 1.9"** de Loggro (¿el CUFE es campo de entrada o calculado?).
- Soporte técnico de Loggro + contrato de servicio.
- Al confirmarse, actualizar este ADR a `aceptada` (o `reemplazada`) y ajustar el adaptador.

## Relacionado
- [[Loggro — API de facturación electrónica]] · [[Diccionario de construcción de la FEV en salud]] · [[Preguntas abiertas]] (#13–#16) · [[Modelo de persistencia (fusión P0 · Fase 5 · P3)]] (entidad ResoluciónDIAN / Config-IPS)

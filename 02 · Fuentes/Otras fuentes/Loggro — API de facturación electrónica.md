---
tipo: fuente
categoria: otra
titulo: "Loggro — API de facturación electrónica (proveedor de timbrado)"
url: "https://developer.loggro.com/docs/guia-de-uso"
autor: "Loggro"
fecha_captura: 2026-07-19
estado: en-proceso
es_fuente_de_verdad: false
confiabilidad: media
areas: [arquitectura, facturacion]
etiquetas: [proveedor, loggro, timbrado, dian, integracion]
---

# Loggro — API de facturación electrónica

> [!info] Ficha de fuente · proveedor tecnológico (no normativa)
> **Loggro** es el software de facturación con el que edenmed integrará el **timbrado ante la DIAN** (decisión del usuario, 2026-07-19). Modelo = **delegación**: la app arma el documento y Loggro lo timbra.

## 🔗 Acceso
- **Docs:** https://developer.loggro.com/docs/guia-de-uso · índice: https://developer.loggro.com/llms.txt
- **Endpoint núcleo:** `POST /generarDocumentoElectronicoXML`

## 🎯 Qué aporta / hallazgos verificados (2026-07-19)
- La API cubre **Factura Electrónica (FE)**, **Documento Soporte** y **Nómina**. **NO** expone sector salud / FEV en salud / RIPS / MUV / CUV (verificado en el índice; búsqueda web sin producto de salud → *confirmar con Loggro*).
- `generarDocumentoElectronicoXML` ingiere `zipXmlBase64` = el **XML ya armado** → **la app construye el UBL; Loggro firma/timbra ante la DIAN**. `tipoDocumento`: FAVE/NCVE/NDVE. Batch ≤ 30.
- Respuesta: `idDocumento`, `numero`, `prefijo`, `tipoDocumento`, `documentoProcesado`. **CUFE/acuse DIAN** vía `consultarInformacionDocumentoElectronico*` (*por confirmar*).

## 🧠 Implicación arquitectónica
La **delegación es parcial**: Loggro = pierna **tributaria** (timbrado DIAN → CUFE). La pierna de **salud** (transmitir {FEV+RIPS} al **MUV** → CUV) **queda del lado de la app** (validador MinSalud API Docker / cliente-servidor). Como Loggro ingiere XML pre-armado, la app construye el UBL **incluyendo la extensión de salud del DT2** y computa el `SS-CUFE`.

## ⚠️ A confirmar con Loggro
1. ¿Quién computa el **CUFE/`SS-CUFE`** (app o Loggro)?
2. ¿Preserva las `UBLExtension` personalizadas (extensión de salud)?
3. ¿Soporta el perfil salud (`SS-CUFE/CUDE…`) o solo FEV convencional?
4. Autenticación del producto "Documentos Electrónicos" y ambiente de pruebas.

## 🧠 Conocimiento derivado
- [[Diccionario de construcción de la FEV en salud]] (orígenes `INTEGR` + §J).

## 🔗 Relacionado
- [[Diccionario de construcción de la FEV en salud]] · [[FEV-RIPS — Facturación electrónica en salud]]

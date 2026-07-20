## Panorama general

El RIS no radica ni factura, pero es la fuente de casi todo el dato. Produce cuatro insumos que alimentan el flujo. Los dos primeros son estructuras de datos; los otros dos, campos y documentos que se anexan.
![[Pasted image 20260716194957.png]]


## RIPS (JSON)

Registro Individual de Prestación de Servicios de Salud. Es el reporte estandarizado, en formato JSON, donde se detalla —servicio por servicio y paciente por paciente— qué atención en salud se prestó, a quién, quién la prestó y cuánto costó. Es el "lado clínico-asistencial" de la facturación  
Para qué sirve  
Es la contraparte obligatoria de la factura electrónica cuando se cobra un servicio de salud. Mientras la factura (FEV) dice "cobro $X" en el lenguaje fiscal de la DIAN, el RIPS dice "ese $X corresponde a este TAC de cráneo, hecho a este paciente, con este diagnóstico, en esta fecha". Sin RIPS, el cobro en salud no está soportado ni es validable.

Estas tablas, reflejan el nombre del campo, tipo y tamaño del dato, ¿qué es? y ¿de dónde sale?, este último es para determinar en qué sección o formulario del RIS debería estar ubicado, aun está en proceso de definición y a veces también solo contiene un comentario. 
## Transacción · relaciona el RIPS con la factura

![[Pasted image 20260716195139.png]]
## Usuarios · el paciente
![[Pasted image 20260716195225.png]]

## Procedimientos · el estudio de imagen
![[Pasted image 20260716195254.png]]

### Campos FEV-salud
![[Pasted image 20260716195524.png]]
## 
Documentación relacionada

Resolución 948 de 2026  
- Qué es: la norma vigente que regula el RIPS como soporte de la FEV en salud. Derogó la 2275/2023, 558/2024 y 1884/2024.
- Por qué importa: es el marco legal generar del RIPS. Define obligatoriedad, plazos y el parágrafo transitorio (por qué el CUCON aún no rechaza).
- [PDF](https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-0948-de-2026.pdf)

Documento Técnico 1 (DT1) — v002 (1-jul-2026)  

- Qué es: especificaciones de los campos del RIPS (JSON) y las reglas de validación (RVC/RVG).
- Por qué importa: es el source of truth de la estructura del RIPS. Lo que arma el RIS y lo que valida el MUV. Aquí están los campos, tipos, obligatoriedad, y cambios como causaExterna→causaMotivoAtencion.
- [PDF (v001 en biblioteca; v002 en micrositio)](https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/OT/anexo-tecnico1-resolucion-948-de-2026.pdf)

Documento Técnico 2 (DT2) — v001 (1-jul-2026)  

- Qué es: especificaciones de la extensión FEV-salud en el XML (sector salud UBL).
- Por qué importa: define los campos que van en la factura (modalidad, cobertura, NUMERO_CONTRATO, CUCON en la Nota, póliza, periodo). Complementa el DT1.
- [PDF](https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/OT/anexo-tecnico2-resolucion-948-de-2026.pdf)

Tablas de referencia FEV-RIPS (SISPRO)  

- Qué es: las ~37 tablas de códigos oficiales (TipoNota, CUPSRips, CIE10, RIPSTipoUsuario, modalidadPago, CoberturaPlanBeneficios, EntidadResponsablePago, facturaSinContrato, etc.).
- Por qué importa: son los enums válidos; si mandas un código que no está, el MUV rechaza. Es lo que valida "contenido", no solo estructura.
- [SISPRO · Consulta de referencias básicas](https://web.sispro.gov.co/WebPublico/Consultas/ConsultarDetalleReferenciaBasica.aspx)


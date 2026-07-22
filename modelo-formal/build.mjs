#!/usr/bin/env node
/**
 * build.mjs — genera el bundle runtime del prototipo desde el modelo canónico.
 *
 *   modelo-formal/enums.json  +  modelo-formal/reglas.dmn.json
 *        └────────────────────────┬────────────────────────┘
 *                                 ▼
 *          modelo-formal/dist/modelo.datos.js   (window.RIS_MODELO)
 *
 * Así el prototipo (que corre en file:// y NO puede hacer fetch) consume el MISMO
 * modelo que documentan los estándares, sin duplicarlo a mano. Fuente única = los JSON.
 *
 * El prototipo se consolidó en el repo hermano `generador-rips` (carpeta prototipos/).
 * Tras regenerar, copia dist/modelo.datos.js → generador-rips/prototipos/modelo.datos.js.
 *
 * Uso:  node modelo-formal/build.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
// El consumidor (prototipo) se movió al repo hermano generador-rips/prototipos/.
// Aquí generamos a un dist/ local; luego se copia al hermano (ver cabecera).
const OUT = join(here, "dist", "modelo.datos.js");

const enumsRaw = JSON.parse(await readFile(join(here, "enums.json"), "utf8"));
const reglasDoc = JSON.parse(await readFile(join(here, "reglas.dmn.json"), "utf8"));

// enums: quitamos _meta (queda en el archivo canónico); al runtime solo van las listas.
const enums = { ...enumsRaw };
delete enums._meta;

const modelo = {
  _meta: {
    generado_por: "modelo-formal/build.mjs",
    fuente: ["modelo-formal/enums.json", "modelo-formal/reglas.dmn.json"],
    nota: "GENERADO — no editar a mano. Edita los JSON canónicos y re-ejecuta build.mjs.",
    alcance: reglasDoc._meta.alcance_honesto,
  },
  enums,
  mapas: reglasDoc.mapas,
  reglas: reglasDoc.reglas,
  visibilidad: reglasDoc.visibilidad,
};

const banner =
  "/* ============================================================\n" +
  " *  GENERADO por modelo-formal/build.mjs — NO EDITAR A MANO.\n" +
  " *  Fuente: modelo-formal/enums.json + modelo-formal/reglas.dmn.json\n" +
  " *  Regenerar:  node modelo-formal/build.mjs\n" +
  " * ============================================================ */\n";

const body =
  banner +
  '"use strict";\n' +
  "(function (root) {\n" +
  "  var RIS_MODELO = " +
  JSON.stringify(modelo, null, 2).replace(/\n/g, "\n  ") +
  ";\n" +
  "  if (typeof module !== 'undefined' && module.exports) module.exports = RIS_MODELO;\n" +
  "  if (typeof window !== 'undefined') window.RIS_MODELO = RIS_MODELO;\n" +
  "})(this);\n";

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, body, "utf8");

const nReglas = modelo.reglas.length;
const nEnums = Object.keys(enums).length;
console.log(`✓ modelo.datos.js generado`);
console.log(`  · ${nEnums} enums`);
console.log(`  · ${nReglas} reglas (${modelo.reglas.filter(r => r.scope === "orden").length} orden · ${modelo.reglas.filter(r => r.scope === "convenio").length} convenio · ${modelo.reglas.filter(r => r.scope === "contrato").length} contrato)`);
console.log(`  · ${modelo.visibilidad.length} reglas de visibilidad`);
console.log(`  → ${OUT}`);

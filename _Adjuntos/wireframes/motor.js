/* ============================================================
 *  motor.js — motor de reglas del RIS (evalúa modelo.datos.js)
 *
 *  Expone window.RIS con:
 *    · enums               las listas de valores (desde el modelo)
 *    · label(enum, cod)    etiqueta de un código
 *    · validarOrden(ctx)   gate: TODOS los mensajes que faltan
 *    · chequearConvenio(f) / chequearContrato(f)  guardas de guardado (lista en orden)
 *    · visible(field,ctx) / requerido(field,ctx)  visibilidad y obligatoriedad condicional
 *    · evalCond(cond,ctx)  evaluador del mini-lenguaje de condiciones
 *
 *  NO contiene reglas: las lee de RIS_MODELO (generado desde modelo-formal/).
 *  Funciona en el navegador (file://) y en node (para tests).
 * ============================================================ */
(function (root) {
  "use strict";

  var MODELO =
    (typeof window !== "undefined" && window.RIS_MODELO) ? window.RIS_MODELO :
    (typeof module !== "undefined" && typeof require !== "undefined") ? require("./modelo.datos.js") :
    { enums: {}, reglas: [], visibilidad: [] };

  /* --- resolver de rutas: "cont.recaudo.concepto" sobre un objeto, a prueba de null --- */
  function resolve(obj, path) {
    if (path == null) return undefined;
    var parts = String(path).split(".");
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  /* --- operando: literal o {"$":"otraRuta"} --- */
  function operand(ctx, v) {
    if (v && typeof v === "object" && Object.prototype.hasOwnProperty.call(v, "$")) return resolve(ctx, v.$);
    return v;
  }

  /* --- evaluador del mini-lenguaje de condiciones --- */
  function evalCond(cond, ctx) {
    if (!cond || typeof cond !== "object") return false;
    if ("and" in cond) return cond.and.every(function (c) { return evalCond(c, ctx); });
    if ("or" in cond)  return cond.or.some(function (c) { return evalCond(c, ctx); });
    if ("not" in cond) return !evalCond(cond.not, ctx);
    if ("empty" in cond)      return !resolve(ctx, cond.empty);
    if ("truthy" in cond)     return !!resolve(ctx, cond.truthy);
    if ("nonempty" in cond)   { var a = resolve(ctx, cond.nonempty); return !!(a && a.length); }
    if ("emptyArray" in cond) { var b = resolve(ctx, cond.emptyArray); return !(b && b.length); }
    if ("emptyTrim" in cond)  { var s = resolve(ctx, cond.emptyTrim); return !String(s == null ? "" : s).trim(); }
    if ("eq" in cond)  return resolve(ctx, cond.eq[0]) === operand(ctx, cond.eq[1]);
    if ("ne" in cond)  return resolve(ctx, cond.ne[0]) !== operand(ctx, cond.ne[1]);
    if ("gt" in cond)  return resolve(ctx, cond.gt[0]) > operand(ctx, cond.gt[1]);
    if ("lte" in cond) return Number(resolve(ctx, cond.lte[0])) <= Number(operand(ctx, cond.lte[1]));
    if ("pctOutOfRange" in cond) return cond.pctOutOfRange.some(function (p) {
      var x = parseFloat(resolve(ctx, p)); return isNaN(x) || x < 0 || x > 100;
    });
    if ("copRango" in cond) return cond.copRango
      .map(function (p) { return parseFloat(resolve(ctx, p)); })
      .filter(function (x) { return !isNaN(x); })
      .some(function (x) { return x < 0 || x > 100; });
    if ("mapIn" in cond) {
      var mp = (MODELO.mapas || {})[cond.mapIn.map] || {};
      return cond.mapIn.in.indexOf(mp[resolve(ctx, cond.mapIn.key)]) >= 0;
    }
    return false;
  }

  /* --- interpola ${ruta} de un mensaje contra el contexto (para reglas forEach) --- */
  function interp(tpl, ctx) {
    return String(tpl).replace(/\$\{([^}]+)\}/g, function (_, expr) {
      var v = resolve(ctx, expr.trim());
      return v == null ? "" : String(v);
    });
  }

  /* --- corre todas las reglas de un scope, devuelve los mensajes que disparan (en orden) --- */
  function run(scope, ctx) {
    var out = [];
    (MODELO.reglas || []).forEach(function (r) {
      if (r.scope !== scope) return;
      if (r.forEach) {
        var arr = resolve(ctx, r.forEach) || [];
        var as = r.as || "item";
        arr.forEach(function (item) {
          var sub = {};
          for (var k in ctx) if (Object.prototype.hasOwnProperty.call(ctx, k)) sub[k] = ctx[k];
          sub[as] = item;
          if (evalCond(r.when, sub)) out.push(interp(r.message, sub));
        });
      } else {
        if (evalCond(r.when, ctx)) out.push(r.message);
      }
    });
    return out;
  }

  function vis(field) {
    return (MODELO.visibilidad || []).filter(function (v) { return v.field === field; })[0];
  }

  var RIS = {
    modelo: MODELO,
    enums: MODELO.enums || {},
    mapas: MODELO.mapas || {},
    recaudoConcepto: function (tu) { return ((MODELO.mapas && MODELO.mapas.RECAUDO_TU) || {})[tu] || "no"; },
    evalCond: evalCond,
    label: function (enumName, code) {
      var opts = (MODELO.enums || {})[enumName] || [];
      for (var i = 0; i < opts.length; i++) if (opts[i][0] === code) return opts[i][1];
      return code || "—";
    },
    validarOrden: function (ctx) { return run("orden", ctx); },
    chequearConvenio: function (cForm) { return run("convenio", cForm); },
    chequearContrato: function (kForm) { return run("contrato", kForm); },
    visible: function (field, ctx) { var v = vis(field); return v && v.visibleWhen ? evalCond(v.visibleWhen, ctx) : true; },
    requerido: function (field, ctx) { var v = vis(field); return v && v.requiredWhen ? evalCond(v.requiredWhen, ctx) : false; }
  };

  if (typeof module !== "undefined" && module.exports) module.exports = RIS;
  if (typeof window !== "undefined") window.RIS = RIS;
})(this);

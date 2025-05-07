// Polyfill for util.inherits
if (typeof global.util === "undefined" || typeof global.util.inherits !== "function") {
  if (!global.util) global.util = {}

  global.util.inherits = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      Object.setPrototypeOf(ctor.prototype, superCtor.prototype)
    }
  }
}

export {}

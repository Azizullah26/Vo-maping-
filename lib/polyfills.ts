// Polyfill for inherits function used by some Node.js modules
if (typeof global !== "undefined" && !global.inherits) {
  try {
    // Try to use the inherits package if available
    global.inherits = require("inherits")
  } catch (e) {
    // Fallback implementation if package is not available
    global.inherits = (ctor, superCtor) => {
      if (superCtor) {
        ctor.super_ = superCtor
        Object.setPrototypeOf
          ? Object.setPrototypeOf(ctor.prototype, superCtor.prototype)
          : (ctor.prototype = Object.create(superCtor.prototype))
      }
    }
  }
}

// Add other Node.js core polyfills if needed
if (typeof global !== "undefined" && !global.process) {
  global.process = global.process || {}
  global.process.env = global.process.env || {}
}

"strict mode"

// from:
// http://wiki.ecmascript.org/doku.php?do=show&id=harmony:proxies#trap_defaults
module.exports = function(obj, overwrites) {
  var handler = {

    getOwnPropertyDescriptor: function(name) {
      var desc = Object.getOwnPropertyDescriptor(obj, name)

      // a trapping proxy's properties must always be configurable
      if (desc !== undefined) {
        desc.configurable = true
      }

      return desc
    },

    getPropertyDescriptor: function(name) {
      var desc = Object.getPropertyDescriptor(obj, name)

      // a trapping proxy's properties must always be configurable
      if (desc !== undefined) {
        desc.configurable = true
      }

      return desc
    },

    getOwnPropertyNames: function() {
      return Object.getOwnPropertyNames(obj)
    },

    getPropertyNames: function() {
      return Object.getPropertyNames(obj)
    },

    defineProperty: function(name, desc) {
      Object.defineProperty(obj, name, desc)
    },

    delete: function(name) {
      return delete obj[name]
    },

    fix: function() {
      if (Object.isFrozen(obj)) {
        var result = {}
        Object.getOwnPropertyNames(obj).forEach(function(name) {
          result[name] = Object.getOwnPropertyDescriptor(obj, name)
        })
        return result
      }

      // As long as obj is not frozen, the proxy won't allow itself to be fixed
      return undefined // will cause a TypeError to be thrown
    },

    has: function(name) {
      return name in obj
    },

    hasOwn: function(name) {
      return Object.prototype.hasOwnProperty.call(obj, name)
    },

    get: function(receiver, name) {
      return obj[name]
    },

    set: function(receiver, name, val) {
      obj[name] = val
      return true
    }, // bad behavior when set fails in non-strict mode

    enumerate: function() {
      var result = []
      for (var name in obj) {
        result.push(name)
      }
      return result
    },

    keys: function() {
      return Object.keys(obj)
    }

  }

  for (var key in overwrites) {
    handler[key] = overwrites[key]
  }

  return handler
}
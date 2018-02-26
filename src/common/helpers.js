// ty to this dude: https://www.webreflection.co.uk/blog/2015/10/06/how-to-copy-objects-in-javascript
// preserves accessors
export default {
    extend: (target) => {
      for (var
        hOP = Object.prototype.hasOwnProperty,
        copy = function (key) {
          if (!hOP.call(target, key)) {
            Object.defineProperty(
              target,
              key,
              Object.getOwnPropertyDescriptor(this, key)
            );
          }
        },
        i = arguments.length;
        1 < i--;
        Object.keys(arguments[i]).forEach(copy, arguments[i])
      ){}
      return target;
    },

    // masks source1 with source2, result will be all of the properties in source1
    // with values replaced from source2 if it contains the property
    // if _protect: [property keys] is provided, then properties in source2 that are in _protect
    // will not be applied
    mask: (source1, source2, excludeProtect) => {
        var destination = {};
        var _protect = [];

        for (var property in source1) {
            if (source1.hasOwnProperty(property)) {
                if (property === "_protect") {
                    _protect = source1[property];
                    if (!excludeProtect) {
                        destination[property] = _protect.slice(); // make a copy
                    }
                } else {
                    destination[property] = source1[property];
                }
            }
        }

        for (var property in source2) {
            if (source1.hasOwnProperty(property) && _protect.indexOf(property) === -1 && property != "_protect") { // Changed from extend here (2 => 1)
                destination[property] = source2[property];
            }
        }

        return destination;
    },

    // Bind all functions in obj to scope
    bind: (obj, scope) => {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && typeof(obj[prop]) === "function") {
                obj[prop] = obj[prop].bind(scope);
            }
        }

        return obj;
    },

    hashCode: (str) => {
        var hash = 0;
        if (str.length == 0) return hash;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
};
// Mutates dictionary by splicing out found entry
export function searchDictionaryBy(dictionary, attribute, text, numResults = 5) {
  const pattern = new RegExp(text,'i')
  const allMatches = Object.values(dictionary).filter( e => {
    const entry = getNestedAttribute(e, attribute)
    return entry && pattern.test(entry)
  })
  sortByAttribute(allMatches, attribute, false)
  allMatches.splice(numResults)
  allMatches.forEach( m => delete dictionary[m.handle] )
  return allMatches
}


// Mutates dictionary by splicing out found entry
export function searchDictionaryByArray(dictionary, attribute, text, numResults = 5) {
  const pattern = new RegExp(text,'i')
  const allMatches = Object.values(dictionary).filter( e => {
    const entry = getNestedAttribute(e, attribute)
    if ( entry && typeof entry === 'object' && entry.constructor === Array ) {
      return entry.includes( e => pattern.test(entry) )
    }
    else {
      return false
    }
  })
  allMatches.splice(numResults)
  allMatches.forEach( m => delete dictionary[m.handle] )
  return allMatches
}


export function searchDictionaryByKeys(dictionary, keys, numResults = 5) {
  let allMatches = []
  Object.entries(dictionary).forEach( k => {
    if ( keys.includes(k[0]) ) {
      allMatches.push(k[1])
    }
  })
  return allMatches
}


export function getNestedAttribute(target, attribute) {
  const attributes = attribute.split('.')
  let entry = null
  attributes.forEach( a => {
    if ( entry ) {
      entry = entry[a]
    }
    else {
      entry = target[a]
    }
  })
  return entry
}


export function sortByAttribute( list, attribute, reverse = false ) {
  list.sort(( a, b ) => {
    let result = 0
    if ( a[attribute] < b[attribute]) {
      result = -1
    }
    if ( a[attribute] > b[attribute]) {
      result = 1
    }

    return result * ( reverse ? -1 : 1 )
  })
}


export function getAllNestedValues(target) {
  let results = []
  for (var key in target) {
    if (typeof target[key] === "object") {
      results = [ ...results, ...getAllNestedValues(target[key])]
    } else {
      results = [ ...results, target[key]]
    }
  }
  return results
}


export function findWordAtCursor(text, cursorIndex) {
  let cursorEndIndex = text.indexOf(' ',cursorIndex)
  if ( cursorEndIndex === -1 ) {
    cursorEndIndex = cursorIndex
  }

  let cursorBeginIndex = text.slice(0,cursorIndex).lastIndexOf(' ') + 1
  if (cursorBeginIndex === -1 || cursorBeginIndex > cursorEndIndex ) {
    cursorBeginIndex = 0
  }

  return  {
    currentWord: text.slice(cursorBeginIndex, cursorEndIndex).trim(),
    cursorBeginIndex,
    cursorEndIndex,
  }
}


export function camelCaseify( val ) {
  const _camelCaseify = val => {
    if ( val == null ) {
      return val
    }
    if ( Array.isArray( val )) {
      return val.map( v => _camelCaseify( v ))
    }
    if ( typeof val === 'object' ) {
      const newVal = {}
      for ( let k in val ) {
        const v = val[k]
        if ( v && k === '_id' && v.$oid ) {
          k = 'id'
          newVal[k] = v.$oid
        }
        else if ( v && RegExp('_id$').test(k) && v.$oid ) {
          k = k.replace( /_(\w)/g, s => s[1].toUpperCase())
          newVal[k] = v.$oid
        }
        else {
          k = k.replace( /_(\w)/g, s => s[1].toUpperCase())
          newVal[k] = _camelCaseify( v )
        }
      }

      return newVal
    }
    else {
      return val
    }
  }

  return _camelCaseify( val )
}


export function snakeCaseify( val ) {
  const _snakeCaseify = val => {
    if ( val == null ) {
      return val
    }
    if ( Array.isArray( val )) {
      return val.map( v => _snakeCaseify( v ))
    }
    if ( typeof val === 'object' ) {
      const newVal = {}
      for ( let k in val ) {
        const v = val[k]
        k = k.replace( /([A-Z])/g, '_$1' ).toLowerCase()
        newVal[k] = _snakeCaseify( v )
      }

      return newVal
    }
    else {
      return val
    }
  }

  return _snakeCaseify( val )
}


export function stringDifference(a, b) {
    var i = 0
    var j = 0
    var result = ""

    while (j < b.length) {
      if (a[i] !== b[j] || i === a.length)
          result += b[j]
      else
          i++
      j++
    }
    return result
}


export function formAdd( data, target, attr, targetAttr, transformOrValue ) {
  const isFormData = target.constructor.name === 'FormData'
  let hasVal = true
  let value = data

  if ( attr ) {
    const attrParts = attr.split( '.' )
    for ( const a of attrParts ) {
      value = value[a]
      if ( value === undefined ) {
        hasVal = false
        break
      }
    }
  }
  else {
    value = data
    hasVal = true
  }

  if ( hasVal ) {
    if ( isFormData ) {
      if ( transformOrValue ) {
        if ( typeof transformOrValue === 'function' ) {
          target.append( targetAttr, transformOrValue( value ))
        }
        else {
          target.append( targetAttr, transformOrValue )
        }
      }
      else {
        target.append( targetAttr, value )
      }
    }
    else {
      if ( transformOrValue ) {
        if ( typeof transformOrValue === 'function' ) {
          target[targetAttr] = transformOrValue( value )
        }
        else {
          target[targetAttr] = transformOrValue
        }
      }
      else {
        target[targetAttr] = value
      }
    }
  }
}

export function searchDictionaryBy(dictionary, attribute, text, numResults = 5) {
  const pattern = new RegExp(text,'i')
  const allMatches = Object.values(dictionary).filter( e => pattern.test(e[attribute]))
  sortByAttribute(allMatches, attribute, false)
  allMatches.splice(numResults)
  return allMatches
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
        if ( k === '_id' ) {
          k = 'id'
          newVal[k] = v.$oid
        }
        else if ( RegExp('_id$').test(k) && v.$oid ) {
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

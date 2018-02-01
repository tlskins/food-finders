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

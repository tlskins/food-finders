import React from 'react'

import { camelCaseify } from '~/utils'


export const pResponseHierarchyTree = json => {
  let hierarchyTree = camelCaseify( json )
  hierarchyTree.dictionary = _treeToDictionary(hierarchyTree.tree)

  return hierarchyTree
}


const _treeToDictionary = (tree) => {
  let dictionary = {}
  Object.values(tree).forEach( v => _treeNodeToDictionary(v, dictionary) )
  return dictionary
}


const _treeNodeToDictionary = (node, dictionary) => {
  dictionary[node.id] = node
  if ( node.children ) {
    Object.values(node.children).forEach( c => _treeNodeToDictionary(c, dictionary))
  }
}

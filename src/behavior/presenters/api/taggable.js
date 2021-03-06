import { formAdd } from '~/utils'


export const pRequestTaggable = data => {
  const req = {}

  formAdd( data, req, 'id', 'id' )
  formAdd( data, req, 'name', 'name' )
  formAdd( data, req, 'description', 'description' )
  formAdd( data, req, 'synonyms', 'synonyms' )
  formAdd( data, req, 'parentId', 'parent_id' )

  return req
}

const classToType = {
  'Entity': 'entities',
}

export const pTaggableClassToType = taggableClass => {
  return classToType[taggableClass]
}

import React from 'react'

import { formAdd } from '~/utils'


export const pRequestTaggable = data => {
  const req = {}

  formAdd( data, req, 'id', 'id' )
  formAdd( data, req, 'name', 'name' )
  formAdd( data, req, 'description', 'description' )
  formAdd( data, req, 'synonyms', 'synonyms' )

  return req
}

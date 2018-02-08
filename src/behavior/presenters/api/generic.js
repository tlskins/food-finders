import { camelCaseify, snakeCaseify } from '~/utils'


export const pResponseGeneric = json => {
  const data = camelCaseify( json )

  return data
}


export const pRequestGeneric = json => {
  return snakeCaseify( json )
}

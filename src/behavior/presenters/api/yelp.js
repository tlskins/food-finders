import { camelCaseify } from '~/utils'


export const pResponseYelpBusiness = json => {
  const yelpBusiness = camelCaseify( json )
  const business = { embeddedTaggable: yelpBusiness }
  business.embeddedTaggable.description = yelpBusiness.location.displayAddress.join(', ')
  business.embeddedTaggable.id = yelpBusiness.alias
  business.embeddedTaggable.yelpId = yelpBusiness.id
  business.id = yelpBusiness.alias
  business.handle = yelpBusiness.alias
  business.name = yelpBusiness.name
  business.symbol = "@"
  business.taggableType = 'Entity'

  return business
}


export const pResponseYelpBusinesses = json => {
  const yelpBusinesses = camelCaseify( json.businesses )
  let businesses = []
  yelpBusinesses.forEach(yelpBusiness => {
    businesses.push(pResponseYelpBusiness(yelpBusiness))
  })

  return businesses
}

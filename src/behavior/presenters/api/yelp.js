import { camelCaseify } from '~/utils'


export const pResponseYelpBusinesses = json => {
  const yelpBusinesses = camelCaseify( json.businesses )
  let businesses = []
  yelpBusinesses.forEach(yelpBusiness => {
    const business = { yelpBusiness }
    business.handle = yelpBusiness.alias
    business.name = yelpBusiness.name
    business.symbol = "@"
    business.taggableType = 'Entity'
    businesses.push(business)
  })

  return businesses
}

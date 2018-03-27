import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'


class SocialEntryRating extends PureComponent {
  render() {
    const { tags } = this.props
    const foodRatingTypeTags = tags && tags.filter( t => t.taggableType === 'FoodRatingType' )
    if ( !foodRatingTypeTags || foodRatingTypeTags.length === 0 ) {
      return null
    }
    const foodRatingTypeMetrics = tags.filter( t => t.taggableType === 'FoodRatingMetric' )
    const foods = tags.filter( t => t.taggableType === 'Food' )
    const entities = tags.filter( t => t.taggableType === 'Entity' )
    const { symbol, handle } = foodRatingTypeTags[0]
    const ratingTypeName = symbol + handle
    const foodName = foods && foods[0] && foods[0].name
    const entityName = entities && entities[0] && entities[0].name

    return (
      <div className="rating">
        { foodName &&
          <div className="rating-sub-header">
            <span class="item-sub-header-component"> { foodName } </span>
          </div>
        }
        { entityName &&
          <div className="rating-sub-header">
            <span class="item-sub-header-component"> { entityName } </span>
          </div>
        }
        <div className="rating-inner-container">
          <span className="rating-component">{ ratingTypeName }</span>
          <span className="rating-component"> • </span>
          { foodRatingTypeMetrics && foodRatingTypeMetrics.map( (m,i) => {
            const renderBullet = i !== foodRatingTypeMetrics.length - 1
            return (
              <div>
                <span className="rating-component">{ m.symbol + m.handle }</span>
                { renderBullet && <span className="rating-component"> • </span> }
              </div>
            ) } )
          }
        </div>
      </div>
    )
  }
}


SocialEntryRating.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
}


export default SocialEntryRating

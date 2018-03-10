import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Rating extends Component {
  constructor(props) {
    super(props)
    const { user, tags } = props

    if ( user && tags ) {
      const ratingComponents = this.calculateRatingComponents(user, tags)
      this.state = { ...ratingComponents }
    }
    else {
      this.state = {
        rater: undefined,
        ratee: undefined,
        rateable: undefined,
        ratingType: undefined,
        ratingMetrics: [],
      }
    }
  }

  componentWillReceiveProps = nextProps => {
    const { user, tags } = nextProps

    if ( user && tags ) {
      const ratingComponents = this.calculateRatingComponents(user, tags)
      this.setState({ ...ratingComponents })
    }
  }

  calculateRatingComponents = (user, tags) => {
    const allMetrics = tags.filter( t => t.taggableType === 'FoodRatingMetric' )
    const allValidMetrics = []
    allMetrics.forEach( m => {
      if ( allValidMetrics.length === 0 || allValidMetrics.every( v => v.handle !== m.handle ) ) {
        allValidMetrics.push(m)
      }
    })

    return {
      rater: user,
      ratee: tags.find( t => t.taggableType === 'Entity' ),
      rateable: tags.find( t => t.taggableType === 'Food' ),
      ratingType: tags.find( t => t.taggableType === 'FoodRatingType' ),
      ratingMetrics: allValidMetrics,
    }
  }

  renderRatingComponentHeader = text => {
    return (
      <div className='rating-component-header'>
        <p>
          { text }
        </p>
      </div>
    )
  }

  renderRatingComponentTags = component => {
    if ( Array.isArray(component) ) {
      if ( component.length < 1 ) {
        return null
      }
      else {
        return (
          <div className='rating-component-tags-container'>
            { component.map( m =>
              <div className={ 'social-entry-tag__' + (m.taggableType || '').toLowerCase() }
                key={ m.id }>
                <p>
                  { m.symbol + m.handle }
                </p>
              </div>
            ) }
          </div>
        )
      }
    }
    else {
      if ( !component ) {
        return null
      }
      else {
        return (
          <div className={ 'social-entry-tag__' + (component.taggableType || '').toLowerCase() }>
            <p>
              { component.symbol + component.handle }
            </p>
          </div>
        )
      }
    }
  }

  render() {
    const {
      rater,
      ratee,
      rateable,
      ratingType,
      ratingMetrics,
    } = this.state

    if ( !ratingType || !rater ) {
      return null
    }

    return (
      <div className='rating-container'>
        Rating Components
        <div className='rating-container-inner'>
          <div className='rating-component-outer-container--rating-type'>
            <div className='rating-component-inner-container'>
              { this.renderRatingComponentHeader('Rating Type') }
              { this.renderRatingComponentTags(ratingType) }
            </div>
          </div>
          <div className='rating-component-outer-container--rateable'>
            <div className='rating-component-inner-container'>
              { this.renderRatingComponentHeader('Food') }
              { this.renderRatingComponentTags(rateable) }
            </div>
          </div>
          <div className='rating-component-outer-container--ratee'>
            <div className='rating-component-inner-container'>
              { this.renderRatingComponentHeader('Restaurant') }
              { this.renderRatingComponentTags(ratee) }
            </div>
          </div>
          <div className='rating-component-outer-container--rating-metrics'>
            <div className='rating-component-inner-container'>
              { this.renderRatingComponentHeader('Rating Metrics') }
              { this.renderRatingComponentTags(ratingMetrics) }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Rating.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
}

export default Rating

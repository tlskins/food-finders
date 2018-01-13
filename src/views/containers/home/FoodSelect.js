import { connect } from 'react-redux'

import FoodSelect from '@components/home/FoodSelect'

import services from '@services'
import coordinators from '@coordinators'

const mapDispatchToProps = () => {
  const { RestService } = services

  const loadFoods = coordinators.loadFoods({ RestService })

  return {
    loadFoods,
  }
}

export default connect(null, mapDispatchToProps)(FoodSelect)

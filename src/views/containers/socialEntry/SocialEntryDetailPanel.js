import { connect } from 'react-redux'

import SocialEntryDetailPanel from '@components/socialEntry/SocialEntryDetailPanel'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { socialEntry, socialEntryDetailPanel } = state
  const {
    tagSymbol,
    tagSuggestions,
    selectedTagIndex,
  } = socialEntry
  const { mode } = socialEntryDetailPanel
  const activeTag = tagSuggestions && tagSuggestions[selectedTagIndex]

  return {
    activeTag,
    mode,
    tagSymbol,
  }
}

const mapDispatchToProps = () => {
  const { UIService } = services

  const toggleMode = mode => UIService.SocialEntryDetailPanel.toggleMode(mode)

  return {
    toggleMode,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialEntryDetailPanel)

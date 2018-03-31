import { connect } from 'react-redux'

import SocialEntryDetailPanel from '@components/socialEntry/SocialEntryDetailPanel'

import services from '@services'
import coordinators from '@coordinators'
import presenters from '@presenters'


const mapStateToProps = state => {
  const { editTaggable, socialEntry, socialEntryDetailPanel } = state
  const {
    tagSymbol,
    tagSuggestions,
    selectedTagIndex,
  } = socialEntry
  const { mode } = socialEntryDetailPanel
  const activeTag = tagSuggestions && tagSuggestions[selectedTagIndex]

  return {
    activeTag,
    editTaggable,
    mode,
    tagSymbol,
  }
}

const mapDispatchToProps = () => {
  const { TaggablesService, UIService } = services

  const toggleMode = mode => UIService.SocialEntryDetailPanel.toggleMode(mode)
  const updateTaggable = (taggable) => TaggablesService.editTaggable(taggable)

  return {
    toggleMode,
    updateTaggable,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialEntryDetailPanel)

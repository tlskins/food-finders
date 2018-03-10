
export const loadHierarchy = ({ RestService, HierarchiesService, pResponseHierarchyTree }) => async className => {
  const response = await RestService.get('/hierarchy_trees', { class_name: className })
  const hierarchy = pResponseHierarchyTree( response[0] )
  HierarchiesService.addTree(className, hierarchy)
}

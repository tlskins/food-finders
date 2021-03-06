
export const LoadHierarchy = ({ RestService, HierarchiesService, pResponseHierarchyTree }) => async className => {
  const response = await RestService.get('/api/hierarchy_trees', { class_name: className })
  const hierarchy = pResponseHierarchyTree( response[0] )
  HierarchiesService.addTree(className, hierarchy)
}

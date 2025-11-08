export function getAllRoutes (routes) {
  let routesToReturn = []

  for (const route of routes) {
    if (route.children) {
      routesToReturn = routesToReturn.concat(getAllRoutes(route.children))
    } else {
      routesToReturn.push(route)
    }
  }

  return routesToReturn
}

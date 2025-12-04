export function isHasRole (user, roleCode) {
  const roles = new Set(user.roles.map(
    ({ code }) => code,
  ))

  return roles.has(roleCode)
}

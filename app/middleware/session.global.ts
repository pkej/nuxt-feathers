export default defineNuxtRouteMiddleware(async (to, _from) => {
  const auth = useAuthStore()

  void await auth.getPromise()

  // Allow 404 page to show
  if (!to.matched.length)
    return

  // if user is not logged in, redirect to '/' when not navigating to a public page.
  const publicRoutes = ['/']
  if (!auth.isAuthenticated || !auth.user) {
    if (!publicRoutes.includes(to.path))
      return navigateTo('/')
  }
})

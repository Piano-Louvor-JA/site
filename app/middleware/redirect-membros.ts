/**
 * Redirect /admin/membros → /admin/comunidade?tab=membros (PLAN §3.2).
 * O painel de membros foi absorvido pelo hub da Comunidade.
 */
export default defineNuxtRouteMiddleware(() => {
  return navigateTo({ path: '/admin/comunidade', query: { tab: 'membros' } })
})

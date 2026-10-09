/**
 * GET /api/admin/infra
 * Proxy para o endpoint de infraestrutura da VM Oracle (100.x = Tailscale).
 * Em dev o fetch direto funciona; em produção (Hostinger) só alcança via
 * esta server route. Cache de 60s, timeout de 10s, fallback 502 amigável.
 * Exige Firebase ID token válido (requireAuth como as demais rotas admin).
 */
export default defineEventHandler(async (event) => {
  await requireAuth(event)

  setHeader(event, 'cache-control', 'private, max-age=60')

  const token = process.env.INFRA_TOKEN
  if (!token) {
    throw createError({
      statusCode: 502,
      statusMessage: 'INFRA_TOKEN não configurado no servidor',
    })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10_000)

  try {
    const res = await $fetch.raw('http://100.124.203.116:3020/infra', {
      headers: { 'X-Infra-Token': token },
      signal: controller.signal,
      ignoreResponseError: true,
    })

    if (res.status !== 200 || !res._data) {
      throw createError({
        statusCode: 502,
        statusMessage: 'infra inacessível',
      })
    }

    return res._data
  } catch (error: unknown) {
    if (isError(error) && error.statusCode === 502) throw error
    // timeout (AbortError) ou rede inalcançável — nunca derruba o painel
    throw createError({
      statusCode: 502,
      statusMessage: 'infra inacessível',
    })
  } finally {
    clearTimeout(timer)
  }
})

# F1 — Diagnóstico: descarte silencioso de visitas sem país (`geo-visit.ts`)

Task: t_aa89d8a8 · Data: 2026-09-30 · Branch: `docs/f1-geo-diagnosis` (base `origin/staging` @ 0bd1b33)
Especificação-mestra: `piano-site-roadmap/SPEC.md` seção F1 (~linhas 168-240)

> Nota de contexto: os arquivos `server/utils/geo-visit.ts` e `server/utils/geo.ts` NÃO existem
> em `origin/staging` — foram introduzidos no commit `ae25d5c` (branch local não mesclada
> `feat/instalacoes-dinamicas-f0`, que alimenta os PRs #59/#61). As refs de linha abaixo citam
> `ae25d5c` (código atual) e, quando aplicável, o diff do PR #59.

## 1. Caminho exato do descarte

`server/middleware/geo-telemetry.ts` → `recordGeoVisit(event)` a cada request:

1. `server/utils/geo.ts:26-37` — `getCountryFromEvent(event)` itera `COUNTRY_HEADERS`
   (geo.ts:13-18). Nenhum header presente/validado ⇒ retorna `'unknown'`.
2. `server/utils/geo-visit.ts:30-31` — `if (country === 'unknown') return`
   **← PONTO DO DESCARTE**. Sem log, sem contador, sem métrica: perda 100% silenciosa.
3. Guardas anteriores que também desligam a coleta sem sinal: `!config.geoSalt` ⇒ `return`
   (geo-visit.ts:24-25, pré-PR#59; PR #59 troca por fallback unsalted), e `!ip` ⇒ `return`
   (geo-visit.ts:33-34).

Ou seja: qualquer requisição sem header de país (ou sem `GEO_SALT` na versão em staging)
nunca chega ao Firestore `geoStats/{dia}` — exatamente o card "Audiência por País" vazio.

## 2. Headers aceitos hoje pelo código

| Header | Origem | Em staging (ae25d5c) | No PR #59 |
|---|---|---|---|
| `cf-ipcountry` | Cloudflare | sim | sim |
| `x-vercel-ip-country` | Vercel | sim | sim |
| `x-geo-country` | proxy custom | sim | sim |
| `x-hcdn-country` | Hostinger CDN | **não** | **sim (novo)** |
| `x-visitor-country` | genérico | **não** | **sim (novo)** |

Validação por header (geo.ts:29-33): primeiro valor se array, deve ter exatamente 2 chars,
não pode ser `XX`/`T1`, normalizado para uppercase.

## 3. Evidências de runtime (produção, pianolouvorja.com.br — 2026-09-30)

O DEPLOY.md documenta que **não há URL pública de staging** (item 27: "URL pública de
staging ainda não está documentada"), então a verificação foi contra produção, atrás da
mesma Hostinger/CDN:

```
$ curl -sI https://pianolouvorja.com.br   (3 requisições)
server: hcdn
platform: hostinger
panel: hpanel
x-hcdn-request-id: ...-asc-edge11/12/13
x-hcdn-cache-status: DYNAMIC
x-hcdn-upstream-rt: 0.004-0.009
```

- Confirmado: o site está atrás do **Hostinger CDN (`server: hcdn`)**.
- **Nenhum header de país** (`x-hcdn-country`, `cf-ipcountry`, `x-vercel-ip-country`,
  `x-geo-country`) aparece em nenhuma resposta — resposta não prova o request, mas ver
  abaixo.
- Fonte oficial Hostinger (docs "Visitor IP addresses in logs and analytics"): o CDN deles
  repassa ao origin **somente `X-Forwarded-For` e `X-Real-IP`** — a documentação da
  Hostinger não menciona NENHUM header de geolocalização/país injetado pelo hcdn.
- http.dev (X-Hcdn-* expert guide) lista o set completo de headers hcdn conhecidos
  (request-id, cache-status, upstream-rt) — sem header de país documentado.

## 4. Veredito — H1

**H1 CONFIRMADA.** Em produção (Hostinger CDN) nenhuma requisição chega ao Nitro com um
header de país aceito pelo código em staging; `getCountryFromEvent()` retorna `'unknown'`
e `geo-visit.ts:31` descarta a visita silenciosamente. O card "Audiência por País" nunca
popula. Mesmo o PR #59 (que adiciona `x-hcdn-country`) **não desbloqueia sozinho**: não há
evidência documental de que o hcdn injete esse header — o header foi adicionado
especulativamente.

Agravante: `x-hcdn-cache-status: DYNAMIC` no HTML sugere que páginas dinâmicas atravessam o
CDN, mas o CDN não enriquece o request com geo.

## 5. Ponto de mudança que desbloquearia o card

Nenhuma mudança só no header-list resolve, porque a fonte (hcdn) não emite país. Opções,
em ordem de custo:

1. **GeoIP server-side no origin (recomendado)**: como `getClientIp()` já extrai o IP real
   de `x-forwarded-for`/`x-real-ip` (geo.ts:40-53 — headers que o hcdn GARANTE repassar),
   adicionar um lookup GeoIP (MaxMind GeoLite2 local, ou API gratuita tipo ipapi) quando
   todos os headers de país falharem, com cache. Mudança pontual: `getCountryFromEvent()`
   em `server/utils/geo.ts:26` passa a ser async com fallback.
2. **Colocar Cloudflare na frente** do domínio (proxy laranja): o CF injeta
   `cf-ipcountry` gratuitamente e o código atual já o lê (primeiro da lista). Custo zero de
   código, custo operacional de DNS.
3. Confirmar com o suporte Hostinger se existe variante/config do hcdn que injeta
   `x-hcdn-country` (mantém o PR #59 válido caso exista).

Além disso: trocar o `return` silencioso por um contador/métrica de `unknown` para que uma
regressão futura seja visível no dashboard.

## 6. Evidências de código (refs arquivo:linha @ ae25d5c)

- Descarte: `server/utils/geo-visit.ts:30-31` (`if (country === 'unknown') return`)
- Guard GEO_SALT: `server/utils/geo-visit.ts:24-25`
- Header list: `server/utils/geo.ts:13-18`; parser: `geo.ts:26-37`
- IP real (via XFF/X-Real-IP, já funcional atrás do hcdn): `geo.ts:40-53`
- Middleware que dispara: `server/middleware/geo-telemetry.ts:1`
- Consumo no dashboard: `server/api/admin/geo.get.ts`, `app/pages/admin/index.vue`

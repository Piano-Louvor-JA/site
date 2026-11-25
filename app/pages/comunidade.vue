<script setup lang="ts">
  import { useRoster, type RosterMember, type RosterRole } from '~/composables/useRoster'

  /**
   * /comunidade — o corpo vivo do projeto (SPEC Comunidade Orgânica D3):
   * devs/testadores/conteúdo aprovados agrupados por role, lendo o roster
   * público da API (client-side direto — site é SSG, sem Nitro route).
   * Dedupe visual por member id; selos de todas as roles do membro.
   */

  const { t } = useI18n()

  useAppHead({
    title: t('comunidade.title'),
    description: t('comunidade.subtitle'),
  })

  const ROLE_ORDER: RosterRole[] = ['staff', 'dev', 'tester', 'conteudo', 'curador']

  const rosters = {
    staff: useRoster('staff'),
    dev: useRoster('dev'),
    tester: useRoster('tester'),
    conteudo: useRoster('conteudo'),
    curador: useRoster('curador'),
  }

  const anyPending = computed(() => Object.values(rosters).some((r) => r.pending.value))
  const allFailed = computed(
    () =>
      !anyPending.value &&
      Object.values(rosters).length > 0 &&
      Object.values(rosters).every((r) => r.error.value),
  )

  /** Membros únicos por id preservando todas as roles (AC2: multi-role). */
  const uniqueMembers = computed<Map<string, RosterMember>>(() => {
    const map = new Map<string, RosterMember>()
    for (const role of ROLE_ORDER) {
      for (const m of rosters[role].members.value) {
        const existing = map.get(m.id)
        if (existing) {
          const roles = new Set([...existing.roles, ...m.roles])
          existing.roles = [...roles]
        } else {
          map.set(m.id, { ...m, roles: [...m.roles] })
        }
      }
    }
    return map
  })

  const sections = computed(() =>
    ROLE_ORDER.map((role) => ({
      role,
      // dedupe visual por member id: membro multi-role aparece uma vez só,
      // na seção da sua role primária (primeira na ordem ROLE_ORDER)
      members: [...uniqueMembers.value.values()].filter(
        (m) => ROLE_ORDER.find((r) => m.roles.includes(r)) === role,
      ),
    })),
  )

  const roleIcon: Record<RosterRole, string> = {
    staff: 'ti ti-users-group',
    dev: 'ti ti-code',
    tester: 'ti ti-bug',
    conteudo: 'ti ti-pencil',
    curador: 'ti ti-star',
  }

  function initials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
  }

  function memberHref(m: RosterMember): string | null {
    return m.github ? `https://github.com/${m.github}` : null
  }
</script>

<template>
  <section class="comunidade">
    <div class="comunidade__container">
      <div class="comunidade__header">
        <span class="comunidade__eyebrow">{{ $t('comunidade.eyebrow') }}</span>
        <h1 data-testid="comunidade-title" class="comunidade__title">
          {{ $t('comunidade.title') }}
        </h1>
        <p class="comunidade__subtitle">
          {{ $t('comunidade.subtitle') }}
        </p>
      </div>

      <div v-if="allFailed" data-testid="comunidade-error" class="comunidade__error" role="status">
        {{ $t('comunidade.error') }}
      </div>

      <template v-else>
        <div
          v-for="section in sections"
          v-show="!anyPending && section.members.length > 0"
          :key="section.role"
          class="comunidade__section"
          :aria-label="$t(`comunidade.roles.${section.role}`)"
        >
          <h2 class="comunidade__section-title">
            <i :class="roleIcon[section.role]" aria-hidden="true" />
            {{ $t(`comunidade.roles.${section.role}`) }}
          </h2>
          <ul class="comunidade__grid">
            <li
              v-for="member in section.members"
              :key="`${section.role}-${member.id}`"
              :data-member-id="member.id"
              class="comunidade__card"
            >
              <img
                v-if="member.avatar_url"
                :src="member.avatar_url"
                :alt="$t('comunidade.avatarAlt', { name: member.name })"
                class="comunidade__avatar"
                width="64"
                height="64"
                loading="lazy"
              />
              <span v-else class="comunidade__initials" aria-hidden="true">
                {{ initials(member.name) }}
              </span>
              <div class="comunidade__info">
                <span class="comunidade__name">{{ member.name }}</span>
                <span class="comunidade__badges">
                  <span
                    v-for="role in member.roles"
                    :key="role"
                    class="comunidade__badge"
                    :class="`comunidade__badge--${role}`"
                  >
                    {{ $t(`comunidade.roles.${role}`) }}
                  </span>
                </span>
              </div>
              <a
                v-if="memberHref(member)"
                :href="memberHref(member) ?? '#'"
                class="comunidade__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i class="ti ti-brand-github" aria-hidden="true" />
                <span class="sr-only">{{ $t('comunidade.profile') }}</span>
              </a>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .comunidade {
    padding: 6rem 1.5rem;

    &__container {
      max-width: 1100px;
      margin: 0 auto;
    }

    &__header {
      text-align: center;
      margin-bottom: 3rem;
    }

    &__eyebrow {
      display: block;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--accent, #e0895a);
      margin-bottom: 0.5rem;
    }

    &__title {
      font-size: clamp(1.8rem, 4vw, 2.6rem);
      margin: 0 0 0.75rem;
    }

    &__subtitle {
      max-width: 640px;
      margin: 0 auto;
      opacity: 0.8;
    }

    &__error {
      text-align: center;
      opacity: 0.7;
      padding: 2rem 0;
    }

    &__section {
      margin-bottom: 2.5rem;
    }

    &__section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.15rem;
      margin: 0 0 1rem;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &__card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border: 1px solid rgba(128, 128, 128, 0.25);
      border-radius: 12px;
      padding: 0.85rem;
    }

    &__avatar {
      border-radius: 50%;
      width: 64px;
      height: 64px;
      object-fit: cover;
    }

    &__initials {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      font-weight: 700;
      background: rgba(128, 128, 128, 0.2);
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-width: 0;
      flex: 1;
    }

    &__name {
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
    }

    &__badge {
      font-size: 0.68rem;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      border: 1px solid rgba(128, 128, 128, 0.35);
      opacity: 0.9;

      &--staff {
        border-color: var(--accent, #e0895a);
      }
    }

    &__link {
      color: inherit;
      opacity: 0.75;

      &:hover {
        opacity: 1;
      }
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .comunidade {
      padding: 4rem 1rem;
    }
  }
</style>

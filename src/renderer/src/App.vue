<script setup>
import { computed, ref } from 'vue'
import { availableLanguages, useSettings } from '@/stores/settings'
import { useTabStore } from '@/stores/tabs'

const { activeTab, tabs, tools, openTool, closeTab, activateTab } = useTabStore()
const { settings, t, setLanguage, resetSettings } = useSettings()

const searchText = ref('')
const activePanel = ref('')

const groupedTools = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()
  const filteredTools = tools.filter((tool) => {
    if (!keyword) return true

    return [t(tool.titleKey), t(tool.categoryKey), ...(tool.keywords || [])].some((item) =>
      String(item).toLowerCase().includes(keyword)
    )
  })

  return filteredTools.reduce((groups, tool) => {
    const categoryName = t(tool.categoryKey)
    const exists = groups.find((group) => group.name === categoryName)

    if (exists) {
      exists.items.push(tool)
    } else {
      groups.push({ name: categoryName, items: [tool] })
    }

    return groups
  }, [])
})

function togglePanel(panelName) {
  activePanel.value = activePanel.value === panelName ? '' : panelName
}

function chooseLanguage(language) {
  setLanguage(language)
  activePanel.value = ''
}
</script>

<template>
  <div class="app-shell" :class="{ 'compact-sidebar': settings.compactSidebar }">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">I</div>
        <div>
          <h1>Imino</h1>
          <p>Local Toolbox</p>
        </div>
      </div>

      <label class="tool-search">
        <span>{{ t('app.search.label') }}</span>
        <input v-model="searchText" type="search" :placeholder="t('app.search.placeholder')" />
      </label>

      <nav class="tool-list" aria-label="Tools">
        <template v-if="groupedTools.length">
          <section v-for="group in groupedTools" :key="group.name" class="tool-group">
            <h2>{{ group.name }}</h2>
            <button
              v-for="tool in group.items"
              :key="tool.id"
              type="button"
              class="tool-button"
              :class="{ active: activeTab?.id === tool.id }"
              @click="openTool(tool)"
            >
              <span class="tool-icon">{{ tool.icon }}</span>
              <span>{{ t(tool.titleKey) }}</span>
            </button>
          </section>
        </template>

        <p v-else class="empty-tools">{{ t('app.tools.empty') }}</p>
      </nav>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div class="tabbar">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="tab"
            :class="{ active: activeTab?.id === tab.id }"
            @click="activateTab(tab.id)"
          >
            <span class="tab-title">{{ t(tab.titleKey) }}</span>
            <span
              v-if="tab.closable"
              class="tab-close"
              role="button"
              tabindex="0"
              :aria-label="t('app.tab.close')"
              @click.stop="closeTab(tab.id)"
              @keydown.enter.stop="closeTab(tab.id)"
            >
              x
            </span>
          </button>
        </div>

        <div class="top-actions">
          <button
            type="button"
            class="icon-button"
            :class="{ active: activePanel === 'language' }"
            :title="t('app.language')"
            @click="togglePanel('language')"
          >
            文
          </button>
          <button
            type="button"
            class="icon-button"
            :class="{ active: activePanel === 'settings' }"
            :title="t('app.settings')"
            @click="togglePanel('settings')"
          >
            ⚙
          </button>

          <div v-if="activePanel === 'language'" class="floating-panel language-panel">
            <h2>{{ t('app.language') }}</h2>
            <button
              v-for="language in availableLanguages"
              :key="language.value"
              type="button"
              class="panel-row"
              :class="{ selected: settings.language === language.value }"
              @click="chooseLanguage(language.value)"
            >
              {{ language.label }}
            </button>
          </div>

          <div v-if="activePanel === 'settings'" class="floating-panel settings-panel">
            <div class="panel-title-row">
              <h2>{{ t('app.settings.title') }}</h2>
              <button type="button" class="panel-close" @click="activePanel = ''">x</button>
            </div>

            <label class="setting-field">
              <span>{{ t('app.settings.language') }}</span>
              <select v-model="settings.language">
                <option v-for="language in availableLanguages" :key="language.value" :value="language.value">
                  {{ language.label }}
                </option>
              </select>
            </label>

            <label class="setting-check">
              <input v-model="settings.compactSidebar" type="checkbox" />
              <span>{{ t('app.settings.compactSidebar') }}</span>
            </label>

            <label class="setting-check">
              <input v-model="settings.autoLoadSystemInfo" type="checkbox" />
              <span>{{ t('app.settings.autoLoadSystemInfo') }}</span>
            </label>

            <button type="button" class="secondary-button" @click="resetSettings">
              {{ t('app.settings.reset') }}
            </button>
          </div>
        </div>
      </header>

      <main class="content">
        <KeepAlive>
          <component :is="activeTab?.component" v-if="activeTab" :key="activeTab.id" />
        </KeepAlive>
      </main>
    </section>
  </div>
</template>

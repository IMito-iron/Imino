<script setup>
import { computed, onMounted, ref } from 'vue'
import { useSettings } from '@/stores/settings'

const { settings, t } = useSettings()

const loading = ref(false)
const info = ref(null)
const error = ref('')
const copyStatus = ref('')

const displayText = computed(() => {
  if (info.value) return JSON.stringify(info.value, null, 2)
  if (error.value) return error.value
  return ''
})

async function loadSystemInfo() {
  loading.value = true
  error.value = ''
  info.value = null
  copyStatus.value = ''

  try {
    const baseUrl = await window.iminoAPI?.backend?.getBaseUrl?.()
    const response = await fetch(`${baseUrl}/api/system/info`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    info.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? `${t('system.error')}: ${err.message}` : t('system.error')
  } finally {
    loading.value = false
  }
}

async function copyResult() {
  if (!displayText.value) return

  await window.iminoAPI?.clipboard?.writeText?.(displayText.value)
  copyStatus.value = t('common.copied')
}

function clearAll() {
  info.value = null
  error.value = ''
  copyStatus.value = ''
}

onMounted(() => {
  if (settings.autoLoadSystemInfo) {
    loadSystemInfo()
  }
})
</script>

<template>
  <section class="page tool-page">
    <div class="page-heading compact">
      <h2>{{ t('tool.system.title') }}</h2>
      <p>{{ t('system.description') }}</p>
    </div>

    <div class="tool-actions">
      <button type="button" class="primary-button" :disabled="loading" @click="loadSystemInfo">
        {{ loading ? t('common.loading') : t('common.refresh') }}
      </button>
      <button type="button" class="secondary-button" :disabled="!displayText" @click="copyResult">
        {{ t('common.copyResult') }}
      </button>
      <button type="button" class="secondary-button" :disabled="!displayText" @click="clearAll">
        {{ t('common.clear') }}
      </button>
      <span v-if="copyStatus" class="action-status">{{ copyStatus }}</span>
    </div>

    <pre v-if="info" class="result-box">{{ displayText }}</pre>
    <pre v-else-if="error" class="result-box error">{{ error }}</pre>
    <pre v-else class="result-box muted">{{ t('system.waiting') }}</pre>
  </section>
</template>

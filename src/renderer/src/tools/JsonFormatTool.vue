<script setup>
import { ref } from 'vue'
import { useSettings } from '@/stores/settings'

const { t } = useSettings()

const input = ref('{\n  "name": "Imino",\n  "type": "toolbox"\n}')
const output = ref('')
const error = ref('')
const copyStatus = ref('')

function formatJson() {
  error.value = ''
  output.value = ''
  copyStatus.value = ''

  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed, null, 2)
  } catch (err) {
    error.value = err instanceof Error ? `${t('json.error')}: ${err.message}` : t('json.error')
  }
}

async function copyResult() {
  const text = output.value || error.value
  if (!text) return

  await window.iminoAPI?.clipboard?.writeText?.(text)
  copyStatus.value = t('common.copied')
}

function clearAll() {
  input.value = ''
  output.value = ''
  error.value = ''
  copyStatus.value = ''
}
</script>

<template>
  <section class="page tool-page">
    <div class="page-heading compact">
      <h2>{{ t('tool.json.title') }}</h2>
      <p>{{ t('json.description') }}</p>
    </div>

    <div class="tool-actions">
      <button type="button" class="primary-button" @click="formatJson">{{ t('json.format') }}</button>
      <button type="button" class="secondary-button" :disabled="!output && !error" @click="copyResult">
        {{ t('common.copyResult') }}
      </button>
      <button type="button" class="secondary-button" @click="clearAll">{{ t('common.clear') }}</button>
      <span v-if="copyStatus" class="action-status">{{ copyStatus }}</span>
    </div>

    <div class="split-editor">
      <label class="editor-block">
        <span>{{ t('common.input') }}</span>
        <textarea v-model="input" spellcheck="false" />
      </label>

      <div class="editor-block">
        <span>{{ t('common.result') }}</span>
        <pre v-if="output" class="result-box">{{ output }}</pre>
        <pre v-else-if="error" class="result-box error">{{ error }}</pre>
        <pre v-else class="result-box muted">{{ t('json.emptyResult') }}</pre>
      </div>
    </div>
  </section>
</template>

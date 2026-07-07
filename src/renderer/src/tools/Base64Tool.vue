<script setup>
import { ref } from 'vue'
import { useSettings } from '@/stores/settings'

const { t } = useSettings()

const input = ref('Hello Imino')
const result = ref('')
const error = ref('')
const copyStatus = ref('')

function encodeText(value) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function decodeText(value) {
  const binary = atob(value.trim())
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function encodeBase64() {
  error.value = ''
  copyStatus.value = ''
  result.value = encodeText(input.value)
}

function decodeBase64() {
  error.value = ''
  result.value = ''
  copyStatus.value = ''

  try {
    result.value = decodeText(input.value)
  } catch (err) {
    error.value = err instanceof Error ? `${t('base64.decodeError')}: ${err.message}` : t('base64.decodeError')
  }
}

async function copyResult() {
  const text = result.value || error.value
  if (!text) return

  await window.iminoAPI?.clipboard?.writeText?.(text)
  copyStatus.value = t('common.copied')
}

function clearAll() {
  input.value = ''
  result.value = ''
  error.value = ''
  copyStatus.value = ''
}
</script>

<template>
  <section class="page tool-page">
    <div class="page-heading compact">
      <h2>{{ t('tool.base64.title') }}</h2>
      <p>{{ t('base64.description') }}</p>
    </div>

    <label class="field">
      <span>{{ t('common.input') }}</span>
      <textarea v-model="input" rows="8" spellcheck="false" />
    </label>

    <div class="tool-actions">
      <button type="button" class="primary-button" @click="encodeBase64">Encode</button>
      <button type="button" class="secondary-button" @click="decodeBase64">Decode</button>
      <button type="button" class="secondary-button" :disabled="!result && !error" @click="copyResult">
        {{ t('common.copyResult') }}
      </button>
      <button type="button" class="secondary-button" @click="clearAll">{{ t('common.clear') }}</button>
      <span v-if="copyStatus" class="action-status">{{ copyStatus }}</span>
    </div>

    <div class="editor-block full">
      <span>{{ t('common.result') }}</span>
      <pre v-if="result" class="result-box">{{ result }}</pre>
      <pre v-else-if="error" class="result-box error">{{ error }}</pre>
      <pre v-else class="result-box muted">{{ t('base64.emptyResult') }}</pre>
    </div>
  </section>
</template>

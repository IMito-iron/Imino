<script setup>
import { onMounted, ref } from 'vue'
import { useSettings } from '@/stores/settings'

const { t } = useSettings()
const version = ref('')

onMounted(async () => {
  version.value = await window.iminoAPI?.app?.getVersion?.()
})
</script>

<template>
  <section class="page">
    <div class="page-heading">
      <p class="eyebrow">{{ t('home.eyebrow') }}</p>
      <h2>Imino Local Toolbox</h2>
      <p>{{ t('home.description') }}</p>
    </div>

    <div class="home-grid">
      <div class="info-panel">
        <h3>{{ t('home.runtime.title') }}</h3>
        <p>{{ t('home.runtime.body') }}</p>
      </div>
      <div class="info-panel">
        <h3>{{ t('home.local.title') }}</h3>
        <p>{{ t('home.local.body') }}</p>
      </div>
      <div class="info-panel">
        <h3>{{ t('home.version') }}</h3>
        <p>{{ version || t('home.devVersion') }}</p>
      </div>
    </div>
  </section>
</template>

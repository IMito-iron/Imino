<script setup>
import { useSettings } from '@/stores/settings'

const { t } = useSettings()
</script>

<template>
  <section class="page">
    <div class="page-heading compact">
      <h2>{{ t('tool.file.title') }}</h2>
      <p>{{ t('file.placeholder') }}</p>
    </div>

    <div class="placeholder-panel">
      <h3>{{ t('file.future.title') }}</h3>
      <p>{{ t('file.future.body') }}</p>
    </div>
  </section>
</template>

import { computed, markRaw, reactive } from 'vue'
import HomeView from '@/views/HomeView.vue'
import JsonFormatTool from '@/tools/JsonFormatTool.vue'
import Base64Tool from '@/tools/Base64Tool.vue'
import FileTool from '@/tools/FileTool.vue'
import SystemInfoTool from '@/tools/SystemInfoTool.vue'

export const tools = [
  {
    id: 'json-format',
    titleKey: 'tool.json.title',
    categoryKey: 'category.text',
    keywords: ['json', 'format', 'formatter', '格式化', '文本', '整形'],
    icon: '{}',
    component: markRaw(JsonFormatTool)
  },
  {
    id: 'base64',
    titleKey: 'tool.base64.title',
    categoryKey: 'category.encode',
    keywords: ['base64', 'encode', 'decode', '编码', '解码', '変換'],
    icon: 'B64',
    component: markRaw(Base64Tool)
  },
  {
    id: 'file-tool',
    titleKey: 'tool.file.title',
    categoryKey: 'category.file',
    keywords: ['file', '文件', 'ファイル', 'hash', 'rename', '重命名'],
    icon: 'F',
    component: markRaw(FileTool)
  },
  {
    id: 'system-info',
    titleKey: 'tool.system.title',
    categoryKey: 'category.system',
    keywords: ['system', 'info', '系统', '信息', 'システム'],
    icon: 'i',
    component: markRaw(SystemInfoTool)
  }
]

const state = reactive({
  activeTabId: 'home',
  tabs: [
    {
      id: 'home',
      titleKey: 'tool.home.title',
      closable: false,
      component: markRaw(HomeView)
    }
  ]
})

const activeTab = computed(() => state.tabs.find((tab) => tab.id === state.activeTabId) || state.tabs[0])

function openTool(tool) {
  const exists = state.tabs.some((tab) => tab.id === tool.id)

  if (!exists) {
    state.tabs.push({
      id: tool.id,
      titleKey: tool.titleKey,
      closable: true,
      component: tool.component
    })
  }

  state.activeTabId = tool.id
}

function activateTab(tabId) {
  if (state.tabs.some((tab) => tab.id === tabId)) {
    state.activeTabId = tabId
  }
}

function closeTab(tabId) {
  const index = state.tabs.findIndex((tab) => tab.id === tabId)
  const tab = state.tabs[index]

  if (index === -1 || !tab.closable) return

  state.tabs.splice(index, 1)

  if (state.activeTabId === tabId) {
    const nextTab = state.tabs[index] || state.tabs[index - 1] || state.tabs[0]
    state.activeTabId = nextTab.id
  }
}

export function useTabStore() {
  return {
    tabs: state.tabs,
    tools,
    activeTab,
    openTool,
    activateTab,
    closeTab
  }
}

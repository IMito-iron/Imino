import { reactive, watch } from 'vue'

const STORAGE_KEY = 'imino.settings'

export const availableLanguages = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
  { value: 'ja-JP', label: '日本語' }
]

const defaultSettings = {
  language: 'zh-CN',
  compactSidebar: false,
  autoLoadSystemInfo: true
}

const messages = {
  'zh-CN': {
    'app.search.label': '搜索工具',
    'app.search.placeholder': '名称、分类、关键词',
    'app.tools.empty': '没有匹配的工具',
    'app.tab.close': '关闭标签',
    'app.language': '语言',
    'app.settings': '设置',
    'app.settings.title': '设置',
    'app.settings.language': '界面语言',
    'app.settings.compactSidebar': '紧凑侧边栏',
    'app.settings.autoLoadSystemInfo': '打开系统信息页时自动加载',
    'app.settings.reset': '恢复默认',
    'app.settings.close': '关闭',
    'common.input': '输入',
    'common.result': '结果',
    'common.copyResult': '复制结果',
    'common.clear': '清空',
    'common.copied': '已复制',
    'common.loading': '加载中',
    'common.refresh': '刷新',
    'tool.home.title': '首页',
    'tool.json.title': 'JSON 格式化',
    'tool.base64.title': 'Base64 转换',
    'tool.file.title': '文件工具',
    'tool.system.title': '系统信息',
    'category.text': '文本处理',
    'category.encode': '编码转换',
    'category.file': '文件处理',
    'category.system': '系统工具',
    'home.eyebrow': '本地离线工具箱',
    'home.description': '用于承载 JSON、编码转换、文件处理、系统信息等多个本地小工具页面。',
    'home.runtime.title': '运行方式',
    'home.runtime.body': '前端运行在 Electron 的 Chromium 渲染进程中，Python FastAPI 作为本地后端服务。',
    'home.local.title': '本地优先',
    'home.local.body': '后端 API 默认只监听 127.0.0.1:38765，适合单客户端离线桌面工具。',
    'home.version': '版本',
    'home.devVersion': '开发版本',
    'json.description': '输入 JSON 文本并格式化输出。',
    'json.format': '格式化',
    'json.emptyResult': '点击格式化后显示结果',
    'json.error': 'JSON 格式错误',
    'base64.description': '支持普通文本和中文内容的 Base64 编码与解码。',
    'base64.emptyResult': '转换结果会显示在这里',
    'base64.decodeError': 'Base64 解码失败',
    'file.placeholder': '文件工具待实现。',
    'file.future.title': '后续可扩展方向',
    'file.future.body': '可以在这里加入文件 Hash、批量重命名、文件编码检测、目录扫描等本地能力。',
    'system.description': '调用 Python FastAPI 本地后端接口。',
    'system.waiting': '等待后端返回系统信息',
    'system.error': '系统信息获取失败'
  },
  'en-US': {
    'app.search.label': 'Search tools',
    'app.search.placeholder': 'Name, category, keyword',
    'app.tools.empty': 'No matching tools',
    'app.tab.close': 'Close tab',
    'app.language': 'Language',
    'app.settings': 'Settings',
    'app.settings.title': 'Settings',
    'app.settings.language': 'Display language',
    'app.settings.compactSidebar': 'Compact sidebar',
    'app.settings.autoLoadSystemInfo': 'Auto-load system info page',
    'app.settings.reset': 'Reset defaults',
    'app.settings.close': 'Close',
    'common.input': 'Input',
    'common.result': 'Result',
    'common.copyResult': 'Copy result',
    'common.clear': 'Clear',
    'common.copied': 'Copied',
    'common.loading': 'Loading',
    'common.refresh': 'Refresh',
    'tool.home.title': 'Home',
    'tool.json.title': 'JSON Formatter',
    'tool.base64.title': 'Base64 Converter',
    'tool.file.title': 'File Tools',
    'tool.system.title': 'System Info',
    'category.text': 'Text',
    'category.encode': 'Encoding',
    'category.file': 'Files',
    'category.system': 'System',
    'home.eyebrow': 'Offline Local Toolbox',
    'home.description': 'A local toolbox shell for JSON, encoding conversion, file processing, system info and more.',
    'home.runtime.title': 'Runtime',
    'home.runtime.body': 'The UI runs in Electron Chromium, with Python FastAPI reserved as the local backend service.',
    'home.local.title': 'Local First',
    'home.local.body': 'Backend APIs listen on 127.0.0.1:38765 by default for single-client offline desktop use.',
    'home.version': 'Version',
    'home.devVersion': 'Development build',
    'json.description': 'Paste JSON text and format it.',
    'json.format': 'Format',
    'json.emptyResult': 'Result appears after formatting',
    'json.error': 'Invalid JSON',
    'base64.description': 'Encode and decode Base64 text, including Unicode text.',
    'base64.emptyResult': 'Converted result appears here',
    'base64.decodeError': 'Base64 decode failed',
    'file.placeholder': 'File tools are not implemented yet.',
    'file.future.title': 'Future ideas',
    'file.future.body': 'File hash, batch rename, encoding detection and directory scanning can be added here.',
    'system.description': 'Calls the local Python FastAPI backend.',
    'system.waiting': 'Waiting for system info',
    'system.error': 'Failed to load system info'
  },
  'ja-JP': {
    'app.search.label': 'ツール検索',
    'app.search.placeholder': '名前、分類、キーワード',
    'app.tools.empty': '一致するツールがありません',
    'app.tab.close': 'タブを閉じる',
    'app.language': '言語',
    'app.settings': '設定',
    'app.settings.title': '設定',
    'app.settings.language': '表示言語',
    'app.settings.compactSidebar': 'コンパクトなサイドバー',
    'app.settings.autoLoadSystemInfo': 'システム情報ページを自動読み込み',
    'app.settings.reset': '初期設定に戻す',
    'app.settings.close': '閉じる',
    'common.input': '入力',
    'common.result': '結果',
    'common.copyResult': '結果をコピー',
    'common.clear': 'クリア',
    'common.copied': 'コピーしました',
    'common.loading': '読み込み中',
    'common.refresh': '更新',
    'tool.home.title': 'ホーム',
    'tool.json.title': 'JSON 整形',
    'tool.base64.title': 'Base64 変換',
    'tool.file.title': 'ファイルツール',
    'tool.system.title': 'システム情報',
    'category.text': 'テキスト',
    'category.encode': 'エンコード',
    'category.file': 'ファイル',
    'category.system': 'システム',
    'home.eyebrow': 'ローカル・オフラインツールボックス',
    'home.description': 'JSON、エンコード変換、ファイル処理、システム情報などの小さなローカルツールをまとめます。',
    'home.runtime.title': '実行環境',
    'home.runtime.body': 'UI は Electron の Chromium で動作し、Python FastAPI をローカルバックエンドとして使います。',
    'home.local.title': 'ローカル優先',
    'home.local.body': 'バックエンド API は既定で 127.0.0.1:38765 のみを listen します。',
    'home.version': 'バージョン',
    'home.devVersion': '開発版',
    'json.description': 'JSON テキストを入力して整形します。',
    'json.format': '整形',
    'json.emptyResult': '整形後に結果が表示されます',
    'json.error': 'JSON 形式が正しくありません',
    'base64.description': '通常のテキストや日本語を Base64 でエンコード/デコードします。',
    'base64.emptyResult': '変換結果がここに表示されます',
    'base64.decodeError': 'Base64 のデコードに失敗しました',
    'file.placeholder': 'ファイルツールは未実装です。',
    'file.future.title': '今後の拡張',
    'file.future.body': 'ファイル Hash、一括リネーム、文字コード検出、ディレクトリスキャンなどを追加できます。',
    'system.description': 'ローカルの Python FastAPI バックエンドを呼び出します。',
    'system.waiting': 'システム情報を待っています',
    'system.error': 'システム情報の取得に失敗しました'
  }
}

function loadSettings() {
  try {
    return {
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    }
  } catch {
    return { ...defaultSettings }
  }
}

const settings = reactive(loadSettings())

watch(
  settings,
  () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  },
  { deep: true }
)

function setLanguage(language) {
  if (availableLanguages.some((item) => item.value === language)) {
    settings.language = language
  }
}

function resetSettings() {
  Object.assign(settings, defaultSettings)
}

function t(key, fallback = '') {
  return messages[settings.language]?.[key] || messages['zh-CN'][key] || fallback || key
}

export function useSettings() {
  return {
    settings,
    t,
    setLanguage,
    resetSettings
  }
}

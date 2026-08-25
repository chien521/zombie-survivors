import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

/**
 * Draco 解碼器設定見 src/game/draco-config.ts（改為由每個載入模型的模組各自
 * import 一次，而不是在進入點就把 @babylonjs/core 拉進首屏 bundle）。
 */

createApp(App).mount('#app');

import { DracoCompression } from '@babylonjs/core';

/**
 * 模型皆以 Draco 壓縮（gltf-transform），解碼器改用自帶檔（public/draco/，同源），
 * 不依賴外部 CDN。每個會載入 GLB 模型的模組都 import 這個檔案一次（side effect），
 * 確保無論走哪條載入路徑（遊戲／圖鑑／角色預覽）、無論被拆進哪個 chunk，設定都會在
 * 第一次 SceneLoader 呼叫前生效。
 */
DracoCompression.Configuration = {
  decoder: {
    wasmUrl: '/draco/draco_wasm_wrapper_gltf.js',
    wasmBinaryUrl: '/draco/draco_decoder_gltf.wasm',
    fallbackUrl: '/draco/draco_decoder_gltf.js',
  },
};

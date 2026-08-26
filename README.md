# 撐到最後 Last Stand 🧟

> 線上試玩（GitHub Pages，隨 main 分支自動部署，無全球排行榜）：**https://chien521.github.io/zombie-survivors/**
> 介紹網站（上游原作）：**https://craig7351.github.io/zombie-survivors/**
---

## 🎮 玩法

- 角色**自動**朝最近的殭屍攻擊，玩家只負責**走位**與**升級選擇**。
- 撿地上的經驗寶石 → 升等 → 從 3 個隨機升級中挑 1 個（每次升級回復 **30% 生命**）。
- 每 15 秒地圖生成**寶箱**（開啟給 10 秒隨機增益）與**回血道具**。
- **劇情模式**：每 30 秒登場一隻**殭屍王**，各有專屬招式；擊敗第 **8** 隻 → **破關**。
- **死鬥模式**：無盡波數，怪物隨波越來越強；每 5 波一隻王（Boss Rush），連殺有經驗加成、升級不設上限，撐到死為止比波數。
- 死亡或破關後依存活時間與擊殺數結算**金幣**，回主選單可解鎖角色與購買永久強化（roguelite meta，存於 localStorage）。

### 💀 死鬥模式機制
- **波數爬升**：每 30 秒一波，怪物血量／速度／傷害與密度持續上升（第 20 波後更陡）。
- **每波突變子**（每 3 波隨機）：⚡狂暴／🥚脆皮潮／🗿巨人化／🔥爆裂／🧫分裂潮／💀菁英潮／🧟爬行潮。
- **菁英怪**：更大更壯、掉更多經驗。
- **🩸 血潮**：定時 20 秒高密度狂暴時段，畫面轉紅、音樂轉急，撐過給寶箱。
- **⚖️ 祝福／詛咒**：定時跳出二選一（有得有失，如傷害大增但減傷下降）。
- **連殺 Combo**：不被打的連殺提升經驗獲取，受擊歸零。

### 操作
| | 桌機 | 手機 |
|---|---|---|
| 移動 | WASD／方向鍵 | 左下虛擬搖桿 |
| 跳躍（騰空可閃避接觸傷害） | 空白鍵 | 右下「跳躍」鈕 |
| 視角 | 左鍵拖曳旋轉、滾輪縮放 | 單指拖曳、雙指縮放 |
| 暫停 | ESC | 右上 ⏸ |
| 畫質 / 靜音 | 右上下拉 / 🔊 | 同 |
| 攻擊 | 自動 | 自動 |

移動為**相機相對**（轉動視角後上下左右會跟著畫面走）。

### 流程與頁面
- **首頁**：末日風格落地頁（漂浮多邊形背景）。需先輸入暱稱才能開始；顯示**目前遊玩人數**（即時）與本機累積統計（場次／時間／擊殺）。按鈕：▶ 遊戲開始／🏆 排行榜／🧟 怪物圖鑑／🌐 語言選擇。
- **模式選擇**：按「遊戲開始」後選 🧟 劇情 或 💀 死鬥。
- **難度選擇**：再選 5 種難度之一（死鬥模式為起始強度）。
- **角色選擇**：8 個角色即時 3D 預覽（播 idle、自轉）＋ 詳細介紹；含永久強化商店。
- **排行榜**：分 🧟劇情（破關榜／生存榜）與 💀死鬥（比分數）。已連結 VIVERSE 帳號時顯示 **VIVERSE 全球排行榜**（名次／玩家／數值，無難度分頁）；未連結（或非 VIVERSE 環境，如 GitHub Pages）時顯示**本機排行**（含難度分頁過濾）。
- **怪物圖鑑**：10 種殭屍 ＋ 8 隻王的模型縮圖與招式說明，另附**組合羈絆圖鑑**（見下方「🔗 升級羈絆」）。

---

## 🎚️ 難度（按「遊戲開始」後選擇）

| 難度 | 怪物血量 | 接觸傷害 | 王血量 | 金幣獎勵 |
|---|---|---|---|---|
| 😀 簡單（預設） | ×1 | ×1 | ×1 | ×1 |
| 🙂 普通 | ×1.5 | ×1.3 | ×1.5 | ×1.5 |
| 😬 困難 | ×2.2 | ×1.6 | ×2.2 | ×2.2 |
| 😱 夢魘 | ×3.5 | ×2 | ×3.5 | ×3.5 |
| 💀 地獄 | ×5 | ×2.6 | ×5 | ×5 |

難度同時影響敵人移速與隨時間的成長速率。

---

## 🔫 武器與升級

升級共 **25 種**；每次升級從尚未滿級者隨機抽 3 個。

**主武器（子彈，5）**：⚔️攻擊力(8)・⚡攻速(8)・🎯多重彈(4)・🔭射程(5)・💨彈速(5)

**額外武器（5，皆 10 階，吸血鬼倖存者風格）**
- 🪓 **環繞飛斧** — 旋轉斧頭繞身碰撞傷害（升級 +1 把並擴大環繞範圍）
- 🌀 **傷害光環** — 周身持續灼燒範圍
- ⚡ **連鎖閃電** — 定期電擊最近敵人並鋸齒連鎖
- 💥 **新星爆** — 定期向外擴張的範圍衝擊波
- 🪃 **回力鏢** — 長矛飛出再飛回、沿途貫穿

**群控（3）**：❄️減速光環・🐌時緩（全場永久減速）・🧊冰凍彈

**防禦／續航（4）**：🩸吸血（每秒回血有上限）・❤️‍🩹生命再生・🛡️護甲（減傷，上限 70%）・🔆能量護盾（定期擋一次）

**進攻修飾（3）**：💥暴擊・🎯穿透・🧨爆裂彈

**被動（5）**：👟移動速度・🦘跳躍強化・❤️最大生命・🧲拾取範圍・⭐經驗加成

### 🔗 升級羈絆（流派）
25 種升級各自屬於一個流派；同流派擁有的**不同升級種類數**達門檻，會一次性解鎖額外加成（不隨等級重複疊加），於遊戲中 📊 面板即時顯示已解鎖的羈絆。

| 流派 | 成員 | Lv1 門檻 / 加成 | Lv2 門檻 / 加成 |
|---|---|---|---|
| 🔴 嗜血 (berserker) | 攻擊力・攻速・暴擊・穿透・爆裂彈 | 擁有 3 種：暴擊率 +5% | 擁有 5 種（全）：暴擊倍率 +0.5 |
| 🔵 寒霜 (controller) | 連鎖閃電・減速光環・時緩・冰凍彈 | 擁有 2 種：冰凍機率 +5% | 擁有 4 種（全）：全場再減速 5% |
| 🟢 不屈 (guardian) | 最大生命・吸血・生命再生・護甲・能量護盾 | 擁有 3 種：傷害減免 +5% | 擁有 5 種（全）：每秒回血 +1 |
| 🟣 亂舞 (swarm) | 環繞飛斧・傷害光環・新星爆・回力鏢 | 擁有 2 種：所有副武器傷害 +1 | 擁有 4 種（全）：副武器傷害再 +1、環繞／光環範圍擴大 |
| 🟡 疾行 (scout) | 多重彈・射程・彈速・移動速度・跳躍強化・拾取範圍・經驗加成 | 擁有 4 種：經驗獲得 +10% | 擁有 7 種（全）：移速 +5%、拾取範圍 +30% |

死鬥模式的祝福／詛咒選項不屬於任何流派，不計入羈絆門檻。

### 🧬 組合羈絆（TFT 風格）
除了「流派」門檻外，另有 **10 種組合羈絆**：同時擁有下列特定升級（不看等級，只看是否擁有）即一次性解鎖加成或專屬效果。可在圖鑑頁的「組合羈絆」區塊查看每個組合的所需升級，遊戲中解鎖瞬間會跳出短暫提示。

| 組合 | 需求 | 效果 |
|---|---|---|
| 🧊 冰鍛 | 暴擊 + 冰凍彈 | 命中冰凍中的敵人必定暴擊 |
| 🥶 狂暴凍域 | 攻速 + 減速光環 | 對減速光環範圍內的敵人 +30% 傷害 |
| 🩸 吸血光環 | 吸血 + 傷害光環 | 光環造成的傷害額外回復生命 |
| 🛡️ 裝甲衛星 | 護甲 + 環繞飛斧 | 環繞武器啟動時，受到的傷害額外 −15% |
| 🎇 五武齊全 | 全部 5 種額外武器 | 副武器冷卻隨場上敵數增加而加速 |
| 🌩️ 連鎖新星 | 連鎖閃電 + 新星爆 | 每次連鎖跳躍額外引爆小範圍新星 |
| 🪃 回鏢閃電 | 回力鏢 + 連鎖閃電 | 回力鏢返航時對周圍敵人放電 |
| 🔥 貫穿灼痕 | 穿透 + 傷害光環 | 子彈穿透續飛時，灼燒穿透點周圍敵人 |
| 🧲 磁力新星 | 拾取範圍 + 新星爆 | 新星爆炸範圍內的經驗寶石會被吸向玩家 |
| ✨ 三修者 | 升級橫跨 3 種不同流派 | 每次升級瞬間對周圍敵人釋放衝擊波 |

### 🏦 羈絆傳承（永久解鎖）
角色選擇頁的商店除了「永久強化」外，另有**羈絆傳承**：花金幣永久解鎖後，之後每輪一開局就直接擁有該組合羈絆，不必再湊齊所需升級。目前開放 3 種：冰鍛傳承（💰400）、吸血光環傳承（💰400）、五武齊全傳承（💰600）。與永久強化各自獨立疊加，存於同一份 `localStorage`。

## 🧟 殭屍王（依序登場，打完第 8 隻即破關）
| # | 王 | 招式 |
|---|---|---|
| 1 | 巨胖殭屍 | 蓄力衝撞 |
| 2 | 狂暴肋骨怪 | 骨刺連射 |
| 3 | 斷臂巨怪 | 震地波 |
| 4 | 腐毒殭屍 | 毒池 |
| 5 | 海盜船長 | 手槍掃射 |
| 6 | 巨鯊 | 高速衝咬 |
| 7 | 骷髏法王 | 詛咒追蹤彈 |
| 8 | 深海觸手（最終王） | 深海彈幕（全方位） |

雜兵 10 種：基本殭屍、肋骨怪（快速）、胖殭屍（坦克）、斷臂殭屍、骷髏兵（不死）、無頭骷髏（遠程射手）、爬行殭屍（趴地爬行）、腐屍（天生爬行、渾身腐爛）、惡靈（懸空飛行、無視障礙物）、自爆殭屍（橘紅警示光，死亡時範圍傷害玩家）。怪群的移動動作（快跑／擺臂跑／邊跑邊砍／走路）會隨機混搭。

## 🐕 角色（各有不同起始攻擊）
| 角色 | 起始攻擊 | 特性 | 解鎖 |
|---|---|---|---|
| 🔫 工頭麥特 | 強化單發子彈 | 均衡，適合新手 | 預設 |
| 🧲 背包客尚恩 | 環繞飛斧 | 拾取廣、升級最快 | 💰200 |
| 👟 飛毛腿莉絲 | 三連發散射 | 高速、脆皮 | 💰300 |
| ⚡ 龐克山姆 | 極速連射 | 輸出爆發、略脆 | 💰300 |
| 🐶 巴哥犬 | 傷害光環 | 肉盾、血厚 | 💰350 |
| 🐕 德國狼犬 | 連鎖閃電 | 機動風箏、射程長 | 💰400 |
| 💥 特勤安妮 | 新星爆 | 範圍轟炸、清群強 | 💰400 |
| 🎯 西裝馬可 | 高暴擊（30%） | 暴擊爆發 | 💰450 |

僅工頭麥特預設解鎖，其餘以金幣於商店解鎖。

### 🎖️ 角色熟練度
每個角色各自累積「該角色的擊殺數／勝場數」（作弊/debug 局不計入，與排行榜同一套判定），達門檻解鎖被動加成，於角色選擇卡片上顯示進度／等級徽章：

| 等級 | 門檻 | 加成 |
|---|---|---|
| Lv1 | 累積擊殺 50 | 最大生命 +10 |
| Lv2 | 累積擊殺 200 | 移動速度 +5% |
| Lv3 | 累積勝場 10 | 該角色專屬加成（如工頭麥特／飛毛腿莉絲 +1 投射物、龐克山姆攻速再 −10%、背包客尚恩 +1 環繞飛斧、德國狼犬 +1 連鎖閃電、巴哥犬光環擴大增傷、特勤安妮新星爆 +2 傷害、西裝馬可暴擊率 +10%） |

熟練度存於本機 `localStorage`（`animal-survivors:meta:v2` 的 `mastery` 欄位），與永久強化商店並存、彼此獨立疊加。

---

## 🛠️ 技術
- **Vue 3**（`<script setup>`）+ **TypeScript**
- **Babylon.js 9** — 3D 場景、模型、骨架動畫、粒子、輝光（GlowLayer）
- **Vite** + **Tailwind CSS v4**
- Web Audio 程式合成音效與背景音樂（零音檔）；背景音樂 4 首隨擊敗王數**自動切換**（暗潮→獵殺→肅殺→狂亂）
- **畫質高／中／低**切換（右上下拉，即時生效）：調整算繪解析度、抗鋸齒、發光、可視距離；不影響玩法數值
- **後端**：Cloudflare Pages Functions + **D1（SQLite）** 提供累計統計／即時在線；同源 `/api`、全部 fail-soft（離線或無後端時自動回退本機資料，不影響遊戲本身可玩）。全球排行榜改由 **VIVERSE Leaderboard** 提供（見下方「VIVERSE 上架」），與 D1 無關
- 進度／本機排行存於 localStorage；**雙重部署**：Cloudflare Pages（含統計／在線後端）與 GitHub Pages（純靜態，透過 GitHub Actions 自動部署）。所有資源路徑（模型／API／Draco 解碼器）皆為**相對路徑**，兩種部署方式都能正確運作

### 模型最佳化
- 所有模型以 **Draco** 壓縮為二進位 `.glb`（37MB → 9.6MB，玩家首次下載省約 26MB）。
- Draco 解碼器**自帶**於 `public/draco/`（同源，不依賴外部 CDN），於 `src/main.ts` 設定。
- 重壓模型：`pnpm dlx @gltf-transform/cli draco in.gltf out.glb`（已加為 devDependency）。

### 效能架構
- 子彈／經驗寶石／地面以 **thin instances** 單一 draw call 繪製（SoA 型別陣列）。
- 怪海採**少量全動畫殭屍池**（預先 instantiate、循環啟用），兼顧動畫與效能。
- **空間雜湊網格**做鄰近查詢（分離、命中、接觸），避免 O(n²)。
- 投射物、經驗寶石、血跡貼片、王彈幕皆採**物件池**重用。
- 受擊白光用 per-mesh `renderOverlay`，不影響共用材質的其他單位。

---

## 🚀 開發與部署
```bash
pnpm install
pnpm dev      # 開發伺服器（--host，手機可連區網）
pnpm build    # vue-tsc 型別檢查 + vite 建置
pnpm preview  # 預覽 build 結果

# 部署（Cloudflare Pages，含 functions/ 後端；專案名稱見 wrangler.jsonc 的 name 欄位）
pnpm build
npx wrangler pages deploy dist --project-name=animal-survivors --branch=main

# D1 資料表（首次/變更時）
npx wrangler d1 execute <db-name> --file=./schema.sql --remote
```
SPA 轉址由 `public/_redirects` 處理（`/* /index.html 200`）；D1 綁定見 `wrangler.jsonc`。

### GitHub Pages（純靜態，無後端）
`.github/workflows/deploy-pages.yml` 會在每次 push 到 `main` 時自動 build 並部署到 GitHub Pages，不需要手動操作。首次啟用需在 repo 設定一次：
```bash
gh api -X POST repos/<owner>/<repo>/pages -f "build_type=workflow"
```
之後每次 push 到 `main` 都會自動重新部署。由於是純靜態託管，`functions/` 後端不會運作——統計／即時在線會自動 fail-soft 回退成本機資料；全球排行榜本來就僅限 VIVERSE World App 內可用，GitHub Pages 上一律顯示本機排行。遊戲本身完全可玩。

### VIVERSE 上架（另一條發布路徑，與 Cloudflare Pages／GitHub Pages 並存）
本專案整合了 **VIVERSE 登入（Auth）與全球排行榜（Leaderboard）**，做法與本機其他專案（graviflip / SURGE / puzzle_game）一致，詳見 `src/viverse/ViverseSession.ts`。此功能**只在建置時有設定 `VITE_VIVERSE_CLIENT_ID` 的版本上生效**（目前只有 VIVERSE 發布流程會設定）——Cloudflare Pages／GitHub Pages 兩個網頁 demo 都沒有全球排行榜，一律顯示本機排行；這是刻意的部署範圍決定，不是 bug。

**排行榜運作方式**：全球排行榜已完全改用 VIVERSE Leaderboard，取代原本的 Cloudflare D1 排行榜（D1 現在只剩統計／在線人數）。3 張榜對應 3 個 VIVERSE Studio API name（見 `.env.example`）：
| 榜 | API name（預設） | 數值 | Studio 排序方向 |
|---|---|---|---|
| 破關榜 | `clearedtime` | 破關秒數 | Ascending（越快越前） |
| 生存榜 | `survivaltime` | 存活秒數 | Descending（越久越前） |
| 死鬥榜 | `deathmatchscore` | 波數×1000＋擊殺＋秒數 | Descending（越高越前） |

⚠️ **上架前必須先在 VIVERSE Studio 手動建立這 3 張榜**（同一個 App ID 底下）：Numerical 型別、依上表設定排序方向、更新規則選「保留每位玩家最佳分數」（不要選累加型的 Append，時間/分數不該跨局累加）。API name 需與上表**完全一致**（含大小寫）。送出分數需先登入 VIVERSE 帳號（訪客無法上傳，但可瀏覽）；玩家在結算畫面點「🏆 上傳到 VIVERSE 排行榜」時，若尚未登入會先導轉登入，登入完成回來後自動續傳並跳到排行榜頁面確認。

```bash
# 1. 在 VIVERSE Studio 建立 World App，複製 App ID，填入 .env
cp .env.example .env   # 編輯 VITE_VIVERSE_CLIENT_ID=<App ID>（3 個排行榜 API name 已有預設值，同上表）

# 2. 建置並驗證
pnpm build
pnpm verify:publish    # 檢查 dist/ 已內嵌正確 App ID、無佔位字串、路徑為相對路徑

# 3. 上架（需先 npm install -g @viverse/cli 並 viverse-cli auth login）
viverse-cli app publish ./dist --app-id <App ID>
```
本機開發（`pnpm dev`）沒有 HTTPS／註冊過的 redirect URI，VIVERSE 登入預期會逾時並自動回退成「僅平台內可用」狀態，不影響遊戲本身可玩——這是預期行為，不是 bug。

## 📁 專案結構
```
src/
├─ game/
│  ├─ game.ts          # 主迴圈：玩家、相機、生成導演、碰撞、升級、王、道具、音樂分段
│  ├─ zombie-horde.ts / enemy-system.ts  # 全動畫殭屍怪群（動畫池）、敵人邏輯
│  ├─ weapon-system.ts # 自動子彈（飛刀 thin instance）
│  ├─ extra-weapons.ts # 環繞飛斧／光環／閃電／新星／回力鏢
│  ├─ boss.ts          # 8 隻王與招式狀態機
│  ├─ boss-hazards.ts  # 王招式對玩家的傷害實體（彈幕/震波/毒池）
│  ├─ upgrades.ts      # RunState、25 種升級表、10 種組合羈絆（COMBO_SYNERGIES）
│  ├─ characters.ts / meta.ts / difficulty.ts  # 8 角色、roguelite meta（含羈絆傳承 LEGACY）、5 難度
│  ├─ deathmatch.ts                      # 死鬥無盡參數、突變子、計分
│  ├─ leaderboard.ts / api.ts            # 本機排行（VIVERSE 不可用時的回退）/統計、後端 API（統計/在線）
│  ├─ terrain.ts / ground-decals.ts      # 地面（柏油材質）、馬路與地面貼片
│  ├─ effects.ts / sound.ts / decals.ts  # 粒子、音效+背景音樂、血跡
│  ├─ spatial-grid.ts / obstacles.ts     # 空間網格、障礙碰撞
│  ├─ quality.ts                         # 畫質（高/中/低）設定
│  ├─ character-previews.ts / model-thumbs.ts  # 選單即時預覽 / 圖鑑縮圖
│  └─ model-loader.ts / gem-system.ts / input.ts / config.ts
├─ components/         # landing / mode / difficulty / leaderboard / bestiary / menu / hud / game-view / 各 modal
└─ App.vue
functions/api/         # Pages Functions：run / leaderboard / stats / heartbeat / online（僅 Cloudflare Pages 有效）
public/
├─ models/zombie/      # Draco 壓縮 .glb 模型（角色、殭屍、武器、道具）
├─ draco/              # 自帶 Draco 解碼器
└─ _redirects          # SPA fallback（僅 Cloudflare Pages 用）
schema.sql              # D1 資料表（stats / presence / online_hourly；runs、messages 為排行榜／留言板功能移除後的殘留資料表，未被使用）
docs/                   # 介紹網站（上游原作的 GitHub Pages，/docs；與本 fork 的遊戲本體部署是兩回事）
.github/workflows/      # deploy-pages.yml：push 到 main 自動建置並部署到本 fork 的 GitHub Pages
```
頁面流程：`landing` → `mode`（模式）→ `difficulty` → `menu`（角色選擇）→ `game`；另有 `leaderboard`、`bestiary` 分頁。

## 📝 更新紀錄（Changelog）

版本與更新紀錄的單一來源在 [src/changelog.ts](src/changelog.ts)；首頁第一次進入（或版本號變動後）會自動跳一次更新彈窗，點標題的版本徽章可隨時重看。發新版只要在 `CHANGELOG` 陣列最前面新增一筆，首頁徽章與彈窗會自動更新。

### v2.0 — 死鬥模式登場
- 💀 全新「死鬥模式」：無盡波數，怪物越來越強，比誰撐到最高波。
- 🌊 每 30 秒一波、每 5 波一隻王（Boss Rush）。
- 🎲 每波隨機突變子（狂暴／脆皮潮／巨人化／爆裂／分裂潮／菁英潮／爬行潮）、🩸 血潮狂暴時段、⚖️ 祝福/詛咒二選一、🔥 連殺加成、升級不設上限。
- 🏆 死鬥獨立排行榜（比波數分數），與劇情榜分流。
- ✨ 新增爬行殭屍、怪群移動動作多樣化、首頁線上人數歷史圖表、模型 Draco 壓縮（載入更快）。

> 更早的演進（換皮歷程、全球後端、排行榜難度等）詳見 git 紀錄與 [GAME.md](GAME.md)。

---

## 🎨 素材
3D 模型取自第三方低面數模型包（角色、殭屍、武器、場景道具），實際使用的檔案以 Draco 壓縮後放在 `public/models/zombie/`。原始素材包置於 `download/`，已 gitignore、不納入版控。換皮做法詳見 [GAME.md](GAME.md)。

**素材授權**：上游 repo 沒有留下每個模型檔案的來源／授權紀錄，本 fork 起新增 [docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md) 逐檔追蹤來源與授權狀態。目前已將 **6 個角色模型**＋**3 種武器道具**換成確認為 CC0 的素材（[Quaternius Ultimate Modular Men Pack](https://quaternius.com/packs/ultimatemodularcharacters.html)、[Frontend Pashtet Melee Weapon Pack](https://drxwat.itch.io/melee-weapon-pack)）。

進一步比對後確認：現有的殭屍／場景道具／血跡貼花／2 隻狗角色模型，幾乎全部（用 `gltf-transform inspect` 逐檔比對頂點數與包圍盒，皆精確吻合）都來自 [**Quaternius「Post Apocalypse Pack」**](https://poly.pizza/bundle/Post-Apocolypse-Pack-jg0We8Clu0)，極可能就是上游原作實際使用的素材包。其中多數為 CC0，少數（德國狼犬、巴哥犬角色與 2 種殭屍變體）為 **CC-BY**（可自由使用，但需標註來源）——見下方「素材致謝」。剩餘缺口（3 隻專屬王模型、2 種骷髏殭屍、卡車道具）於 [docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md) 中列為「unverified」，留待後續分批確認／尋源。

### 🙏 素材致謝
以下模型使用 [Quaternius](https://quaternius.com/) 的 CC-BY 3.0 素材（[Post Apocalypse Pack](https://poly.pizza/bundle/Post-Apocolypse-Pack-jg0We8Clu0)），依授權條款標註來源：
- `char_shepherd.glb`（德國狼犬角色）— "German Shepard" by Quaternius
- `char_pug.glb`（巴哥犬角色）— "Characters Pug" by Quaternius
- `zombie_ribcage.glb`（肋骨怪）— "Zombie half" by Quaternius
- `zombie_chubby.glb`（胖殭屍）、`zombie_arm.glb`（斷臂殭屍）— "Zombie" / "Big arm" by Quaternius（此包內同名模型有 CC0 與 CC-BY 兩種版本，本 fork 無法百分之百確認這兩個檔案對應哪個確切版本，故一律標註致謝以策安全）
- `zombie_half.glb`（腐屍）— "Animated Zombie" by Quaternius

授權全文：[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)

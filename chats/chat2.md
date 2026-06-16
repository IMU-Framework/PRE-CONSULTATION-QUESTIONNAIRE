# A4紙張版面優化

_Started 2026-05-27 13:53 UTC_

---

## User

把calculate內部試算單、線上諮詢服務報價單
的格式都改為compact，可以更動的包含各層級標題字級、內文字級、表格高度、區塊間距等。目標是列印/存PDF時，可以各放在一頁A4大小內。

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

我來把兩份單據改成 compact 版本，目標是各自能放進一頁 A4。設計策略：

1. 在兩份報價單根元素加上 `compact` 類別
2. 在 `calculator.css` 增加一組 compact 覆蓋規則：縮小標題、內文、表格列高、區塊間距、外距、簽名空白等
3. 列印時自動啟用

我會避免變更品牌色與整體版型，只調整尺度。

_[tool: str_replace_edit]_

Now add the compact CSS overrides to `calculator.css`:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

已套用 compact 模式到「內部試算單」與「線上諮詢服務報價單」。

**主要變動（都在 `calculator.css` 一個區塊內，方便日後個別微調）：**

- **紙張內距**：`64px 72px` → `22mm 18mm`（列印時自動切到 `4mm 2mm`）
- **標題字級**：H1 `40→22px`、H2 `24→15px`、section 標題 `20→13px`
- **內文**：`lead 14→10.5px`、`small 11→9.5px`、`eyebrow 10→9px`
- **表格**：cell padding `10×12 → 4×8`、字 `12.5→10.5px`、表頭 `10.5→9px`
- **區塊間距**：section margin-top `40→14px`、section-head margin-bottom `18→8px`
- **價格區**：total 字 `20→15px`、row padding `8→4px`
- **條款卡 / 簽名欄**：padding 與簽名空白都縮小
- **並排預覽**再加一層更緊湊的微調

列印 / 存 PDF 時會啟動更窄的 sheet 內距並加上 `page-break-inside: avoid`，目標是兩份單據各占一頁 A4。

若還想更緊（或某一項目偏小想放大），告訴我要動哪一塊，CSS 已分區方便個別調整。完成。等驗證 agent 回報實際畫面狀況。

## User

Verifier agent check completed

## Assistant

_[tool: str_replace_edit]_

驗證確認內部單 OK，客戶單超出約 79px。再緊一點。

_[tool: str_replace_edit]_

我來把條款 + 雙方確認整併成一個區塊，並用更節省空間的版型。

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

已調整：

- 合併「付款與服務條款」+「雙方確認」為單一區塊「**服務條款與雙方確認**」
- 採用左右並排：左側 4 條條款（更緊湊、單行說明），右側上下兩格簽認欄
- 條款字 10px、行高 1.5；簽認區放在同一個外框內，省下原本兩個獨立 section 的間距與標題已交給驗證 agent 確認尺寸。

## User

Apply a direct edit. In questionnaire.jsx (near line 396, <b>): change the text from "自主發包性質確認" to "服務性質確認".
<mentioned-element>
react:    Questionnaire
dom:      body › div#root › div.hf › div.sheet › section.section › div.stack › label.ack › div.body › b
text:     "自主發包性質確認"
children: text
selector: #root .section label:nth-child(1) b
id:       cc-5
</mentioned-element>

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: str_replace_edit]_

已將「自主發包性質確認」改為「服務性質確認」。

## User

問卷與計算機/報價單
資訊內容有沒有什麼mismatch

## Assistant

_[tool: read_file]_

_[tool: grep]_

我來檢查問卷與計算機之間的資訊對應是否一致。

我比對了 `questionnaire.jsx`（問卷與摘要產生）與 `calc-quotes.jsx`（解析、內部試算單、客戶報價單），整理出幾處不一致與遺漏，依重要性排序：

## 用詞 / 命名不一致

| 來源 | 用詞 |
|---|---|
| 問卷 Q5 題目 | 「本次諮詢的**重點主題**」 |
| 問卷摘要 | 「Q5 **諮詢重點**」 |
| 內部 / 客戶報價單 | 「**諮詢主題**」 |

→ 同一個欄位三種講法，建議統一為「**諮詢重點**」。

| 來源 | 服務名稱 |
|---|---|
| 問卷 ack-self | 「線上口頭諮詢顧問」 |
| 客戶報價單標題 | 「線上諮詢**服務**報價單」 |

→ 建議統一稱「線上諮詢顧問」。

## 規模係數的邏輯/敘述衝突

`SCALE_OPTS` 文案：
- 小型 S：「30 坪以下 **且** 10 人內」
- 中型 M：「31 – 100 坪 **或** 11 – 40 人」
- 大型 L：「100 坪以上 **或** 41 人以上」

但 `suggestScaleTier` 實際判定全部用「**或**」：
```
s>100 || h>40 → L
s>30  || h>10 → M
else → S
```
→ 程式邏輯是「只要任一條件超過就升級」。但小型 S 描述卻寫「且」，會讓人誤以為 28 坪 / 12 人會被歸 S（實際會被歸 M）。建議 S 也改為「30 坪以下 **且** 10 人內，否則升級」或直接統一為「或」邏輯敘述。

## 報價單沒有重述「客戶在問卷已簽認」的事項

問卷四項簽認：

1. ✅ **服務性質確認**（客戶自負後續發包）── 報價單**無對應**條款
2. ✅ **圖說費用確認**（諮詢費不含施工圖說）── 報價單條款雖提到「另案報價」但沒重述客戶已簽認
3. ✅ **限時通訊確認** ── 對應報價單「服務範圍」
4. ✅ **免責聲明** ── 對應報價單「免責聲明」

→ 1、2 兩項建議補進報價單的條款區（合約效力）。

## 客戶填問卷時不知道、報價單才出現的資訊

- **諮詢時段**「週一 ～ 週四 14:00 – 18:00」── 問卷完全沒提及；客戶若無法配合會白填
- **預約方式**「提前二天以 LINE 預約」── 問卷沒提
- **報價有效期 14 天** ── 問卷沒提

→ 建議在問卷的「服務模式」卡片或須知中先揭露時段限制。

## 問卷有收、報價單沒呈現的欄位

- **Q4 可提供資料**（內部係數判定的依據之一，內部試算單沒列出來，A/B 判斷追溯不到原始資料）
- **Q6 空間機能** ── 收完完全沒用
- **Q7 時程**（開工日 / 進駐日）── 完全沒呈現；對排程與報價有效期判斷是關鍵資訊

→ 建議至少在**內部試算單**列出 Q4 / Q6 / Q7 摘要，作為判定依據留底。

## 基礎時數的彈性 vs. 文案

- 問卷固定「**基礎時數：5 小時（必購）**」
- 計算機 `baseHours` 可改任意數字
- 客戶版報價單文案仍寫「**最低 5 小時**」

→ 若計算機把基礎改成 6 或 8 小時，客戶看到的「最低 5 小時」就會錯。建議：
- 文案改為「**最低 5 小時起**」並動態顯示實際時數，或
- 鎖死 baseHours = 5，只用加購時數調整

## 小問題

- 解析正則只接受半形冒號或全形冒號 `[：:]`，但問卷某些行用全形空格 `　　` 分隔 LINE / 電話 —— 目前處理正確，但建議 buildSummary 改用換行分行，更穩定。
- 內部試算單沒顯示「填表日期」，只顯示 issueDate；建議補上以便追蹤時間差。

---

要我直接動手修正嗎？建議優先順序：**(1) 用詞統一**、**(2) 規模係數描述**、**(3) 報價單補上 ack-self / ack-fee 條款**、**(4) 問卷揭露諮詢時段** —— 這四項最關鍵。

## User

諮詢時段和預約方式有，就在服務模式的A裡有說明。
報價有效期限不需要在問卷中提及。
Q4 Q6 Q7可在calculator中補足。
問卷四項簽認和報價單的簽認，要對齊。
其他有沒有"用詞"要對齊的？

## Assistant

_[tool: read_file]_

確認 — 服務模式卡 A 已寫「週一至週四 14:00–18:00，提前二天以 LINE 預約」。✓

再深挖一次後，**用詞不一致**整理如下（已排除前次提到的「諮詢主題 / 重點主題 / 諮詢重點」與「線上口頭諮詢顧問 / 線上諮詢服務」）：

## 用詞對齊清單

| # | 問卷用詞 | 報價單 / 計算機用詞 | 建議 |
|---|---|---|---|
| 1 | 客戶**／**公司（全形斜線） | 客戶 **/** 公司（半形+空格） | 統一為「客戶／公司」 |
| 2 | 辦公室地址／商辦名稱 | 內部：「地址」；客戶版：「辦公室地址」 | 統一為「辦公室地址」 |
| 3 | **基礎諮詢時數**（最低**購買** 5 小時） | **基礎諮詢時數包**（最低 5 小時） | 拿掉「包」字，並把「最低」改為「最低**購買** 5 小時」 |
| 4 | **彈性**加購時數（預計加購時數） | 加購時數 | 加回「彈性」二字，與問卷描述一致 |
| 5 | 圖說專案 · 細部大樣、BOM 表、放樣圖 | 圖說專案 · 大樣圖 / BOM / 放樣圖 | 統一為「**細部大樣、BOM 表、放樣圖**」 |
| 6 | 諮詢時段為**週一至週四 14:00–18:00** | 客戶版：**週一 ～ 週四 14:00 – 18:00** | 統一為「週一**至**週四 14:00–18:00」（無空格、用 en-dash） |
| 7 | **限時通訊**確認（ack 標題） | **服務範圍**（條款） | 既然要做四項簽認對齊，這條的標題該統一 |
| 8 | （無此名詞，section 副標叫 Readiness／中文「客戶狀態與資料準備度」） | 內部試算單：「**客戶**係數」 | 改名為「**準備度**係數」，與問卷副標及內部判定依據（Q4 資料齊不齊）對齊 |
| 9 | 同上 — 客戶狀態與資料準備度（**Readiness**） | 內部試算 / 計算機 用「規模係數」「客戶係數」沒有英文副標 | 若要呼應問卷，可在內部試算單係數區附上 Scale / Readiness 英文小字 |

## 隱含的「邏輯不一致」也順便標出

> 問卷服務模式 callout 寫：「費率將依**規模、準備度、需求明確度**微幅調整。」  
> 但 calculator 實際只有兩個係數：**規模係數 ×　客戶（準備度）係數**。  
> Q6 / Q7（**需求明確度** / Spec）目前沒參與計費，會讓問卷的承諾跟實際計費邏輯不對齊。

要解法擇一：
- **A：把 Q6 / Q7 真的納入計費**，例如多一個「明確度係數」（×1.0 / ×1.1）
- **B：問卷 callout 改為「規模、準備度」兩項**，把「需求明確度」改稱為「**參考資訊**」（協助會議準備但不影響定價）

---

我建議的下一步動作（如同意請告訴我，我會一次改完）：

1. 統一上述 1–7 點用詞
2. 內部試算單把「客戶係數」改名為「**準備度係數**」
3. 報價單四項條款 ↔ 問卷四項簽認**完全對齊**（標題、順序、文字）
4. 在計算機側欄補上 Q4 / Q6 / Q7 三個唯讀欄位（你之前說 Q4/6/7 在 calculator 補足）
5. 邏輯不一致：先採 **B 方案**（改問卷 callout 文案），是否同時實作 A 由你決定

## User

1~4 OK
5. 採用A

## Assistant

_[tool: grep]_

明白。我會依序：(1) 統一用詞、(2) 內部試算單係數重命名 + 加 Scale/Readiness/Spec 副標、(3) 報價單四項條款對齊問卷四項簽認、(4) 計算機補 Q4/Q6/Q7 欄位、(5) 新增「明確度係數」進入計費邏輯。

先讀 questionnaire 的時段寫法以做正確對齊：

_[tool: str_replace_edit]_

開始修改。先更新 `calc-quotes.jsx` —— 加上明確度係數、parser、計費模型，以及用詞統一。現在更新 InternalQuote（用詞統一、加第三個係數、Q4/Q6/Q7 顯示、費率推導公式）：

_[tool: str_replace_edit]_

現在更新 ClientQuote — 用詞統一、四項條款對齊問卷簽認：

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

現在 calculator.jsx — 加 Q4/Q6/Q7 欄位、明確度係數、parser 一併帶入：

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

完成所有 1–5 點。摘要：

**用詞統一**
- 客戶／公司、辦公室地址、諮詢重點、基礎諮詢時數（最低購買 5 小時）、彈性加購時數、細部大樣/BOM 表/放樣圖、週一至週四 14:00–18:00

**內部試算單**
- 客戶資訊新增 **Q4 可提供資料 / Q6 空間機能 / Q7 時程** 三列（作為係數判定依據留底）
- 係數區改為 **3 張卡**（A 規模 Scale / B 準備度 Readiness / C 明確度 Spec），含中英文副標
- 費率推導公式更新為 `baseRate × scale × readiness × spec = hourly`

**客戶報價單**
- 條款區改為**四項簽認**對齊問卷：服務性質 / 圖說費用 / 限時通訊 / 免責聲明（標題、順序、文字皆對齊）

**計算機側欄**
- ② 案件資訊新增 Q4 / Q6 / Q7 文字輸入（貼上問卷摘要會自動帶入）
- ③ 係數判定改為 3 個係數選擇器：規模 / 準備度 / **明確度**
- DEFAULTS 新增 `specTier: 'A'`，計算邏輯改為四項相乘已交付驗證，等回報實際尺寸與排版。

## User

Verifier agent check completed

## Assistant

驗證通過 — 三個係數卡、Q4/Q6/Q7 留底、四項簽認對齊、列印時兩份單據都能放進一頁 A4（內部 950px / 客戶 973px，距上限約 50–70px）。

## User

Q4 Q6 Q7 表頭的QX 小字不用出現

## Assistant

_[tool: str_replace_edit]_

已移除 Q4/Q6/Q7 小字標記。

## User

Apply 3 direct edits:
1. In questionnaire.jsx (near line 396, <b>): change the text from "限時通訊確認" to "通訊範圍".
<mentioned-element>
react:    Questionnaire
dom:      body › div#root › div.hf › div.sheet › section.section › div.stack › label.ack › div.body › b
text:     "限時通訊確認"
children: text
selector: #root .section label:nth-child(3) b
id:       cc-2
</mentioned-element>
2. In questionnaire.jsx (near line 396, <b>): change the text from "圖說費用確認" to "圖說費用".
<mentioned-element>
react:    Questionnaire
dom:      body › div#root › div.hf › div.sheet › section.section › div.stack › label.ack › div.body › b
text:     "圖說費用確認"
children: text
selector: #root .section label:nth-child(2) b
id:       cc-3
</mentioned-element>
3. In questionnaire.jsx (near line 396, <b>): change the text from "服務性質確認" to "服務性質".
<mentioned-element>
react:    Questionnaire
dom:      body › div#root › div.hf › div.sheet › section.section › div.stack › label.ack › div.body › b
text:     "服務性質確認"
children: text
selector: #root .section label:nth-child(1) b
id:       cc-4
</mentioned-element>

## Assistant

_[tool: str_replace_edit]_

同步更新報價單條款，保持對齊：

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

完成 — 問卷三個確認標題已改為「服務性質 / 圖說費用 / 通訊範圍」（移除「確認」二字），同時報價單條款的 ack-com 也同步從「限時通訊」更新為「通訊範圍」，保持對齊。

## User

把「時薪」中文都改成「費率」

## Assistant

_[tool: grep]_

_[tool: run_script]_

完成 — 共替換 15 處「時薪」→「費率」，涵蓋計算機、兩版報價單、舊版設計檔與 CSS 註解。

## User

現在有沒有不再使用的舊檔案

## Assistant

_[tool: list_files]_

_[tool: run_script]_

整理出來的依賴關係：

**現役（保留）**
- `Calculator.html` → `hifi.css`, `calculator.css`, `calc-quotes.jsx`, `calculator.jsx`
- `Questionnaire.html` → `hifi.css`, `questionnaire.jsx`

**舊版探索檔案（可刪）**

| HTML | 專屬 JSX |
|---|---|
| `Hi-Fi.html` | `hifi-onepager.jsx`, `hifi-quote.jsx` |
| `Quote.html` | `hifi-quote.jsx`（共用）、`quote-client.jsx` |
| `Wireframe.html` | `onepager.jsx`, `quote.jsx` |

這三個 HTML 都用 `design-canvas.jsx` 把多張板子並排展示，是早期設計探索的看板（含 wireframe / hi-fi / quote 兩版本草稿），目前 Calculator + Questionnaire 已是最終產出。

**建議刪除清單（共 9 個檔）**
- `Hi-Fi.html`、`Quote.html`、`Wireframe.html`
- `hifi-onepager.jsx`、`hifi-quote.jsx`、`quote-client.jsx`、`quote.jsx`、`onepager.jsx`、`design-canvas.jsx`

**繼續保留的共用檔**
- `hifi.css` — Calculator 與 Questionnaire 都還在使用

要我直接刪掉這 9 個嗎？或者你想保留某幾個當作參考？

## User

把hifi.css更名供production用
其他建議可刪除的檔案都放在"Archive"資料夾(或另建議資料夾名稱)

## Assistant


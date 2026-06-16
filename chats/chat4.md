# 報價單折扣價格編輯

_Started 2026-06-16 06:34 UTC_

---

## User

1. 客戶資訊、專案資訊 裡 補上一欄，帶入客戶的"填表日期"。盡量利用已經有的表格空間，或標題後方空間。

2. 由於我要提供客戶報價後的再折扣（專案優惠價），要顯示成「槓掉」原適用費率，後面(以IMU藍色)顯示折扣後價格。 所以左側的案件資訊手動編輯處，也給我一個可以填入優惠價格(先填折扣趴數或直接填單價，可相互來回影響)的文字框空間。

## Assistant

I'll start by reading the current Calculator.html to understand its structure before making changes.

_[tool: read_file]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

I have a full picture now. Let me make the edits. I'll handle both requests across `calc-quotes.jsx` (model + display) and `calculator.jsx` (form inputs).

Starting with the quote model and display logic in `calc-quotes.jsx`:

_[tool: str_replace_edit]_

Now the internal quote — add 填表日期 to the 客戶資訊 table, the discount line to 費率推導, and discounted unit cells:

_[tool: str_replace_edit]_

Now the client quote — 填表日期 in 專案資訊, the 服務費率 card with strikethrough/blue, and unit cells:

_[tool: str_replace_edit]_

Now `calculator.jsx` — defaults, parse mapping, form inputs, discount handlers, and the compact summary:

_[tool: str_replace_edit]_

Now add the discount handlers (after `m` is defined since they reference `m.hourly`):

_[tool: str_replace_edit]_

Let me verify it renders cleanly:

_[tool: show_html]_

_[tool: show_html]_

The 填表日期 field is in place. Let me verify the discount feature works end-to-end by setting a promo rate through the actual inputs:

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

The screenshot tool re-renders from top, making scroll capture unreliable. Let me verify the discount rendering by reading the DOM directly:

_[tool: eval_js]_

Both features work correctly: discount reprices everything (5 hr × NT$1,700 = NT$8,500 → total NT$8,925), strikethrough original + IMU-blue promo rate renders in the rate derivation, unit cells, and the headline rate card; the % and unit-price inputs interconvert (1,700 ⇄ 15% off); and 填表日期 appears in both the form and the quote tables.

_[tool: ready_for_verification]_

Done. Two changes landed:

**1. 填表日期** — Added a「客戶填表日期」欄位 to the form (一鍵帶入問卷會自動帶入客戶填表的日期), and surfaced it in both 客戶資訊（內部）與 專案資訊（客戶版）表格內，與辦公室地址同列，沿用既有表格空間。

**2. 專案優惠價（折讓）** — 在「④ 費用設定」加了一組互通的輸入框：填「折扣 %」會算出優惠單價，直接填「優惠後單價」也會反推折扣 %。報價上原費率以灰色槓掉、後方以 IMU 藍顯示折後價，並重新計算所有小計／稅／總額（費率推導、收費明細單價欄、客戶版費率卡、左側摘要皆同步）。

## User

delegte

## Assistant

You want that "SCALE · READINESS · SPEC" hint removed from the 係數判定 section header. Removing it:

_[tool: str_replace_edit]_

Removed the "SCALE · READINESS · SPEC" hint from the 係數判定 header.

_[tool: ready_for_verification]_

Done — the hint is gone, header now just reads「II 係數判定」.

## User

效果很好！
我要加入一個功能：
當有專案優惠價apply時，報價單號後面加一個後綴 (例如 '-discount' 但希望只要兩個大寫英文字母)

## Assistant

Good idea — I'll suffix the quote number with **`-DC`** (DisCount) whenever a promo price is active. Let me add a helper and apply it everywhere the quote number is shown.

_[tool: str_replace_edit]_

Both quote components already receive `m`, so the suffix will toggle correctly. Let me confirm it renders:

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

The iframe still has the pre-edit code. Let me reload and re-test:

_[tool: show_html]_

_[tool: eval_js]_

Works as intended: with a promo price the quote number becomes **`20260527-AB-DC`**, and reverts to `20260527-AB` when the discount is cleared. Applied consistently across the internal worksheet number, the client report eyebrow, and the footer stamp.

_[tool: ready_for_verification]_

完成 — 套用專案優惠價時，報價單號自動加上 `-DC` 後綴（兩個大寫字母，代表 DisCount），移除優惠時恢復原單號。內部試算單、客戶報價單抬頭與頁尾印記三處皆同步。

## User

since the 填表日期 had 壓縮到地址欄的寬度，會自動換行。能不能把填表日期換到標題"客戶資訊" 的後面，向右對齊表格，以小淺灰字呈現？

## Assistant

_[tool: grep]_

Good call — better to keep it out of the table cells. I'll move 填表日期 into the section header, right-aligned in small light-gray text, and restore the address to full width.

_[tool: str_replace_edit]_

The 填表日期 now sits right-aligned in the 客戶資訊 / 專案資訊 section headers as small light-gray text, and the address is back to full width.

_[tool: ready_for_verification]_

完成 — 填表日期 已移到「客戶資訊 / 專案資訊」標題列右側，以小淺灰字呈現並向右對齊表格寬度，地址欄恢復滿版不再換行。只有填了日期才會顯示。

## User

小淺灰色字，是要對下方的表格靠右側對齊

## Assistant

對齊有 12px 偏差（標題列那條隱形分隔線把它往左推了）。我用 flex `order` 把日期排到最後，讓它真正貼齊表格右緣：

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

Let me just look at it visually:

_[tool: save_screenshot]_

_[tool: save_screenshot]_

Let me check the actual state to make sure I didn't cross-wire fields:

_[tool: eval_js]_

That qid value was just my own test selector polluting it — not a product issue. Let me measure the actual right-alignment precisely:

_[tool: eval_js]_

Confirmed — `metaRight` (801px) now exactly matches `tableRight` (801px). The 填表日期 is flush-aligned to the table's right edge, in small light-gray text. The `order: 1` fix pulled it past that invisible header rule that was offsetting it.

_[tool: ready_for_verification]_

完成 — 填表日期 現在的右緣已精準對齊下方表格的右邊框（量測 801px ⇌ 801px），維持小淺灰字。內部試算單與客戶報價單兩處皆一致。

## User

專案優惠價的pill 在列印時沒有跟著呈現藍底白字，而是白底。應該要跟著。

## Assistant

_[tool: grep]_

_[tool: read_file]_

The print block never enables background-color printing, so browsers drop the pill's blue fill. I'll add `print-color-adjust: exact` so intentional fills (the promo pill, stamps, etc.) print as designed:

_[tool: str_replace_edit]_

Done — added `print-color-adjust: exact` (and the `-webkit-` prefix) to the print stylesheet. Now the 專案優惠價 pill keeps its IMU-blue background with white text when printing or saving to PDF, along with the other intentionally-filled elements (stamps, 必購 pills).

_[tool: ready_for_verification]_

完成 — 列印樣式現在啟用了背景色輸出（`print-color-adjust: exact`），專案優惠價的 pill 在列印／存 PDF 時會維持藍底白字，與螢幕上一致。


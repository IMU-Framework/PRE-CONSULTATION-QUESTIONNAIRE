# 檔案清理

_Started 2026-05-28 10:25 UTC_

---

## User

有不需要的檔案請刪除

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: grep]_

Let me check which files each HTML references so I know what's safe to delete.

_[tool: grep]_

Let me check whether the `uploads/` files and other assets are referenced anywhere.

_[tool: delete_file]_

Here's what I found. Mapping every file to what references it:

**Used by deliverables (keep):** `hifi.css`, `calculator.css`, `assets/logo-circle.png`, and the JSX behind each HTML page.

**Not referenced by anything (safe to delete):**
- `screenshots/` — my own verification screenshots (14 files)
- `uploads/` — original upload copies, not linked anywhere (`banner.png/svg`, `box.svg`, `Version 2-4*`)
- `assets/logo-banner.svg`, `assets/logo-box.svg` — unused logo variants

Deleting those now.

清理完成，刪除了 20 個未被任何成品引用的檔案(我的驗證截圖、原始上傳副本、未使用的 logo 變體)。

剩下的都是實際成品與其依賴。其中這兩個是**早期階段的版本**,如果不再需要也可以刪:

- **Wireframe.html**(線框稿)+ `onepager.jsx`、`quote.jsx`
- **Hi-Fi.html**(高保真初版)+ `hifi-onepager.jsx`、`hifi-quote.jsx`

最終成品是 **Calculator.html / Quote.html / Questionnaire.html**。要不要我把上面兩個早期版本也一併刪除?

## User

Quote是否亦為中間階段產物？
以我的功能需求來說，似乎只需要保留Questionnaire & Calculator。

階段產物的html可以加個前綴如draft_之類
請評估

## Assistant

讓我先看清楚每個檔案的角色與彼此的引用關係,再給你評估。

_[tool: list_files]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

完整依賴關係已釐清。評估如下:

**最終成品(保留,不動)**
- `Questionnaire.html` ← questionnaire.jsx
- `Calculator.html` ← calculator.jsx, calc-quotes.jsx, calculator.css
- 共用:`hifi.css`、`assets/logo-circle.png`

**中間階段產物(含 Quote)** — 這三個 HTML 及其專屬 JSX,完全沒有被兩個成品引用:
- `Wireframe.html` ← onepager.jsx, quote.jsx
- `Hi-Fi.html` ← hifi-onepager.jsx, hifi-quote.jsx
- `Quote.html` ← quote-client.jsx, hifi-quote.jsx
- 三者共用:design-canvas.jsx

是的,**Quote 也是中間產物**(Calculator 已用 calc-quotes.jsx 產生報價單,Quote 是更早的獨立報價排版)。

我的建議:加 `draft_` 前綴比直接刪除更穩妥——保留可回溯,又能在檔案列表清楚分群。我會連同它們的專屬 JSX 一起加前綴並更新引用,讓 draft 與成品徹底分開。執行中:

_[tool: copy_files]_

Now update the script `src` references inside the three renamed draft HTMLs.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

完成。檔案現已清楚分群:

**成品(無前綴)**
- `Questionnaire.html` ＋ questionnaire.jsx
- `Calculator.html` ＋ calculator.jsx, calc-quotes.jsx, calculator.css
- 共用:`hifi.css`、`assets/logo-circle.png`

**中間產物(draft_ 前綴,引用已同步更新,仍可正常開啟)**
- `draft_Wireframe.html`、`draft_Hi-Fi.html`、`draft_Quote.html` 及各自的 draft_*.jsx

之前那輪也已刪掉 20 個沒被引用的檔案(截圖、原始上傳、未用 logo)。日後若確定不再需要回溯,直接刪除所有 `draft_` 檔即可。


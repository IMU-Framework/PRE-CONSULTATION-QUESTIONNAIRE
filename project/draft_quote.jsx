// 報價單：內部依問卷判斷規模係數＋客戶係數後產出，再寄給客戶

const QuoteSheet = () => (
  <div className="wf">
    <div className="sheet">

      {/* Header */}
      <div className="header">
        <div className="corner">QUOTATION · 內部產出 · 寄給客戶</div>
        <div className="eyebrow">QUOTATION · NO. <span style={{ color: '#1a1a1a' }}>2026-_ _ _</span></div>
        <h1 style={{ marginTop: 8 }}>線上諮詢服務報價單</h1>
        <div className="sub">本報價依您回覆之前置問卷推算 · 有效期限 14 天</div>
      </div>

      {/* Client + project meta */}
      <div className="sect">
        <SectionTitle num="01" title="專案資訊" />
        <table className="meta-table">
          <tbody>
            <tr>
              <th style={{ width: '20%' }}>客戶／公司</th>
              <td style={{ width: '30%' }}><span className="anno">問卷帶入</span></td>
              <th style={{ width: '20%' }}>聯絡人</th>
              <td style={{ width: '30%' }}><span className="anno">問卷帶入</span></td>
            </tr>
            <tr>
              <th>辦公室地址</th>
              <td colSpan={3}><span className="anno">問卷帶入</span></td>
            </tr>
            <tr>
              <th>諮詢主題</th>
              <td colSpan={3}><span className="anno">Q5 勾選帶入：動線配置 / 建材 / 軟裝 / 水電 / 工序</span></td>
            </tr>
            <tr>
              <th>報價日期</th>
              <td><span className="ph" style={{ display: 'inline-block', padding: '2px 12px' }}>YYYY / MM / DD</span></td>
              <th>有效期限</th>
              <td><span className="ph" style={{ display: 'inline-block', padding: '2px 12px' }}>+14 days</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Coefficient block */}
      <div className="sect">
        <SectionTitle num="02" title="係數判定" tag="內部分流結果" />
        <div className="row">
          <div className="col">
            <div className="anno">A · 規模係數（依 Q1 坪數 ／ Q2 人數，擇低）</div>
            <table className="meta-table" style={{ marginTop: 6 }}>
              <thead><tr><th>規模</th><th>判定</th><th>係數</th></tr></thead>
              <tbody>
                <tr><td>小型</td><td>30 坪以下 或 10 人內</td><td className="mono">× 1.0</td></tr>
                <tr><td>中型</td><td>31–60 坪 或 11–40 人</td><td className="mono">× 1.2</td></tr>
                <tr><td className="small">大型</td><td className="small">100 坪／41 人以上</td><td className="mono small">改設計專案</td></tr>
              </tbody>
            </table>
            <div className="callout" style={{ marginTop: 8 }}>
              本案判定 ▸ <strong><span className="anno" style={{ color: '#b03a2e' }}>填入：小型 / 中型</span></strong>
            </div>
          </div>
          <div className="col">
            <div className="anno">B · 客戶係數（依 Q4 資料準備度）</div>
            <table className="meta-table" style={{ marginTop: 6 }}>
              <thead><tr><th>狀態</th><th>描述</th><th>係數</th></tr></thead>
              <tbody>
                <tr><td>A</td><td>有精準帶尺寸現況圖、配置草圖、明確人數需求</td><td className="mono">× 1.0</td></tr>
                <tr><td>B</td><td>需求模糊、文件不齊，需更多釐清時間</td><td className="mono">× 1.2</td></tr>
              </tbody>
            </table>
            <div className="callout" style={{ marginTop: 8 }}>
              本案判定 ▸ <strong><span className="anno" style={{ color: '#b03a2e' }}>填入：A / B</span></strong>
            </div>
          </div>
        </div>
      </div>

      {/* Rate */}
      <div className="sect">
        <SectionTitle num="03" title="費率推導" />
        <div className="box" style={{ padding: 14, fontFamily: '"JetBrains Mono", monospace', fontSize: 13, background: '#fbfaf6' }}>
          <div>套用費率 ＝ 基礎費率 × 規模係數 × 客戶係數</div>
          <div style={{ marginTop: 6 }}>
            ＝ NT$<span className="ph" style={{ display: 'inline-block', padding: '0 14px' }}>2,000</span>
            ×<span className="ph" style={{ display: 'inline-block', padding: '0 10px' }}>1.0</span>
            ×<span className="ph" style={{ display: 'inline-block', padding: '0 10px' }}>1.0</span>
            ＝ <strong>NT$<span className="ph" style={{ display: 'inline-block', padding: '0 16px' }}>＿＿＿</span> / hr</strong>
          </div>
          <div className="small" style={{ marginTop: 8, fontFamily: '"Noto Sans TC", sans-serif' }}>
            * 加購時數與基礎時數同費率。圖說專案不計入時數，另行計價。
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="sect">
        <SectionTitle num="04" title="收費明細" />
        <table className="meta-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>項目</th>
              <th>單價</th>
              <th>數量</th>
              <th>小計</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>基礎諮詢時數包<span className="pad-tag">必購</span><div className="small" style={{ marginTop: 2 }}>最低 5 小時</div></td>
              <td className="mono">NT$ ＿＿</td>
              <td className="mono">5 hr</td>
              <td className="mono">NT$ ＿＿＿</td>
            </tr>
            <tr>
              <td>加購時數<div className="small" style={{ marginTop: 2 }}>1 小時為單位 · 與基礎時數同費率</div></td>
              <td className="mono">NT$ ＿＿</td>
              <td className="mono">＿ hr</td>
              <td className="mono">NT$ ＿＿＿</td>
            </tr>
            <tr>
              <td>圖說專案<span className="pill" style={{ marginLeft: 6 }}>By Project</span><div className="small" style={{ marginTop: 2 }}>大樣圖 / BOM 表 / 放樣圖等 — 諮詢中若評估有出圖需求，另行報價</div></td>
              <td className="mono small">另計</td>
              <td className="mono">—</td>
              <td className="mono">另案</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: 14, marginLeft: 'auto', width: 360 }}>
          <div className="price-line"><span>小計</span><span>NT$ ＿＿＿</span></div>
          <div className="price-line"><span>稅額</span><span>NT$ ＿＿＿</span></div>
          <div className="price-line total"><span>應付總額</span><span>NT$ ＿＿＿</span></div>
        </div>
      </div>

      {/* Worked example */}
      <div className="sect">
        <SectionTitle num="05" title="試算範例（參考）" tag="範本說明" />
        <div className="note-card">
          客戶：辦公室 50 坪／20 人（中型 × 1.2，客戶 A × 1.0）· 諮詢座位配置與塑膠地板材質 · 需 1 張插座放樣圖 · 線上會議共 6 小時。
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr auto', gap: 4, fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
            <span>基礎 5 hr：NT$ 2,000 × 5 × 1.2</span><span>NT$ 12,000</span>
            <span>加購 1 hr：NT$ 2,000 × 1 × 1.2</span><span>NT$ 2,400</span>
            <span>弱電放樣圖 1 張（另案報價）</span><span>NT$ 4,000</span>
            <span style={{ borderTop: '1px solid #1a1a1a', paddingTop: 4, fontWeight: 700 }}>總計</span>
            <span style={{ borderTop: '1px solid #1a1a1a', paddingTop: 4, fontWeight: 700 }}>NT$ 18,400</span>
          </div>
        </div>
      </div>

      {/* Payment + terms */}
      <div className="sect">
        <SectionTitle num="06" title="付款與服務條款" />
        <div className="stack">
          <div className="box-dash" style={{ padding: 12 }}>
            <strong>付款方式</strong>　基礎諮詢時數包於首次諮詢前付清；加購時數於諮詢前付清或計入當月請款表；圖說專案依個案議定。
          </div>
          <div className="box-dash" style={{ padding: 12 }}>
            <strong>預約方式</strong>　週一 ～ 週四 14:00 – 18:00，請提前二天以 LINE 預約。視訊會議連結由客戶提供。
          </div>
          <div className="box-dash" style={{ padding: 12 }}>
            <strong>免責聲明</strong>　設計師於諮詢期間閱覽之圖面／文件僅作為提供建議之依據，非屬正式審查或承諾。最終施工尺寸、收邊、工程品質、工班管理、驗收結果與發包／付款／合約爭議，均由客戶自行負責。
          </div>
        </div>
      </div>

      {/* Sign */}
      <div className="sect">
        <SectionTitle num="07" title="雙方確認" />
        <div className="row">
          <div className="col">
            <div className="small">客戶簽認</div>
            <div className="field" style={{ marginTop: 32 }} />
            <div className="small" style={{ marginTop: 6 }}>日期 ＿＿＿＿＿</div>
          </div>
          <div className="col">
            <div className="small">顧問</div>
            <div className="field" style={{ marginTop: 32 }} />
            <div className="small" style={{ marginTop: 6 }}>日期 ＿＿＿＿＿</div>
          </div>
        </div>
      </div>

      <div className="sect" style={{ marginTop: 24, paddingTop: 12, borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div className="small">本報價單僅供本案使用 · 報價有效期 14 天</div>
        <div className="stamp">QUOTE · 2026</div>
      </div>

    </div>
  </div>
);

window.QuoteSheet = QuoteSheet;

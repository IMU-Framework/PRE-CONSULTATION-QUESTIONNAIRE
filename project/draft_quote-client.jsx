// 報價單 — 客戶版本（不顯示係數，把基礎費率 × 規模 × 客戶 合併為「適用費率」）

const CCb = ({ round }) => <span className={"check" + (round ? " r" : "")} />;
const CSectHead = ({ idx, title, hint }) => (
  <div className="section-head">
    <span className="idx">{idx}</span>
    <span className="ttl">{title}</span>
    {hint && <span className="hint">{hint}</span>}
  </div>
);

const QuoteClient = () => (
  <div className="hf">
    <div className="sheet">

      {/* Masthead */}
      <header className="header">
        <div>
          <div className="eyebrow">QUOTATION · NO. 2026 — &nbsp;_ _ _</div>
          <h1 style={{ marginTop: 12 }}>線上諮詢服務<br />報價單</h1>
          <p className="lead" style={{ marginTop: 14, maxWidth: 520 }}>
            本報價依您回覆之前置問卷推算，報價有效期 14 天，於首次諮詢前完款後生效。
          </p>
        </div>
        <div className="header-meta">
          <div>FORM <b>OFC-QUO-01</b></div>
          <div>ISSUE <b>YYYY / MM / DD</b></div>
          <div>VALID <b>+ 14 days</b></div>
        </div>
      </header>

      {/* Project info */}
      <section className="section">
        <CSectHead idx="I" title="專案資訊" />
        <table className="tbl">
          <tbody>
            <tr>
              <th style={{ width: '18%' }}>客戶 / 公司</th>
              <td style={{ width: '32%' }}>＿＿＿＿＿＿＿＿</td>
              <th style={{ width: '18%' }}>聯絡人</th>
              <td style={{ width: '32%' }}>＿＿＿＿＿＿＿＿</td>
            </tr>
            <tr>
              <th>辦公室地址</th>
              <td colSpan={3}>＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿</td>
            </tr>
            <tr>
              <th>諮詢主題</th>
              <td colSpan={3}>依問卷 Q5：動線配置 / 建材 / 軟裝 / 水電 / 工序</td>
            </tr>
            <tr>
              <th>辦公室規模</th>
              <td>＿＿ 坪 ／ ＿＿ 人</td>
              <th>諮詢時段</th>
              <td>週一 ～ 週四 14:00 – 18:00</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Applied rate */}
      <section className="section">
        <CSectHead idx="II" title="服務費率" />
        <div className="card" style={{ padding: '24px 28px' }}>
          <div className="label">適用費率　Hourly Rate</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 8 }}>
            <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 42, letterSpacing: '-0.01em' }}>NT$ ＿＿＿＿</span>
            <span className="mute" style={{ fontSize: 14 }}>／ 每小時</span>
          </div>
          <div className="small" style={{ marginTop: 12, lineHeight: 1.7 }}>
            * 上述費率已涵蓋本案之服務評估，於本報價單有效期內適用。<br />
            * 加購時數與基礎時數同費率。圖說專案不計入時數，另案報價。
          </div>
        </div>
      </section>

      {/* Line items */}
      <section className="section">
        <CSectHead idx="III" title="收費明細" />
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: '42%' }}>項目</th>
              <th style={{ width: '18%' }}>單價</th>
              <th style={{ width: '15%' }}>數量</th>
              <th style={{ width: '25%' }}>小計</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>基礎諮詢時數包 <span className="pill a">必購</span></div>
                <div className="small">最低 5 小時，於首次諮詢前完款。</div>
              </td>
              <td className="mono">NT$ ＿＿＿</td>
              <td className="mono">5 hr</td>
              <td className="mono">NT$ ＿＿＿＿</td>
            </tr>
            <tr>
              <td>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>加購時數</div>
                <div className="small">超過基礎時數後，以 1 小時為單位加購。</div>
              </td>
              <td className="mono">NT$ ＿＿＿</td>
              <td className="mono">＿ hr</td>
              <td className="mono">NT$ ＿＿＿</td>
            </tr>
            <tr>
              <td>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>圖說專案 <span className="pill">By Project</span></div>
                <div className="small">大樣圖 / BOM 表 / 放樣圖等：諮詢中若評估有出圖需求，另案報價。</div>
              </td>
              <td className="mono mute">另計</td>
              <td className="mono">—</td>
              <td className="mono">另案</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: 18, marginLeft: 'auto', width: 380 }}>
          <div className="price-row"><span>小計</span><span className="v">NT$ ＿＿＿＿</span></div>
          <div className="price-row"><span>稅額</span><span className="v">NT$ ＿＿＿</span></div>
          <div className="price-row total"><span>應付總額</span><span className="v">NT$ ＿＿＿＿</span></div>
        </div>
      </section>

      {/* Example */}
      <section className="section">
        <CSectHead idx="IV" title="費用範例" hint="Reference" />
        <div className="example">
          <p style={{ fontSize: 12.5, lineHeight: 1.7 }}>
            假設客戶適用費率為 <strong>NT$ 2,400 ／ hr</strong>，諮詢內容包含座位配置與塑膠地板材質討論，過程中追加 1 張弱電插座放樣圖。線上會議共 6 小時。
          </p>
          <div className="calc">
            <span>基礎諮詢時數包　5 hr</span><span>NT$ 12,000</span>
            <span>加購時數　1 hr</span><span>NT$ 2,400</span>
            <span>弱電放樣圖 1 張（另案報價）</span><span>NT$ 4,000</span>
            <span className="sep" />
            <span className="total-l">總計</span><span className="total-v">NT$ 18,400</span>
          </div>
        </div>
      </section>

      <div className="ornament">· · ·</div>

      {/* Terms */}
      <section className="section">
        <CSectHead idx="V" title="付款與服務條款" />
        <div className="stack">
          <div className="ack"><div className="body"><b>付款方式</b>　基礎諮詢時數包於首次諮詢前付清；加購時數於諮詢前付清或計入當月請款表；圖說專案依個案議定。</div></div>
          <div className="ack"><div className="body"><b>預約方式</b>　週一 ～ 週四 14:00 – 18:00，請提前二天以 LINE 預約。視訊會議連結由客戶提供。</div></div>
          <div className="ack"><div className="body"><b>服務範圍</b>　主要交付為預約之視訊會議時段內的口頭建議與討論。諮詢前接收之圖面、文件、問題清單，僅用於預先了解議程並提升會議效率。</div></div>
          <div className="ack"><div className="body"><b>免責聲明</b>　設計師於諮詢期間閱覽之圖面／文件僅作為提供建議之依據，非屬正式審查或承諾。最終施工尺寸、收邊、工程品質、工班管理、驗收結果與發包／付款／合約爭議，均由客戶自行負責。</div></div>
        </div>
      </section>

      {/* Sign */}
      <section className="section">
        <CSectHead idx="VI" title="雙方確認" />
        <div className="sign-row">
          <div className="col">
            <div className="field-lbl">客戶簽認</div>
            <div className="field" style={{ marginTop: 56 }} />
            <div className="small" style={{ marginTop: 8 }}>日期 ＿＿＿＿＿＿</div>
          </div>
          <div className="col">
            <div className="field-lbl">顧問</div>
            <div className="field" style={{ marginTop: 56 }} />
            <div className="small" style={{ marginTop: 8 }}>日期 ＿＿＿＿＿＿</div>
          </div>
        </div>
      </section>

      <div className="foot">
        <div className="lt">本報價單僅供本案使用 · 報價有效期 14 天 · 首次諮詢前完款後生效</div>
        <div className="stamp">QUOTE · 2026</div>
      </div>

    </div>
  </div>
);

window.QuoteClient = QuoteClient;

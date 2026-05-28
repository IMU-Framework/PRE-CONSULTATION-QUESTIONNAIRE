// Shared: parser, coefficient logic, formatters, and quote render components.

const fmtNum = (n) => {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('en-US');
};
const ntd = (n) => `NT$ ${fmtNum(n)}`;

// Parse questionnaire summary text into structured data.
// Tolerant: missing lines just leave fields blank.
function parseSummary(text) {
  const out = {};
  const grab = (re) => {
    const m = text.match(re);
    return m ? m[1].trim() : '';
  };
  out.qid = grab(/問卷單號[：:]\s*([^\n\r]+)/);
  out.date = grab(/填表日期[：:]\s*([^\n\r]+)/);
  out.company = grab(/客戶[／\/]公司[：:]\s*([^\n\r]+)/);
  out.contact = grab(/聯絡人[：:]\s*([^\n\r]+)/);
  out.line = grab(/LINE ID[：:]\s*([^　\n\r]+)/);
  out.phone = grab(/電話[：:]\s*([^\n\r]+)/);
  out.address = grab(/地址[：:]\s*([^\n\r]+)/);

  const scaleM = text.match(/Q1\s*坪數[：:]\s*約\s*(\d+)\s*坪/);
  out.scale = scaleM ? Number(scaleM[1]) : '';
  const headM = text.match(/Q2\s*人數[：:]\s*約\s*(\d+)\s*人/);
  out.head = headM ? Number(headM[1]) : '';

  out.condition = grab(/Q3\s*現況[：:]\s*([^\n\r]+)/);
  out.docs = grab(/Q4\s*可提供資料[：:]\s*([^\n\r]+)/);
  out.topics = grab(/Q5\s*諮詢重點[：:]\s*([^\n\r]+)/);
  out.spaces = grab(/Q6\s*空間機能[：:]\s*([^\n\r]+)/);
  out.schedule = grab(/Q7\s*時程[：:]\s*([^\n\r]+)/);

  // Service purchases from the questionnaire
  const baseM = text.match(/基礎時數[：:]\s*(\d+)\s*小時/);
  out.baseHours = baseM ? Number(baseM[1]) : '';
  const addM = text.match(/預計加購時數[：:]\s*(?:(\d+)\s*小時|(暫不加購))/);
  if (addM) out.addHours = addM[2] ? 0 : Number(addM[1]);else
  out.addHours = '';

  return out;
}

// Suggest scale tier from Q1/Q2 numbers.
function suggestScaleTier(sqft, head) {
  const s = Number(sqft) || 0;
  const h = Number(head) || 0;
  if (s > 100 || h > 40) return 'L';
  if (s > 30 || h > 10) return 'M';
  return 'S';
}

const SCALE_OPTS = {
  S: { label: '小型', mult: 1.0, desc: '30 坪以下、10 人內' },
  M: { label: '中型', mult: 1.2, desc: '31 – 100 坪 或 11 – 40 人' },
  L: { label: '大型', mult: 1.5, desc: '100 坪以上 或 41 人以上 · 建議轉設計專案' }
};
const READY_OPTS = {
  A: { label: 'A · 資料齊全', mult: 1.0, desc: '有精準帶尺寸現況圖、配置草圖、明確人數需求（依 Q4）' },
  B: { label: 'B · 需協助釐清', mult: 1.2, desc: '需求模糊、文件不齊，需更多釐清時間（依 Q4）' }
};
const SPEC_OPTS = {
  A: { label: 'A · 需求明確', mult: 1.0, desc: '空間機能、時程已具體（依 Q6 / Q7）' },
  B: { label: 'B · 部分模糊', mult: 1.1, desc: '部分機能或時程待釐清（依 Q6 / Q7）' }
};

// Quote model from form state
function buildQuoteModel(f) {
  const baseRate = Number(f.baseRate) || 0;
  const scaleMult = SCALE_OPTS[f.scaleTier]?.mult ?? 1.0;
  const readyMult = READY_OPTS[f.readiness]?.mult ?? 1.0;
  const specMult = SPEC_OPTS[f.specTier]?.mult ?? 1.0;
  const hourly = Math.round(baseRate * scaleMult * readyMult * specMult);
  const baseHours = Number(f.baseHours) || 5;
  const addHours = Number(f.addHours) || 0;
  const drawing = Number(f.drawingFee) || 0;
  const baseSubtotal = hourly * baseHours;
  const addSubtotal = hourly * addHours;
  const subtotal = baseSubtotal + addSubtotal + drawing;
  const taxRate = Number(f.taxRate) || 0;
  const tax = Math.round(subtotal * taxRate / 100);
  const total = subtotal + tax;
  return {
    baseRate, scaleMult, readyMult, specMult, hourly,
    baseHours, addHours, drawing,
    baseSubtotal, addSubtotal,
    subtotal, taxRate, tax, total
  };
}

const QHead = ({ idx, title, hint }) =>
<div className="section-head">
    <span className="idx">{idx}</span>
    <span className="ttl">{title}</span>
    {hint && <span className="hint">{hint}</span>}
  </div>;


/* ============================== INTERNAL ============================== */
const InternalQuote = ({ f, m }) => {
  const scale = SCALE_OPTS[f.scaleTier];
  const ready = READY_OPTS[f.readiness];
  const spec = SPEC_OPTS[f.specTier];
  return (
    <div className="hf compact">
      <div className="sheet">
        <header className="header" style={{ display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
            <div className="eyebrow">INTERNAL · QUOTATION WORKSHEET</div>
            <img src="assets/logo-circle.png" alt="IMU Framework" style={{ height: 48, width: 48, flexShrink: 0, display: 'block' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, marginTop: 14 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ marginTop: 0, whiteSpace: 'nowrap' }}>內部試算單</h1>
              <p className="lead" style={{ marginTop: 14, maxWidth: 520 }}>含係數判定與費率推導，僅供內部留底。</p>
            </div>
            <div className="header-meta">
              <div>QUOTE NO. <b className="mono" style={{ color: 'var(--brand)' }}>{f.qid || '—'}</b></div>
              <div>ISSUE <b>{f.issueDate || '—'}</b></div>
              <div>VALID <b>+ 14 days</b></div>
            </div>
          </div>
        </header>

        <section className="section">
          <QHead idx="I" title="客戶資訊" />
          <table className="tbl">
            <tbody>
              <tr>
                <th style={{ width: '18%' }}>客戶／公司</th><td style={{ width: '32%' }}>{f.company || '—'}</td>
                <th style={{ width: '18%' }}>聯絡人</th><td style={{ width: '32%' }}>{f.contact || '—'}</td>
              </tr>
              <tr>
                <th>LINE ID</th><td>{f.line || '—'}</td>
                <th>電話</th><td>{f.phone || '—'}</td>
              </tr>
              <tr>
                <th>辦公室地址</th><td colSpan={3}>{f.address || '—'}</td>
              </tr>
              <tr>
                <th>規模</th><td>約 {f.scale || '—'} 坪 ／ 約 {f.head || '—'} 人</td>
                <th>現況</th><td>{f.condition || '—'}</td>
              </tr>
              <tr>
                <th>諮詢重點</th><td colSpan={3} className="small">{f.topics || '—'}</td>
              </tr>
              <tr>
                <th>可提供資料</th>
                <td colSpan={3} className="small">{f.q4Docs || '—'}</td>
              </tr>
              <tr>
                <th>空間機能</th>
                <td colSpan={3} className="small">{f.q6Spaces || '—'}</td>
              </tr>
              <tr>
                <th>時程</th>
                <td colSpan={3} className="small">{f.q7Schedule || '—'}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="section">
          <QHead idx="II" title="係數判定" hint="scale · readiness · spec" />
          <div className="grid-3">
            <div className="card">
              <div className="label">A · 規模係數　Scale</div>
              <div className="ttl" style={{ fontSize: 18 }}>{scale.label}　×&nbsp;{scale.mult.toFixed(1)}</div>
              <div className="desc">{scale.desc}</div>
            </div>
            <div className="card">
              <div className="label">B · 準備度係數　Readiness</div>
              <div className="ttl" style={{ fontSize: 18 }}>{ready.label}　×&nbsp;{ready.mult.toFixed(1)}</div>
              <div className="desc">{ready.desc}</div>
            </div>
            <div className="card">
              <div className="label">C · 明確度係數　Spec</div>
              <div className="ttl" style={{ fontSize: 18 }}>{spec.label}　×&nbsp;{spec.mult.toFixed(1)}</div>
              <div className="desc">{spec.desc}</div>
            </div>
          </div>
        </section>

        <section className="section">
          <QHead idx="III" title="費率推導" />
          <div className="card" style={{ padding: '22px 26px' }}>
            <div className="mono small mute">基礎費率　×　規模係數　×　準備度係數　×　明確度係數　＝　適用費率</div>
            <div className="mono" style={{ marginTop: 12, fontSize: 16 }}>
              {ntd(m.baseRate)}　×　<b>{m.scaleMult.toFixed(1)}</b>　×　<b>{m.readyMult.toFixed(1)}</b>　×　<b>{m.specMult.toFixed(1)}</b>　＝&nbsp;
              <span style={{ fontSize: 22, fontWeight: 700 }}>{ntd(m.hourly)}</span><span className="mute"> / hr</span>
            </div>
          </div>
        </section>

        <section className="section">
          <QHead idx="IV" title="收費明細" />
          <table className="tbl">
            <thead>
              <tr><th style={{ width: '46%' }}>項目</th><th>單價</th><th>數量</th><th>小計</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><b>基礎諮詢時數</b><div className="small">最低購買 5 小時</div></td>
                <td className="mono">{ntd(m.hourly)}</td>
                <td className="mono">{m.baseHours} hr</td>
                <td className="mono">{ntd(m.baseSubtotal)}</td>
              </tr>
              <tr>
                <td><b>彈性加購時數</b><div className="small">以 1 小時為單位</div></td>
                <td className="mono">{ntd(m.hourly)}</td>
                <td className="mono">{m.addHours} hr</td>
                <td className="mono">{ntd(m.addSubtotal)}</td>
              </tr>
              <tr>
                <td><b>圖說專案</b><span className="pill" style={{ marginLeft: 6 }}>By Project</span><div className="small">細部大樣、BOM 表、放樣圖（另案）</div></td>
                <td className="mono mute">—</td>
                <td className="mono">—</td>
                <td className="mono">{ntd(m.drawing)}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 18, marginLeft: 'auto', width: 380 }}>
            <div className="price-row"><span>小計</span><span className="v">{ntd(m.subtotal)}</span></div>
            <div className="price-row"><span>稅額（{m.taxRate}%）</span><span className="v">{ntd(m.tax)}</span></div>
            <div className="price-row total"><span>應付總額</span><span className="v">{ntd(m.total)}</span></div>
          </div>
        </section>

        <div className="foot">
          <div className="lt">內部留底使用，請勿外流。</div>
          <div className="stamp">INTERNAL</div>
        </div>
      </div>
    </div>);

};

/* ============================== CLIENT ============================== */
const ClientQuote = ({ f, m }) =>
<div className="hf compact">
    <div className="sheet">
      <header className="header" style={{ display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <div className="eyebrow">QUOTATION · NO. <b className="mono" style={{ color: 'var(--brand)' }}>{f.qid || '—'}</b></div>
          <img src="assets/logo-circle.png" alt="IMU Framework" style={{ height: 48, width: 48, flexShrink: 0, display: 'block' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, marginTop: 14 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ marginTop: 0, whiteSpace: 'nowrap' }}>線上諮詢服務報價單</h1>
            <p className="lead" style={{ marginTop: 14, maxWidth: 520 }}>
              本報價依您回覆之前置問卷推算，報價有效期 14 天，於首次諮詢前完款後生效。
            </p>
          </div>
          <div className="header-meta">
            <div>ISSUE <b>{f.issueDate || '—'}</b></div>
            <div>VALID <b>+ 14 days</b></div>
          </div>
        </div>
      </header>

      <section className="section">
        <QHead idx="I" title="專案資訊" />
        <table className="tbl">
          <tbody>
            <tr>
              <th style={{ width: '18%' }}>客戶／公司</th><td style={{ width: '32%' }}>{f.company || '—'}</td>
              <th style={{ width: '18%' }}>聯絡人</th><td style={{ width: '32%' }}>{f.contact || '—'}</td>
            </tr>
            <tr>
              <th>辦公室地址</th><td colSpan={3}>{f.address || '—'}</td>
            </tr>
            <tr>
              <th>諮詢重點</th><td colSpan={3} className="small">{f.topics || '—'}</td>
            </tr>
            <tr>
              <th>辦公室規模</th><td>約 {f.scale || '—'} 坪 ／ 約 {f.head || '—'} 人</td>
              <th>可預約諮詢時段</th><td>週一至週四 14:00–18:00 單次最低1小時</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <QHead idx="II" title="服務費率" />
        <div className="card" style={{ padding: '24px 28px' }}>
          <div className="label">適用費率　Hourly Rate</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 8 }}>
            <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 42, letterSpacing: '-0.01em' }}>{ntd(m.hourly)}</span>
            <span className="mute" style={{ fontSize: 14 }}>／ 每小時</span>
          </div>
          <div className="small" style={{ marginTop: 12, lineHeight: 1.7 }}>
            * 上述費率已涵蓋本案之服務評估，於本報價單有效期內適用。<br />
            * 加購時數與基礎時數同費率。圖說專案不計入時數，另案報價。
          </div>
        </div>
      </section>

      <section className="section">
        <QHead idx="III" title="收費明細" />
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: '42%' }}>項目</th>
              <th>單價</th><th>數量</th><th>小計</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style={{ fontWeight: 500 }}>基礎諮詢時數 <span className="pill a">必購</span></div>
                <div className="small">最低購買 5 小時，於首次諮詢前完款。</div>
              </td>
              <td className="mono">{ntd(m.hourly)}</td>
              <td className="mono">{m.baseHours} hr</td>
              <td className="mono">{ntd(m.baseSubtotal)}</td>
            </tr>
            <tr>
              <td>
                <div style={{ fontWeight: 500 }}>彈性加購時數</div>
                <div className="small">超過基礎時數後，以 1 小時為單位加購。</div>
              </td>
              <td className="mono">{ntd(m.hourly)}</td>
              <td className="mono">{m.addHours} hr</td>
              <td className="mono">{ntd(m.addSubtotal)}</td>
            </tr>
            <tr>
              <td>
                <div style={{ fontWeight: 500 }}>圖說專案 <span className="pill">By Project</span></div>
                <div className="small">細部大樣、BOM 表、放樣圖：諮詢中若評估有出圖需求，另案報價。</div>
              </td>
              <td className="mono mute">{m.drawing ? ntd(m.drawing) : '另計'}</td>
              <td className="mono">—</td>
              <td className="mono">{m.drawing ? ntd(m.drawing) : '另案'}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: 18, marginLeft: 'auto', width: 380 }}>
          <div className="price-row"><span>小計</span><span className="v">{ntd(m.subtotal)}</span></div>
          <div className="price-row"><span>稅額（{m.taxRate}%）</span><span className="v">{ntd(m.tax)}</span></div>
          <div className="price-row total"><span>應付總額</span><span className="v">{ntd(m.total)}</span></div>
        </div>
      </section>

      <section className="section">
        <QHead idx="IV" title="服務條款與雙方確認" />
        <div className="terms-grid">
          <div className="terms-list">
            <div className="trm"><b>服務性質</b>　本服務為「線上口頭諮詢顧問」，後續圖面修訂、發包、監工與工程品質由客戶自行負責。</div>
            <div className="trm"><b>圖說費用</b>　諮詢費不包含施工圖說；若諮詢過程中評估有出圖需求，將另行計價。</div>
            <div className="trm"><b>通訊範圍</b>　諮詢時段外所接收之問題，其回覆形式由設計師依問題複雜度判斷；議題較為複雜時，相關建議可能會併入下一次諮詢時段中提供。</div>
            <div className="trm"><b>免責聲明</b>　最終施工尺寸、建材收邊、工程品質、工班管理、驗收結果與任何發包／付款／合約爭議，均由客戶自行負責。</div>
          </div>
          <div className="sign-inline">
            <div className="sign-cell">
              <div className="field-lbl">客戶簽認</div>
              <div className="field" />
              <div className="small">日期 ＿＿＿＿＿＿</div>
            </div>
            <div className="sign-cell">
              <div className="field-lbl">顧問簽認</div>
              <div className="field" />
              <div className="small">日期 ＿＿＿＿＿＿</div>
            </div>
          </div>
        </div>
      </section>

      <div className="foot">
        <div className="lt">本報價單僅供本案使用 · 報價有效期 14 天 · 首次諮詢前完款後生效</div>
        <div className="stamp">QUOTE · {f.qid || '2026'}</div>
      </div>
    </div>
  </div>;


window.parseSummary = parseSummary;
window.suggestScaleTier = suggestScaleTier;
window.buildQuoteModel = buildQuoteModel;
window.SCALE_OPTS = SCALE_OPTS;
window.READY_OPTS = READY_OPTS;
window.SPEC_OPTS = SPEC_OPTS;
window.InternalQuote = InternalQuote;
window.ClientQuote = ClientQuote;

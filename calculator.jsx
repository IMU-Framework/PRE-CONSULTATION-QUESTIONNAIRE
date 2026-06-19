// Calculator: form + parser + dual-quote preview

const { useState: useStateC, useMemo: useMemoC } = React;

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()} / ${String(d.getMonth() + 1).padStart(2, '0')} / ${String(d.getDate()).padStart(2, '0')}`;
};

const toDigit = (v) => String(v)
  .replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
  .replace(/[^0-9]/g, '');

const DEFAULTS = {
  qid: '',
  issueDate: todayISO(),
  fillDate: '',
  company: '', contact: '', line: '', phone: '', address: '',
  scale: '', head: '', condition: '', topics: '',
  q4Docs: '', q6Spaces: '', q7Schedule: '',
  baseRate: '2000',
  scaleTier: 'S',
  readiness: 'A',
  specTier: 'A',
  baseHours: '5',
  addHours: '0',
  drawingFee: '0',
  discountPct: '',
  discountRate: '',
  taxRate: '5',
};

/* ----- Tiny form controls (calculator-side, distinct from questionnaire) ----- */
const cstyles = {
  block: { display: 'block', marginBottom: 12 },
  label: { display: 'block', fontSize: 11, color: '#555', marginBottom: 4, letterSpacing: '0.04em' },
  input: {
    width: '100%', padding: '8px 10px', border: '1px solid #c4c4c4',
    background: '#fff', fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box',
    borderRadius: 2, outline: 'none',
  },
  num: {
    width: '100%', padding: '8px 10px', border: '1px solid #c4c4c4',
    background: '#fff', fontFamily: '"IBM Plex Mono", monospace',
    fontSize: 13, textAlign: 'left', boxSizing: 'border-box',
    borderRadius: 2, outline: 'none',
  },
  pill: (active) => ({
    flex: 1, padding: '10px 8px', border: '1px solid ' + (active ? '#000' : '#c4c4c4'),
    background: active ? '#000' : '#fff', color: active ? '#fff' : '#222',
    cursor: 'pointer', fontFamily: 'inherit', fontSize: 12,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    borderRadius: 2,
  }),
  btn: {
    padding: '10px 18px', border: '1.5px solid #2F4A9C',
    background: '#2F4A9C', color: '#fff', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 13, letterSpacing: '0.04em',
  },
  btnGhost: {
    padding: '10px 18px', border: '1.5px solid #000',
    background: '#fff', color: '#000', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 13, letterSpacing: '0.04em',
  },
};

const Lbl = ({ children, hint }) => (
  <div style={cstyles.label}>
    {children}
    {hint && <span style={{ color: '#999', marginLeft: 6 }}>{hint}</span>}
  </div>
);

const TextInput = ({ value, onChange, placeholder, mono }) => (
  <input type="text" value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{ ...cstyles.input, fontFamily: mono ? '"IBM Plex Mono", monospace' : 'inherit' }} />
);

const NumInput = ({ value, onChange, suffix }) => (
  <div style={{ display: 'flex', alignItems: 'stretch' }}>
    <input type="text" inputMode="numeric" value={value}
      onChange={e => onChange(toDigit(e.target.value))}
      style={{ ...cstyles.num, borderRight: suffix ? 'none' : '1px solid #c4c4c4', borderRadius: suffix ? '2px 0 0 2px' : 2 }} />
    {suffix && (
      <span style={{
        display: 'flex', alignItems: 'center', padding: '0 12px',
        fontSize: 11, color: '#666', whiteSpace: 'nowrap',
        border: '1px solid #c4c4c4', borderLeft: 'none',
        background: '#f1f1f1', borderRadius: '0 2px 2px 0',
      }}>{suffix}</span>
    )}
  </div>
);

const Calculator = () => {
  const [f, setF] = useStateC(DEFAULTS);
  const [view, setView] = useStateC('internal');  // 'internal' | 'client' | 'both'
  const [paste, setPaste] = useStateC('');
  const [parseMsg, setParseMsg] = useStateC('');

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  // Auto-suggest scale tier when scale/head change (but don't fight user override)
  React.useEffect(() => {
    if (!f.scale && !f.head) return;
    const sugg = suggestScaleTier(f.scale, f.head);
    setF(p => p.scaleTier === sugg ? p : { ...p, scaleTier: sugg });
    // eslint-disable-next-line
  }, [f.scale, f.head]);

  // Auto-classify 準備度 from Q3 現況 / Q4 可提供資料 / Q5 諮詢重點.
  React.useEffect(() => {
    const touched = [f.condition, f.q4Docs, f.topics].some(v => String(v ?? '').trim() !== '');
    if (!touched) return;
    const sugg = suggestReadiness(f);
    setF(p => p.readiness === sugg ? p : { ...p, readiness: sugg });
    // eslint-disable-next-line
  }, [f.condition, f.q4Docs, f.topics]);

  // Auto-classify 明確度 from Q6 空間機能 / Q7 時程.
  React.useEffect(() => {
    const touched = [f.q6Spaces, f.q7Schedule].some(v => String(v ?? '').trim() !== '');
    if (!touched) return;
    const sugg = suggestSpec(f);
    setF(p => p.specTier === sugg ? p : { ...p, specTier: sugg });
    // eslint-disable-next-line
  }, [f.q6Spaces, f.q7Schedule]);

  const m = useMemoC(() => buildQuoteModel(f), [f]);

  // Promo price: % off and unit price stay in sync against the current rate.
  const onDiscPct = (v) => {
    if (v === '') { setF(p => ({ ...p, discountPct: '', discountRate: '' })); return; }
    const rate = Math.round(m.hourly * (1 - Number(v) / 100));
    setF(p => ({ ...p, discountPct: v, discountRate: rate > 0 ? String(rate) : '' }));
  };
  const onDiscRate = (v) => {
    if (v === '') { setF(p => ({ ...p, discountPct: '', discountRate: '' })); return; }
    const pct = m.hourly > 0 ? Math.round((1 - Number(v) / m.hourly) * 100) : 0;
    setF(p => ({ ...p, discountRate: v, discountPct: pct > 0 ? String(pct) : '0' }));
  };

  const doParse = () => {
    if (!paste.trim()) { setParseMsg('請先貼上摘要文字'); return; }
    const p = parseSummary(paste);
    setF(prev => ({
      ...prev,
      qid: p.qid || prev.qid,
      fillDate: p.date || prev.fillDate,
      company: p.company || prev.company,
      contact: p.contact || prev.contact,
      line: p.line || prev.line,
      phone: p.phone || prev.phone,
      address: p.address || prev.address,
      scale: p.scale ? String(p.scale) : prev.scale,
      head: p.head ? String(p.head) : prev.head,
      condition: p.condition || prev.condition,
      topics: p.topics || prev.topics,
      q4Docs: p.docs || prev.q4Docs,
      q6Spaces: p.spaces || prev.q6Spaces,
      q7Schedule: p.schedule || prev.q7Schedule,
      baseHours: p.baseHours !== '' && p.baseHours != null ? String(p.baseHours) : prev.baseHours,
      addHours: p.addHours !== '' && p.addHours != null ? String(p.addHours) : prev.addHours,
    }));
    setParseMsg(`✓ 已解析 ${[p.qid, p.company, p.scale].filter(Boolean).length ? '' : '（未找到關鍵欄位，請檢查貼上內容）'}`);
    setTimeout(() => setParseMsg(''), 3500);
  };

  const reset = () => { setF(DEFAULTS); setPaste(''); };
  const doPrint = () => window.print();

  return (
    <div className="calc-root">

      {/* Top toolbar */}
      <div className="calc-toolbar no-print">
        <div className="brand">
          <img src="assets/logo-circle.png" alt="IMU Framework" style={{ height: 48, width: 48, display: 'block', marginBottom: 6 }} />
          <div className="eb">OFFICE CONSULTING · ADMIN</div>
          <div className="ttl">報價單試算 Calculator</div>
        </div>
        <div className="actions">
          <div className="seg">
            {['internal', 'client', 'both'].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{
                  ...cstyles.pill(view === v),
                  flexDirection: 'row', padding: '8px 14px', fontSize: 12,
                }}>
                {v === 'internal' ? '內部版' : v === 'client' ? '客戶版' : '並排'}
              </button>
            ))}
          </div>
          <button onClick={doPrint} style={cstyles.btn}>列印 / 存 PDF</button>
          <button onClick={reset} style={cstyles.btnGhost}>清空</button>
        </div>
      </div>

      <div className="calc-body">
        {/* ====== Left: form ====== */}
        <aside className="calc-form no-print">

          <details open style={{ marginBottom: 14 }}>
            <summary>① 一鍵帶入問卷</summary>
            <div style={{ padding: '10px 0' }}>
              <Lbl hint="把客戶傳來的 LINE 摘要整段貼進來">問卷摘要</Lbl>
              <textarea value={paste} onChange={e => setPaste(e.target.value)}
                placeholder="貼上「=== 辦公室裝修線上諮詢 — 前置評估問卷 ===」開頭的摘要文字…"
                style={{
                  ...cstyles.input, height: 120, fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 11, lineHeight: 1.5, resize: 'vertical',
                }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                <button onClick={doParse} style={cstyles.btn}>解析並帶入</button>
                {parseMsg && <span style={{ fontSize: 12, color: parseMsg.startsWith('✓') ? '#155' : '#a00' }}>{parseMsg}</span>}
              </div>
            </div>
          </details>

          <details open style={{ marginBottom: 14 }}>
            <summary>② 案件資訊（可手動編輯）</summary>
            <div style={{ padding: '10px 0' }}>
              <div style={cstyles.block}>
                <Lbl>問卷單號</Lbl>
                <TextInput value={f.qid} onChange={v => set('qid', v)} placeholder="20260527-AB" mono />
              </div>
              <div style={cstyles.block}>
                <Lbl hint="客戶填寫問卷的日期，隨摘要帶入">客戶填表日期</Lbl>
                <TextInput value={f.fillDate} onChange={v => set('fillDate', v)} placeholder="2026 / 05 / 27" />
              </div>
              <div style={cstyles.block}>
                <Lbl>報價日期</Lbl>
                <TextInput value={f.issueDate} onChange={v => set('issueDate', v)} />
              </div>
              <div className="grid2">
                <div><Lbl>客戶 / 公司</Lbl><TextInput value={f.company} onChange={v => set('company', v)} /></div>
                <div><Lbl>聯絡人</Lbl><TextInput value={f.contact} onChange={v => set('contact', v)} /></div>
                <div><Lbl>LINE ID</Lbl><TextInput value={f.line} onChange={v => set('line', v)} /></div>
                <div><Lbl>電話</Lbl><TextInput value={f.phone} onChange={v => set('phone', v)} /></div>
              </div>
              <div style={{ ...cstyles.block, marginTop: 12 }}>
                <Lbl>地址</Lbl><TextInput value={f.address} onChange={v => set('address', v)} />
              </div>
              <div className="grid2">
                <div><Lbl>坪數</Lbl><NumInput value={f.scale} onChange={v => set('scale', v)} suffix="坪" /></div>
                <div><Lbl>人數</Lbl><NumInput value={f.head} onChange={v => set('head', v)} suffix="人" /></div>
              </div>
              <div style={{ ...cstyles.block, marginTop: 12 }}>
                <Lbl>現況</Lbl><TextInput value={f.condition} onChange={v => set('condition', v)} placeholder="毛胚屋 / 標準辦公室單元 / 舊辦公室…" />
              </div>
              <div style={cstyles.block}>
                <Lbl>諮詢重點</Lbl><TextInput value={f.topics} onChange={v => set('topics', v)} placeholder="動線配置、建材、軟裝…" />
              </div>
              <div style={cstyles.block}>
                <Lbl hint="Q4 — 內部試算單會列出，作為準備度判定依據">可提供資料</Lbl>
                <textarea value={f.q4Docs} onChange={e => set('q4Docs', e.target.value)}
                  placeholder="現況 CAD 平面圖、配置草圖…"
                  style={{ ...cstyles.input, minHeight: 48, resize: 'vertical', fontSize: 12, lineHeight: 1.5 }} />
              </div>
              <div style={cstyles.block}>
                <Lbl hint="Q6 — 內部試算單會列出，作為明確度判定依據">空間機能</Lbl>
                <textarea value={f.q6Spaces} onChange={e => set('q6Spaces', e.target.value)}
                  placeholder="開放辦公區、會議室、茶水區…"
                  style={{ ...cstyles.input, minHeight: 48, resize: 'vertical', fontSize: 12, lineHeight: 1.5 }} />
              </div>
              <div style={cstyles.block}>
                <Lbl hint="Q7 — 內部試算單會列出，作為明確度判定依據">時程</Lbl>
                <TextInput value={f.q7Schedule} onChange={v => set('q7Schedule', v)} placeholder="開工 YYYY/MM/DD　進駐 YYYY/MM/DD" />
              </div>
            </div>
          </details>

          <details open style={{ marginBottom: 14 }}>
            <summary>③ 係數判定</summary>
            <div style={{ padding: '10px 0' }}>
              <Lbl hint="會依坪數 / 人數自動建議，可手動調整">規模係數</Lbl>
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.entries(SCALE_OPTS).map(([k, o]) => (
                  <button key={k} onClick={() => set('scaleTier', k)} style={cstyles.pill(f.scaleTier === k)}>
                    <b>{o.label}</b>
                    <span style={{ fontSize: 10, opacity: 0.8 }}>× {o.mult.toFixed(1)}</span>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>{SCALE_OPTS[f.scaleTier].desc}</div>

              <Lbl hint="依 Q3 現況 + Q4 可提供資料 + Q5 諮詢重點自動判定，可手動調整" style={{ marginTop: 14 }}>準備度係數</Lbl>
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.entries(READY_OPTS).map(([k, o]) => (
                  <button key={k} onClick={() => set('readiness', k)} style={cstyles.pill(f.readiness === k)}>
                    <b>{o.label}</b>
                    <span style={{ fontSize: 10, opacity: 0.8 }}>× {o.mult.toFixed(1)}</span>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>{READY_OPTS[f.readiness].desc}</div>

              <Lbl hint="依 Q6 空間機能 + Q7 時程自動判定，可手動調整" style={{ marginTop: 14 }}>明確度係數</Lbl>
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.entries(SPEC_OPTS).map(([k, o]) => (
                  <button key={k} onClick={() => set('specTier', k)} style={cstyles.pill(f.specTier === k)}>
                    <b>{o.label}</b>
                    <span style={{ fontSize: 10, opacity: 0.8 }}>× {o.mult.toFixed(1)}</span>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>{SPEC_OPTS[f.specTier].desc}</div>
            </div>
          </details>

          <details open style={{ marginBottom: 14 }}>
            <summary>④ 費用設定</summary>
            <div style={{ padding: '10px 0' }}>
              <div className="grid2">
                <div>
                  <Lbl>基礎費率</Lbl>
                  <NumInput value={f.baseRate} onChange={v => set('baseRate', v)} suffix="NT$/hr" />
                </div>
                <div>
                  <Lbl>稅率</Lbl>
                  <NumInput value={f.taxRate} onChange={v => set('taxRate', v)} suffix="%" />
                </div>
                <div>
                  <Lbl>基礎時數</Lbl>
                  <NumInput value={f.baseHours} onChange={v => set('baseHours', v)} suffix="hr" />
                </div>
                <div>
                  <Lbl>加購時數</Lbl>
                  <NumInput value={f.addHours} onChange={v => set('addHours', v)} suffix="hr" />
                </div>
              </div>
              <div style={{ ...cstyles.block, marginTop: 12 }}>
                <Lbl hint="按需要填入；0 則顯示為「另案」">圖說專案費</Lbl>
                <NumInput value={f.drawingFee} onChange={v => set('drawingFee', v)} suffix="NT$" />
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #e2e2e2' }}>
                <Lbl hint="報價後再給的折讓；填折扣 % 或優惠單價，互相換算">專案優惠價（折讓）</Lbl>
                <div className="grid2">
                  <div>
                    <Lbl>折扣</Lbl>
                    <NumInput value={f.discountPct} onChange={onDiscPct} suffix="% off" />
                  </div>
                  <div>
                    <Lbl>優惠後單價</Lbl>
                    <NumInput value={f.discountRate} onChange={onDiscRate} suffix="NT$/hr" />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 6, lineHeight: 1.6 }}>
                  原適用費率 <b className="mono">{ntd(m.hourly)}</b> / hr
                  {m.hasDiscount &&
                  <span> 　→　優惠 <b className="mono" style={{ color: 'var(--brand)' }}>{ntd(m.effHourly)}</b> / hr（折讓 {m.discountPct}%）</span>}
                </div>
              </div>
            </div>
          </details>

          {/* Compact summary */}
          <div className="calc-summary">
            <div className="row"><span>適用費率</span>
              <b className="mono">{m.hasDiscount ?
                <span><span style={{ textDecoration: 'line-through', color: '#9a9a9a', fontWeight: 400, marginRight: 6 }}>{ntd(m.hourly)}</span><span style={{ color: 'var(--brand)' }}>{ntd(m.effHourly)}</span></span> :
                ntd(m.hourly)}</b>
            </div>
            <div className="row"><span>小計</span><span className="mono">{ntd(m.subtotal)}</span></div>
            <div className="row"><span>稅 {m.taxRate}%</span><span className="mono">{ntd(m.tax)}</span></div>
            <div className="row total"><span>總額</span><b className="mono">{ntd(m.total)}</b></div>
          </div>

        </aside>

        {/* ====== Right: preview ====== */}
        <main className={"calc-preview view-" + view}>
          {(view === 'internal' || view === 'both') && (
            <div className="quote-wrap" data-quote="internal">
              <InternalQuote f={f} m={m} />
            </div>
          )}
          {(view === 'client' || view === 'both') && (
            <div className="quote-wrap" data-quote="client">
              <ClientQuote f={f} m={m} />
            </div>
          )}
        </main>
      </div>

    </div>
  );
};

window.Calculator = Calculator;

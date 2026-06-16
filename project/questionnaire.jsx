// Online fillable questionnaire — controlled React form

const { useState, useMemo, useRef } = React;

const labels = {
  condition: ['毛胚屋', '含基本裝修之標準辦公室單元', '舊辦公室，需要全部或局部拆除', '其他'],
  docs: ['現況 CAD 平面圖', '有基本尺寸標記之 PDF／紙本掃描／手繪圖', '現場照片／影片', '初步的座位配置草圖'],
  topics: [
  '座位與機能空間的「動線配置」',
  '地板、牆面等「建材挑選與配色」',
  '辦公家具、窗簾等「家具與軟裝」',
  '弱電、插座、燈具迴路「水電配置」',
  '工序、發包流程與工法諮詢'],

  spaces: ['開放辦公區', '獨立主管室', '會議室', '洽談區／休憩茶水區', '機房／儲藏室／輸出印表機區'],
  acks: [
  ['ack-self', '服務性質', '我了解本服務為「線上口頭諮詢顧問」，後續圖面修訂、發包、監工與工程品質將由我方（客戶）自行負責。'],
  ['ack-fee', '圖說費用', '我了解諮詢費不包含施工圖說；若諮詢過程中評估有出圖需求，將另行計價。'],
  ['ack-com', '通訊範圍', '我了解諮詢時段外所接收之問題，其回覆形式將由設計師依問題複雜度判斷；若議題較為複雜，相關建議可能會併入下一次諮詢時段中提供。'],
  ['ack-dis', '免責聲明', '最終施工尺寸、建材收邊、工程品質、工班管理、驗收結果與任何發包／付款／合約爭議，均由我方（客戶）自行負責。']]

};

// half-width digits only — strips everything that isn't 0-9; also converts full-width digits.
const toHalfDigit = (v) => String(v).
replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)).
replace(/[^0-9]/g, '');

// Stable per-session questionnaire ID; format: YYYYMMDD-XX (2 uppercase letters)
function useQuestionnaireId() {
  const ref = React.useRef(null);
  if (!ref.current) {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const L = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
    ref.current = `${yyyy}${mm}${dd}-${L()}${L()}`;
  }
  return ref.current;
}

const NumField = ({ value, onChange, suffix, width = 110 }) =>
<span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
    <span style={{ fontSize: 13 }}>約</span>
    <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    value={value}
    onChange={(e) => onChange(toHalfDigit(e.target.value))}
    style={{
      width, border: 0, borderBottom: '1px solid #000',
      background: 'transparent', textAlign: 'center',
      fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 500,
      padding: '2px 0', outline: 'none'
    }} />
  
    <span style={{ fontSize: 13 }}>{suffix}</span>
  </span>;


const Radio = ({ name, value, checked, onChange, children }) =>
<label className="opt-row" style={{ cursor: 'pointer' }}>
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange}
  style={{ accentColor: '#000', width: 14, height: 14, margin: 0, flexShrink: 0 }} />
    <span className="lbl">{children}</span>
  </label>;

const Cbox = ({ checked, onChange, children }) =>
<label className="opt-row" style={{ cursor: 'pointer' }}>
    <input type="checkbox" checked={checked} onChange={onChange}
  style={{ accentColor: '#000', width: 14, height: 14, margin: 0, flexShrink: 0 }} />
    <span className="lbl">{children}</span>
  </label>;


const Field = ({ value, onChange, placeholder, style }) =>
<input type="text" value={value} onChange={(e) => onChange(e.target.value)}
placeholder={placeholder}
style={{
  width: '100%', border: 0, borderBottom: '1px solid #000',
  background: 'transparent', padding: '4px 0', fontFamily: 'inherit',
  fontSize: 13, outline: 'none', ...style
}} />;


const SectHead = ({ idx, title, hint }) =>
<div className="section-head">
    <span className="idx">{idx}</span>
    <span className="ttl">{title}</span>
    {hint && <span className="hint">{hint}</span>}
  </div>;

const PartHead = ({ title, lead }) =>
<div className="part-head">
    <div className="pt">{title}</div>
    {lead && <div className="plead">{lead}</div>}
  </div>;


function buildSummary(s, id) {
  const checked = (arr, sel) => sel.map((i) => arr[i]).filter(Boolean);
  const lines = [];
  lines.push('=========================================');
  lines.push('  辦公室裝修線上諮詢 — 前置評估問卷');
  lines.push('=========================================');
  lines.push('');
  lines.push(`問卷單號：${id}`);
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  lines.push(`填表日期：${yyyy} / ${mm} / ${dd}`);
  lines.push(`客戶／公司：${s.company || '＿＿'}`);
  lines.push(`聯絡人：${s.contact || '＿＿'}`);
  lines.push(`LINE ID：${s.line || '＿＿'}　　電話：${s.phone || '＿＿'}`);
  lines.push(`地址：${s.address || '＿＿'}`);
  lines.push('');
  lines.push('— 第一部分　規模 ——————————————');
  const scaleText = s.scaleNum ? `約 ${s.scaleNum} 坪` : '（未填）';
  lines.push(`Q1 坪數：${scaleText}`);
  lines.push(`Q2 人數：${s.headcountNum ? `約 ${s.headcountNum} 人` : '（未填）'}`);
  const condText = s.condition === 3 ? `其他：${s.conditionOther || ''}` : labels.condition[s.condition] ?? '（未填）';
  lines.push(`Q3 現況：${condText}`);
  lines.push('');
  lines.push('— 服務購買 ————————————————');
  lines.push(`基礎時數：${s.agreeBase ? '5 小時（必購）' : '（未同意）'}`);
  const addPlanText = s.addHoursPlan === 'none' ? '暫不加購' : s.addHoursPlan ? `${s.addHoursPlan} 小時` : '（未填）';
  lines.push(`預計加購時數：${addPlanText}`);
  lines.push('');
  lines.push('— 第二部分　準備度 ————————————');
  lines.push(`Q4 可提供資料：${checked(labels.docs, s.docs).join('、') || '（未勾選）'}${s.docsOther ? '；其他：' + s.docsOther : ''}`);
  lines.push(`Q5 諮詢重點：${checked(labels.topics, s.topics).join('、') || '（未勾選）'}${s.topicsOther ? '；其他：' + s.topicsOther : ''}`);
  lines.push('');
  lines.push('— 第三部分　需求明確度 ————————');
  const spaceList = [];
  if (s.spaces[0]) spaceList.push('開放辦公區');
  if (s.spaces[1]) spaceList.push(`獨立主管室 共 ${s.execRooms || '_'} 間`);
  if (s.spaces[2]) spaceList.push(`會議室 共 ${s.meetRooms || '_'} 間／容納 ${s.meetCap || '_'} 人`);
  if (s.spaces[3]) spaceList.push('洽談區／休憩茶水區');
  if (s.spaces[4]) spaceList.push('機房／儲藏室／輸出印表機區');
  if (s.spacesOther) spaceList.push(`其他：${s.spacesOther}`);
  lines.push(`Q6 空間機能：${spaceList.join('、') || '（未勾選）'}`);
  lines.push(`Q7 時程：開工 ${s.startDate || '＿＿'}　進駐 ${s.moveDate || '＿＿'}`);
  lines.push('');
  lines.push('— 第四部分　確認事項 ————————');
  labels.acks.forEach(([k, t]) => {
    lines.push(`[${s.acks[k] ? '✓' : ' '}] ${t}`);
  });
  lines.push('');
  lines.push('=========================================');
  return lines.join('\n');
}

const Questionnaire = () => {
  const [s, setS] = useState({
    company: '', contact: '', line: '', phone: '', address: '', date: '',
    scaleNum: '', headcountNum: '', condition: null, conditionOther: '',
    docs: [], docsOther: '',
    topics: [], topicsOther: '',
    spaces: [false, false, false, false, false], spacesOther: '',
    execRooms: '', meetRooms: '', meetCap: '',
    agreeBase: false, addHoursPlan: '',
    startDate: '', moveDate: '',
    acks: { 'ack-self': false, 'ack-fee': false, 'ack-com': false, 'ack-dis': false }
  });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const qid = useQuestionnaireId();
  const summaryRef = useRef(null);
  const summary = useMemo(() => buildSummary(s, qid), [s, qid]);

  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));
  const toggleArr = (k, i) => setS((p) => {
    const next = p[k].includes(i) ? p[k].filter((x) => x !== i) : [...p[k], i];
    return { ...p, [k]: next };
  });
  const toggleSpace = (i) => setS((p) => {
    const arr = [...p.spaces];arr[i] = !arr[i];return { ...p, spaces: arr };
  });
  const setAck = (k, v) => setS((p) => ({ ...p, acks: { ...p.acks, [k]: v } }));

  const allAck = labels.acks.every(([k]) => s.acks[k]);
  const required = s.scaleNum && s.headcountNum && s.condition !== null && s.company && s.contact && s.agreeBase && s.addHoursPlan && allAck;

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      summaryRef.current?.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="hf">
      <div className="sheet" style={{ maxWidth: 900, margin: '0 auto' }}>

        <header className="header" style={{ display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
            <div className="eyebrow">OFFICE FIT-OUT · PRE-CONSULTATION QUESTIONNAIRE</div>
            <img src="assets/logo-circle.png" alt="IMU Framework" style={{ flexShrink: 0, display: 'block', width: "48px", height: "48px" }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, marginTop: 14 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ marginTop: 0 }}>辦公室裝修線上諮詢服務</h1>
              <p className="lead" style={{ marginTop: 14, maxWidth: 560 }}>為能高度自主執行的客戶設計的顧問服務。 我們在線上提供方向性建議與專業判斷，協助您主導決策、自行繪圖、發包與監工。</p>
            </div>
            <div className="header-meta">
              <div>問卷單號</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand)', letterSpacing: '0.04em' }}>{qid}</div>
            </div>
          </div>
        </header>

        {/* Service model */}
        <section className="section" style={{ margin: "0px" }}>
          <PartHead num="01" title="服務模式" lead="三層計費結構：基礎時數、彈性加購、圖說專案。" />
          <div className="grid-3">
            <div className="card">
              <div className="num mono">A</div>
              <div className="label">基礎諮詢時數</div>
              <div className="ttl">最低購買 5 小時</div>
              <div className="desc">單次預約最低 1 小時。可預約時段為週一至週四 14:00–18:00，提前二天以 LINE 預約。首次諮詢前完款。</div>
              <div className="card-input">
                <label className="agree">
                  <input type="checkbox" checked={s.agreeBase} onChange={(e) => set('agreeBase', e.target.checked)} />
                  <span>同意帶入 5 小時購買量<span style={{ color: '#c33', marginLeft: 4 }}>＊</span></span>
                </label>
              </div>
            </div>
            <div className="card">
              <div className="num mono">B</div>
              <div className="label">彈性加購時數</div>
              <div className="ttl">以 1 小時為單位</div>
              <div className="desc">超過基礎時數後，可彈性加購，費率相同。可於諮詢前付款，或計入當月請款表。</div>
              <div className="card-input">
                <div className="ci-lbl">預計加購時數<span className="req">＊</span></div>
                <select value={s.addHoursPlan} onChange={(e) => set('addHoursPlan', e.target.value)}>
                  <option value="">請選擇…</option>
                  <option value="1">1 小時</option>
                  <option value="2">2 小時</option>
                  <option value="3">3 小時</option>
                  <option value="4">4 小時</option>
                  <option value="5">5 小時</option>
                  <option value="none">暫不加購</option>
                </select>
              </div>
            </div>
            <div className="card">
              <div className="num mono">C</div>
              <div className="label">圖說專案</div>
              <div className="ttl">By Project · 另案報價</div>
              <div className="desc">若有專業文件（如細部大樣、BOM 表、放樣圖等）若於諮詢過程中評估需出圖，將不計入時數，另行報價。</div>
            </div>
          </div>
          <div className="callout" style={{ marginTop: 22 }}>
            <strong>計費邏輯</strong>　  費率將依「規模」、「準備度」與「需求明確度」微幅調整。 收到本問卷後，我方將於 1 個工作日內回覆專屬報價單。
          
          </div>
        </section>

        <section className="section">
          <PartHead num="02" title="前置評估問卷" lead="請協助填寫以下資訊，讓接下來的諮詢能直擊核心。這份問卷同時能協助您梳理需求。　＊ 標示為必填。" />
        </section>

        {/* Contact */}
        <section className="section">
          <SectHead idx="01" title="基本聯絡資訊" />
          <div className="grid-2" style={{ rowGap: 18 }}>
            <div><div className="field-lbl">客戶／公司名稱　＊</div><Field value={s.company} onChange={(v) => set('company', v)} /></div>
            <div><div className="field-lbl">聯絡人　＊</div><Field value={s.contact} onChange={(v) => set('contact', v)} /></div>
            <div><div className="field-lbl">LINE ID</div><Field value={s.line} onChange={(v) => set('line', v)} /></div>
            <div><div className="field-lbl">電話</div><Field value={s.phone} onChange={(v) => set('phone', v)} /></div>
            <div style={{ gridColumn: '1 / -1' }}><div className="field-lbl">辦公室地址／商辦名稱</div><Field value={s.address} onChange={(v) => set('address', v)} /></div>
          </div>
        </section>

        {/* Q1-3 */}
        <section className="section">
          <SectHead idx="02" title="規模判定" hint="Scale" />

          <div className="q">
            <div className="q-label"><span className="num">Q1 ＊</span>預計裝修的辦公室實際坪數<span className="mute">（專有，不含公設）</span></div>
            <div style={{ padding: '4px 0 2px' }}>
              <NumField value={s.scaleNum} onChange={(v) => set('scaleNum', v)} suffix="坪" width={120} />
              <span className="small mute" style={{ marginLeft: 12 }}>只能填寫半形數字</span>
            </div>
          </div>

          <div className="q">
            <div className="q-label"><span className="num">Q2 ＊</span>預計進駐的總人數<span className="mute">（含主管、流動座位）</span></div>
            <div style={{ padding: '4px 0 2px' }}>
              <NumField value={s.headcountNum} onChange={(v) => set('headcountNum', v)} suffix="人" width={120} />
              <span className="small mute" style={{ marginLeft: 12 }}>只能填寫半形數字</span>
            </div>
          </div>

          <div className="q">
            <div className="q-label"><span className="num">Q3 ＊</span>辦公室目前的現況</div>
            <div className="options">
              {labels.condition.map((t, i) =>
              <div key={i}>
                  <Radio name="condition" value={i} checked={s.condition === i} onChange={() => set('condition', i)}>
                    {t}
                    {i === 3 && s.condition === 3 &&
                  <span style={{ display: 'inline-block', marginLeft: 8, minWidth: 260 }}>
                        <Field value={s.conditionOther} onChange={(v) => set('conditionOther', v)} placeholder="請描述" style={{ height: 22 }} />
                      </span>
                  }
                  </Radio>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Q4-5 */}
        <section className="section">
          <SectHead idx="03" title="客戶狀態與資料準備度" hint="Readiness" />

          <div className="q">
            <div className="q-label"><span className="num">Q4</span>關於空間圖面，您目前能提供什麼資料？<span className="opt">複選</span></div>
            <div className="options cols-2">
              {labels.docs.map((t, i) => <Cbox key={i} checked={s.docs.includes(i)} onChange={() => toggleArr('docs', i)}>{t}</Cbox>)}
            </div>
            <div style={{ marginTop: 8 }}>
              <div className="field-lbl">其他</div><Field value={s.docsOther} onChange={(v) => set('docsOther', v)} />
            </div>
          </div>

          <div className="q">
            <div className="q-label"><span className="num">Q5</span>本次諮詢的重點主題<span className="opt">複選</span></div>
            <div className="options cols-2">
              {labels.topics.map((t, i) => <Cbox key={i} checked={s.topics.includes(i)} onChange={() => toggleArr('topics', i)}>{t}</Cbox>)}
            </div>
            <div style={{ marginTop: 8 }}>
              <div className="field-lbl">其他</div><Field value={s.topicsOther} onChange={(v) => set('topicsOther', v)} />
            </div>
          </div>
        </section>

        {/* Q6-7 */}
        <section className="section">
          <SectHead idx="04" title="需求明確度" hint="Spec" />

          <div className="q">
            <div className="q-label"><span className="num">Q6</span>空間機能需求<span className="opt">勾選必要空間</span></div>
            <div className="options cols-2">
              <Cbox checked={s.spaces[0]} onChange={() => toggleSpace(0)}>開放辦公區</Cbox>
              <Cbox checked={s.spaces[1]} onChange={() => toggleSpace(1)}>
                <span>獨立主管室　共 </span>
                <input type="text" value={s.execRooms} onChange={(e) => set('execRooms', e.target.value)}
                style={{ width: 48, border: 0, borderBottom: '1px solid #000', background: 'transparent', textAlign: 'center', fontFamily: 'inherit' }} />
                <span> 間</span>
              </Cbox>
              <Cbox checked={s.spaces[2]} onChange={() => toggleSpace(2)}>
                <span>會議室　共 </span>
                <input type="text" value={s.meetRooms} onChange={(e) => set('meetRooms', e.target.value)}
                style={{ width: 36, border: 0, borderBottom: '1px solid #000', background: 'transparent', textAlign: 'center', fontFamily: 'inherit' }} />
                <span> 間／容納 </span>
                <input type="text" value={s.meetCap} onChange={(e) => set('meetCap', e.target.value)}
                style={{ width: 36, border: 0, borderBottom: '1px solid #000', background: 'transparent', textAlign: 'center', fontFamily: 'inherit' }} />
                <span> 人</span>
              </Cbox>
              <Cbox checked={s.spaces[3]} onChange={() => toggleSpace(3)}>洽談區／休憩茶水區</Cbox>
              <Cbox checked={s.spaces[4]} onChange={() => toggleSpace(4)}>機房／儲藏室／輸出印表機區</Cbox>
            </div>
            <div style={{ marginTop: 8 }}>
              <div className="field-lbl">其他特殊需求</div><Field value={s.spacesOther} onChange={(v) => set('spacesOther', v)} />
            </div>
          </div>

          <div className="q">
            <div className="q-label"><span className="num">Q7</span>時程</div>
            <div className="grid-2">
              <div><div className="field-lbl">預計開工日期</div><Field value={s.startDate} onChange={(v) => set('startDate', v)} placeholder="YYYY / MM / DD" /></div>
              <div><div className="field-lbl">預計進駐日期</div><Field value={s.moveDate} onChange={(v) => set('moveDate', v)} placeholder="YYYY / MM / DD" /></div>
            </div>
          </div>
        </section>

        {/* Acks */}
        <section className="section">
          <SectHead idx="05" title="諮詢須知與免責確認" hint="＊ 必勾選" />
          <div className="stack">
            {labels.acks.map(([k, t, body]) =>
            <label key={k} className="ack" style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={s.acks[k]} onChange={(e) => setAck(k, e.target.checked)}
              style={{ accentColor: '#000', width: 14, height: 14, margin: '4px 0 0', flexShrink: 0 }} />
                <div className="body"><b>{t}</b>　{body}</div>
              </label>
            )}
          </div>
        </section>

        {/* Submit */}
        <section className="section">
          <div className="card" style={{ background: 'var(--paper-2)', padding: '20px 24px' }}>
            <div className="label" style={{ marginBottom: 8 }}>送出方式</div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>填妥後請按下「產生摘要」按鈕，將結果複製貼到 LINE 回傳給我們。我方收件後將於 1 個工作日內回覆專屬報價單。

            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
              <button
                onClick={() => setSubmitted(true)}
                disabled={!required}
                style={{
                  padding: '12px 28px', border: '1.5px solid ' + (required ? 'var(--brand)' : '#bbb'),
                  background: required ? 'var(--brand)' : '#bbb', color: '#fff',
                  cursor: required ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                  letterSpacing: '0.05em'
                }}>
                產生摘要
              </button>
              {!required && <span className="small mute">＊ 請填妥必填欄位並勾選四項確認事項</span>}
              {required && !submitted && <span className="small mute">已準備好送出</span>}
            </div>
          </div>
        </section>

        {/* Result panel */}
        {submitted &&
        <section className="section">
            <SectHead idx="06" title="問卷摘要" hint="Copy & send via LINE" />
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <button
              onClick={doCopy}
              style={{ padding: '10px 22px', border: '1.5px solid var(--brand)', background: 'var(--brand)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                {copied ? '✓ 已複製' : '複製到剪貼簿'}
              </button>
              <button
              onClick={() => setSubmitted(false)}
              style={{ padding: '10px 22px', border: '1.5px solid #000', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                重新編輯
              </button>
            </div>
            <textarea
            ref={summaryRef}
            readOnly
            value={summary}
            style={{
              width: '100%', minHeight: 420,
              padding: 16, border: '1px solid #000', background: '#fafafa',
              fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.6,
              resize: 'vertical', boxSizing: 'border-box'
            }} />
          </section>
        }

        <div className="foot" style={{ gap: "10px", flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="lt" style={{ width: "100%" }}>本問卷僅作評估用，不構成服務承諾。問卷未經授權不得重製、散布或作商業用途。
 © 2026 一畝框作有限公司 IMU Framework Ltd. All rights reserved.
          </div>
        </div>

      </div>
    </div>);

};

window.Questionnaire = Questionnaire;
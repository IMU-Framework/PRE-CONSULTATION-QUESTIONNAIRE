// Hi-Fi 1-pager — 服務說明 + 前置評估問卷

const Cb = ({ round }) => <span className={"check" + (round ? " r" : "")} />;
const Opt = ({ children, round }) => (
  <div className="opt-row"><Cb round={round} /><span className="lbl">{children}</span></div>
);
const SectHead = ({ idx, title, hint }) => (
  <div className="section-head">
    <span className="idx">{idx}</span>
    <span className="ttl">{title}</span>
    {hint && <span className="hint">{hint}</span>}
  </div>
);

const HiFiOnePager = () => (
  <div className="hf">
    <div className="sheet">

      {/* Masthead */}
      <header className="header">
        <div>
          <div className="eyebrow">CONSULTING · OFFICE FIT-OUT · 2026</div>
          <h1 style={{ marginTop: 12 }}>辦公室裝修<br />線上諮詢服務</h1>
          <p className="lead" style={{ marginTop: 14, maxWidth: 520 }}>
            為「自繪 PPT、自行發包」的高自主性客戶設計的顧問服務。
            我們在線上提供方向性建議與專業判斷，由您主導決策、自行發包執行。
          </p>
        </div>
        <div className="header-meta">
          <div>FORM <b>OFC-CSL-01</b></div>
          <div>REV. <b>2026 / 01</b></div>
          <div>SHEET <b>1 / 1</b></div>
        </div>
      </header>

      {/* Service model */}
      <section className="section">
        <SectHead idx="I" title="服務模式" hint="Three-tier billing" />
        <div className="grid-3">
          <div className="card">
            <div className="num serif">A</div>
            <div className="label">基礎諮詢時數</div>
            <div className="ttl">最低購買 5 小時</div>
            <div className="desc">單次預約最低 1 小時。可預約時段為週一至週四 14:00 – 18:00，請於諮詢前二天以 LINE 預約，並於首次諮詢前完款。</div>
          </div>
          <div className="card">
            <div className="num serif">B</div>
            <div className="label">彈性加購時數</div>
            <div className="ttl">以 1 小時為單位</div>
            <div className="desc">超過基礎時數後彈性加購，計費同基礎時數。可於諮詢前付款或計入當月請款表。</div>
          </div>
          <div className="card">
            <div className="num serif">C</div>
            <div className="label">圖說專案</div>
            <div className="ttl">By Project · 另案報價</div>
            <div className="desc">大樣圖、BOM 表、放樣圖等若於諮詢過程中評估需出圖，將不計入時數，另行報價。</div>
          </div>
        </div>

        <div className="callout" style={{ marginTop: 22 }}>
          <strong>計費邏輯</strong>　&nbsp;&nbsp;費率依「辦公室規模係數」與「客戶準備度係數」調整。
          收到本問卷後，我方將於 1 – 2 個工作日內回覆專屬報價單。<span className="mute" style={{ marginLeft: 6 }}>本頁不揭露單價。</span>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <SectHead idx="II" title="合作流程" hint="From form to wrap" />
        <div className="steps">
          {[
            ['STEP 01', '填寫問卷', '了解規模與資料準備度'],
            ['STEP 02', '評估＋報價', '我方產出客製報價單'],
            ['STEP 03', '確認付款', '首次諮詢前完款'],
            ['STEP 04', '線上諮詢', '週一 ～ 週四 14:00–18:00'],
            ['STEP 05', '加購／結案', '依需求加購時數或圖說'],
          ].map(([n, t, d]) => (
            <div className="step" key={n}>
              <div className="n">{n}</div>
              <div className="t">{t}</div>
              <div className="d">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="ornament">· · ·</div>

      {/* Questionnaire intro */}
      <section className="section" style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 28 }}>前置評估問卷</h2>
        <p className="lead" style={{ marginTop: 10, maxWidth: 640 }}>
          請協助填寫以下資訊，讓接下來的諮詢能直擊核心。這份問卷同時能協助您梳理需求。
        </p>
      </section>

      {/* Part 1 */}
      <section className="section">
        <SectHead idx="01" title="基本資訊與規模判定" hint="Scale" />

        <div className="q">
          <div className="q-label"><span className="num">Q1</span>預計裝修的辦公室實際坪數<span className="mute">（專有，不含公設）</span></div>
          <div className="options"><Opt round>30 坪以下</Opt><Opt round>31 – 60 坪</Opt><Opt round>61 坪以上</Opt></div>
        </div>

        <div className="q">
          <div className="q-label"><span className="num">Q2</span>預計進駐的總人數<span className="mute">（含主管、流動座位）</span></div>
          <div className="options"><Opt round>10 人以內</Opt><Opt round>11 – 40 人</Opt><Opt round>41 人以上</Opt></div>
        </div>

        <div className="q">
          <div className="q-label"><span className="num">Q3</span>辦公室目前的現況</div>
          <div className="options">
            <Opt round>毛胚屋</Opt>
            <Opt round>含基本裝修之標準辦公室單元（輕鋼架天花板、基本照明、高架地板或方塊地毯等）</Opt>
            <Opt round>舊辦公室，需要全部或局部拆除</Opt>
            <Opt round>其他<span className="input" style={{ minWidth: 320 }} /></Opt>
          </div>
        </div>
      </section>

      {/* Part 2 */}
      <section className="section">
        <SectHead idx="02" title="客戶狀態與資料準備度" hint="Readiness" />

        <div className="q">
          <div className="q-label"><span className="num">Q4</span>關於空間圖面，您目前能提供什麼資料？<span className="opt">複選</span></div>
          <div className="options cols-2">
            <Opt>現況 CAD 平面圖</Opt>
            <Opt>有基本尺寸標記之 PDF／紙本掃描／手繪圖</Opt>
            <Opt>現場照片／影片</Opt>
            <Opt>初步的座位配置草圖</Opt>
          </div>
          <div style={{ marginTop: 6 }}><Opt>其他<span className="input" style={{ minWidth: 360 }} /></Opt></div>
        </div>

        <div className="q">
          <div className="q-label"><span className="num">Q5</span>本次諮詢的重點主題<span className="opt">複選</span></div>
          <div className="options cols-2">
            <Opt>座位與機能空間的「動線配置」</Opt>
            <Opt>地板、牆面等「建材挑選與配色」</Opt>
            <Opt>辦公家具、窗簾等「家具與軟裝」</Opt>
            <Opt>弱電、插座、燈具迴路「水電配置」</Opt>
            <Opt>工序、發包流程與工法諮詢</Opt>
            <Opt>其他<span className="input" style={{ minWidth: 200 }} /></Opt>
          </div>
        </div>
      </section>

      {/* Part 3 */}
      <section className="section">
        <SectHead idx="03" title="需求明確度" hint="Spec" />

        <div className="q">
          <div className="q-label"><span className="num">Q6</span>空間機能需求<span className="opt">勾選必要空間</span></div>
          <div className="options cols-2">
            <Opt>開放辦公區</Opt>
            <Opt>獨立主管室　共 <span className="input" style={{ minWidth: 48 }} /> 間</Opt>
            <Opt>會議室　共 <span className="input" style={{ minWidth: 36 }} /> 間／容納 <span className="input" style={{ minWidth: 36 }} /> 人</Opt>
            <Opt>洽談區／休憩茶水區</Opt>
            <Opt>機房／儲藏室／輸出印表機區</Opt>
            <Opt>其他<span className="input" style={{ minWidth: 200 }} /></Opt>
          </div>
        </div>

        <div className="q">
          <div className="q-label"><span className="num">Q7</span>時程</div>
          <div className="grid-2">
            <div><div className="field-lbl">預計開工日期</div><div className="field" /></div>
            <div><div className="field-lbl">預計進駐日期</div><div className="field" /></div>
          </div>
        </div>
      </section>

      {/* Part 4 */}
      <section className="section">
        <SectHead idx="04" title="諮詢須知與免責確認" hint="必勾選 · Acknowledge" />
        <div className="stack">
          <div className="ack">
            <Cb />
            <div className="body"><b>自主發包性質確認</b>　我了解本服務為「線上口頭諮詢顧問」，後續圖面修訂、發包、監工與工程品質將由我方（客戶）自行負責。</div>
          </div>
          <div className="ack">
            <Cb />
            <div className="body"><b>圖說費用確認</b>　我了解諮詢費不包含施工圖說；若諮詢過程中評估有出圖需求，將另行計價。</div>
          </div>
          <div className="ack">
            <Cb />
            <div className="body"><b>限時通訊確認</b>　我了解諮詢時段外所接收之問題，其回覆形式將由設計師依問題複雜度判斷；若議題較為複雜，相關建議可能會併入下一次諮詢時段中提供。</div>
          </div>
          <div className="ack">
            <Cb />
            <div className="body"><b>免責聲明</b>　最終施工尺寸、建材收邊、工程品質、工班管理、驗收結果與任何發包／付款／合約爭議，均由我方（客戶）自行負責。</div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section">
        <SectHead idx="05" title="聯絡資訊與簽認" />
        <div className="grid-2" style={{ rowGap: 18 }}>
          <div><div className="field-lbl">客戶 / 公司名稱</div><div className="field" /></div>
          <div><div className="field-lbl">聯絡人</div><div className="field" /></div>
          <div><div className="field-lbl">LINE ID</div><div className="field" /></div>
          <div><div className="field-lbl">電話</div><div className="field" /></div>
          <div style={{ gridColumn: '1 / -1' }}><div className="field-lbl">辦公室地址</div><div className="field" /></div>
          <div><div className="field-lbl">填表日期</div><div className="field" /></div>
          <div><div className="field-lbl">簽名</div><div className="field" /></div>
        </div>
      </section>

      <div className="foot">
        <div className="lt">填妥後請以 LINE 回傳。我方收件後 1 – 2 個工作日內回覆專屬報價單。本問卷僅作評估用，不構成服務承諾。</div>
        <div className="stamp">REV. 2026 · 01</div>
      </div>

    </div>
  </div>
);

window.HiFiOnePager = HiFiOnePager;

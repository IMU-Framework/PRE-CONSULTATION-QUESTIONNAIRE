// 1-pager：服務說明 + 前置評估問卷（不顯示價格）

const Check = ({ round }) => <span className={"check" + (round ? " r" : "")} />;

const Option = ({ children, round }) => (
  <div className="option"><Check round={round} /><span className="lbl">{children}</span></div>
);

const SectionTitle = ({ num, title, tag }) => (
  <div className="sect-title">
    <span className="sect-num">{num}</span>
    <h3>{title}</h3>
    {tag && <span className="tag">{tag}</span>}
  </div>
);

const OnePager = () => (
  <div className="wf">
    <div className="sheet">

      {/* Header */}
      <div className="header">
        <div className="corner">1-PAGER · 客戶閱讀文件 · A4 直式</div>
        <div className="eyebrow">CONSULTING · OFFICE FIT-OUT</div>
        <h1 style={{ marginTop: 8 }}>辦公室裝修線上諮詢服務</h1>
        <div className="sub">給「自繪 PPT、自行發包」的高自主性客戶 — 我們是顧問，不是設計執行者</div>
      </div>

      {/* Service overview */}
      <div className="sect">
        <SectionTitle num="01" title="服務模式概覽" />
        <div className="row" style={{ marginBottom: 12 }}>
          <div className="col">
            <div className="anno">三層計費結構 / 不在問卷顯示金額</div>
            <div className="stack" style={{ marginTop: 6 }}>
              <div className="box" style={{ padding: 12 }}>
                <div className="mono small">A · 基礎諮詢時數</div>
                <div style={{ fontWeight: 500, marginTop: 4 }}>最低購買 5 小時</div>
                <div className="small" style={{ marginTop: 4 }}>單次預約最低 1 小時 · 議程由客戶主導</div>
              </div>
              <div className="box" style={{ padding: 12 }}>
                <div className="mono small">B · 彈性加購時數</div>
                <div style={{ fontWeight: 500, marginTop: 4 }}>超額以 1 小時為單位加購</div>
                <div className="small" style={{ marginTop: 4 }}>諮詢前付款或計入當月請款表</div>
              </div>
              <div className="box" style={{ padding: 12 }}>
                <div className="mono small">C · 圖說專案 By Project</div>
                <div style={{ fontWeight: 500, marginTop: 4 }}>大樣圖／BOM／放樣圖另計</div>
                <div className="small" style={{ marginTop: 4 }}>按張數或坪數另行報價</div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="anno">合作流程</div>
            <div className="stack" style={{ marginTop: 6 }}>
              {[
                ['STEP 01', '填問卷', '了解規模與資料準備度'],
                ['STEP 02', '評估＋報價', '我方產出客製報價單'],
                ['STEP 03', '確認＋付款', '首次諮詢前完款'],
                ['STEP 04', '線上諮詢', '週一 ～ 週四 14:00–18:00'],
                ['STEP 05', '加購／結案', '依需求加購時數或圖說'],
              ].map(([n, t, d]) => (
                <div className="box" key={n} style={{ padding: 10, display: 'flex', gap: 12, alignItems: 'baseline' }}>
                  <span className="mono small" style={{ minWidth: 56 }}>{n}</span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{t}</div>
                    <div className="small">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="callout">
          <strong>計費邏輯</strong>：費率依「辦公室規模」與「客戶準備度」兩項係數調整 — 收到本問卷後，我方會回寄專屬報價單再確認。
          <span className="anno" style={{ display: 'block', marginTop: 4 }}>本頁面不揭露單價</span>
        </div>
      </div>

      {/* PART 1 */}
      <div className="sect">
        <SectionTitle num="02" title="第一部分　基本資訊與規模判定" tag="決定規模係數" />

        <div className="q">
          <div className="q-label"><span className="n">Q1</span>預計裝修的辦公室實際坪數（專有，不含公設）</div>
          <Option>30 坪以下</Option>
          <Option>31 – 60 坪</Option>
          <Option>61 坪以上</Option>
        </div>

        <div className="q">
          <div className="q-label"><span className="n">Q2</span>預計進駐的總人數（含主管、流動座位）</div>
          <Option>10 人以內</Option>
          <Option>11 – 40 人</Option>
          <Option>41 人以上</Option>
        </div>

        <div className="q">
          <div className="q-label"><span className="n">Q3</span>辦公室目前的現況</div>
          <Option>毛胚屋</Option>
          <Option>含基本裝修之標準辦公室單元（輕鋼架／基本照明／高架地板或方塊地毯等）</Option>
          <Option>舊辦公室，需要全部或局部拆除</Option>
          <Option>其他：<span className="input" style={{ minWidth: 280 }} /></Option>
        </div>
      </div>

      {/* PART 2 */}
      <div className="sect">
        <SectionTitle num="03" title="第二部分　客戶狀態與資料準備度" tag="決定客戶係數" />

        <div className="q">
          <div className="q-label"><span className="n">Q4</span>關於空間圖面，您目前能提供什麼資料？<span className="small">（可複選）</span></div>
          <div className="grid-2">
            <Option>現況 CAD 平面圖</Option>
            <Option>有基本尺寸標記之 PDF／紙本掃描／手繪圖</Option>
            <Option>現場照片／影片</Option>
            <Option>初步的座位配置草圖</Option>
          </div>
          <Option>其他：<span className="input" style={{ minWidth: 280 }} /></Option>
        </div>

        <div className="q">
          <div className="q-label"><span className="n">Q5</span>本次諮詢的重點主題<span className="small">（可複選）</span></div>
          <div className="grid-2">
            <Option>座位與機能空間的「動線配置」</Option>
            <Option>地板、牆面等「建材挑選與配色」</Option>
            <Option>辦公家具、窗簾等「家具與軟裝」</Option>
            <Option>弱電、插座、燈具迴路「水電配置」</Option>
            <Option>工序、發包流程與工法諮詢</Option>
            <Option>其他：<span className="input" style={{ minWidth: 180 }} /></Option>
          </div>
        </div>
      </div>

      {/* PART 3 */}
      <div className="sect">
        <SectionTitle num="04" title="第三部分　需求明確度" />

        <div className="q">
          <div className="q-label"><span className="n">Q6</span>空間機能需求<span className="small">（請勾選必要空間）</span></div>
          <div className="grid-2">
            <Option>開放辦公區</Option>
            <Option>獨立主管室　共 <span className="input" style={{ minWidth: 40 }} /> 間</Option>
            <Option>會議室　共 <span className="input" style={{ minWidth: 30 }} /> 間／容納 <span className="input" style={{ minWidth: 30 }} /> 人</Option>
            <Option>洽談區／休憩茶水區</Option>
            <Option>機房／儲藏室／輸出印表機區</Option>
            <Option>其他：<span className="input" style={{ minWidth: 180 }} /></Option>
          </div>
        </div>

        <div className="q">
          <div className="q-label"><span className="n">Q7</span>時程</div>
          <div className="row">
            <div className="col"><div className="small">預計開工日期</div><div className="field" /></div>
            <div className="col"><div className="small">預計進駐日期</div><div className="field" /></div>
          </div>
        </div>
      </div>

      {/* PART 4 */}
      <div className="sect">
        <SectionTitle num="05" title="第四部分　諮詢須知與免責確認" tag="必勾選" />
        <div className="stack">
          <div className="box-dash" style={{ padding: 12 }}>
            <Option><strong>【自主發包性質確認】</strong>　本服務為「線上口頭諮詢顧問」，後續圖面修訂、發包、監工與工程品質由客戶自行負責。</Option>
          </div>
          <div className="box-dash" style={{ padding: 12 }}>
            <Option><strong>【圖說費用確認】</strong>　諮詢費不含施工圖說；若評估有出圖需求，將另行報價。</Option>
          </div>
          <div className="box-dash" style={{ padding: 12 }}>
            <Option><strong>【限時通訊確認】</strong>　我了解諮詢時段外所接收之問題，其回覆形式將由設計師依問題複雜度判斷；若議題較為複雜，相關建議可能會併入下一次諮詢時段中提供。</Option>
          </div>
          <div className="box-dash" style={{ padding: 12 }}>
            <Option><strong>【免責聲明】</strong>　最終施工尺寸、收邊、工程品質、工班管理、驗收與發包／付款／合約爭議，均由客戶自行負責。</Option>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="sect">
        <SectionTitle num="06" title="基本聯絡資訊" />
        <div className="grid-2" style={{ rowGap: 16 }}>
          <div><div className="small">客戶／公司名稱</div><div className="field" /></div>
          <div><div className="small">聯絡人</div><div className="field" /></div>
          <div><div className="small">LINE ID</div><div className="field" /></div>
          <div><div className="small">電話</div><div className="field" /></div>
          <div style={{ gridColumn: '1 / -1' }}><div className="small">辦公室地址</div><div className="field" /></div>
          <div><div className="small">填表日期</div><div className="field" /></div>
          <div><div className="small">簽名</div><div className="field" /></div>
        </div>
      </div>

      <div className="sect" style={{ marginTop: 28, paddingTop: 12, borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div className="small">填妥後請以 LINE 回傳。我方收件後 1 – 2 個工作日內回覆專屬報價單。</div>
        <div className="stamp">REV. 2026 · 01</div>
      </div>

    </div>
  </div>
);

window.OnePager = OnePager;

"use client";

import { useState } from "react";

type Days = "2泊3日" | "3泊4日";
type Purpose = "観光" | "ゆるめ";

export default function Page() {
  const [days, setDays] = useState<Days>("2泊3日");
  const [people, setPeople] = useState<number>(4);
  const [purpose, setPurpose] = useState<Purpose>("観光");

  const [budget, setBudget] = useState(3);
  const [hotel, setHotel] = useState(3);
  const [food, setFood] = useState(4);
  const [move, setMove] = useState(3);

  const [result, setResult] = useState<string>("（まだ生成していません）");

  const box: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 14,
    background: "white"
  };

  return (
    <main style={{ background: "#f6f7f9", minHeight: "100vh", padding: 16 }}>
      <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>旅行工程ジェネレーター（東京発・王道）</h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>
          幹事が「行き先まで言い切った」70%完成の叩き台を作る。飯は王道、時間ラフは外さない。
        </p>

        <section style={box}>
          <div style={{ display: "grid", gap: 10 }}>
            <label>
              日数：
              <select value={days} onChange={(e) => setDays(e.target.value as Days)} style={{ marginLeft: 8 }}>
                <option value="2泊3日">2泊3日</option>
                <option value="3泊4日">3泊4日</option>
              </select>
            </label>

            <label>
              人数（1〜6）：
              <input
                type="number"
                min={1}
                max={6}
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                style={{ marginLeft: 8, width: 80 }}
              />
            </label>

            <label>
              目的：
              <select value={purpose} onChange={(e) => setPurpose(e.target.value as Purpose)} style={{ marginLeft: 8 }}>
                <option value="観光">観光</option>
                <option value="ゆるめ">ゆるめ</option>
              </select>
            </label>

            <Slider label="旅行にお金をかけたい度（節約↔記念）" v={budget} setV={setBudget} />
            <Slider label="宿の重視度（寝られればOK↔良い宿）" v={hotel} setV={setHotel} />
            <Slider label="食の重視度（最低限↔ご飯こだわる）" v={food} setV={setFood} />
            <Slider label="移動の快適さ（我慢OK↔快適重視）" v={move} setV={setMove} />

            <button
              onClick={() =>
                setResult(
                  [
                    "（プレビュー）",
                    `日数: ${days}`,
                    `人数: ${people}人`,
                    `目的: ${purpose}`,
                    `予算スタンス: budget=${budget}, hotel=${hotel}, food=${food}, move=${move}`,
                    "",
                    "次のステップで、ここにAIの旅行工程が出ます。"
                  ].join("\n")
                )
              }
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid #111827",
                background: "#111827",
                color: "white",
                fontWeight: 700
              }}
            >
              叩き台を作る（今はプレビュー）
            </button>
          </div>
        </section>

        <section style={box}>
          <h2 style={{ margin: "0 0 8px", fontSize: 16 }}>出力（70%完成）</h2>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: 14 }}>{result}</pre>
        </section>

        <p style={{ margin: 0, color: "#6b7280", fontSize: 12 }}>
          ※飲食店は工程上立ち寄りやすい代表例です。混雑時は近隣店舗に変更しても無理のない行程です。
        </p>
      </div>
    </main>
  );
}

function Slider({
  label,
  v,
  setV
}: {
  label: string;
  v: number;
  setV: (n: number) => void;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 13 }}>
        {label}：{v}
      </span>
      <input type="range" min={1} max={5} value={v} onChange={(e) => setV(Number(e.target.value))} />
    </label>
  );
}
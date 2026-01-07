"use client";

import { useMemo, useState } from "react";

type Purpose = "観光" | "ゆるめ";
type Days = "2泊3日" | "3泊4日";

export default function Page() {
  const [days, setDays] = useState<Days>("2泊3日");
  const [people, setPeople] = useState<number>(4);
  const [purpose, setPurpose] = useState<Purpose>("観光");

  const [budget, setBudget] = useState(3);
  const [hotel, setHotel] = useState(3);
  const [food, setFood] = useState(4);
  const [move, setMove] = useState(3);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const payload = useMemo(() => {
    return {
      days,
      people,
      purpose,
      budget_style: { budget, hotel, food, move },
      depart: "東京"
    };
  }, [days, people, purpose, budget, hotel, food, move]);

  async function generate() {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "生成に失敗しました");
      setResult(data.text);
    } catch (e: any) {
      setResult(`エラー: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    maxWidth: 820,
    margin: "0 auto",
    padding: 16
  };

  const boxStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    background: "white",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)"
  };

  return (
    <main style={{ background: "#f6f7f9", minHeight: "100vh" }}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: 22, margin: "6px 0 12px" }}>旅行工程ジェネレーター（東京発・王道）</h1>

        <div style={{ display: "grid", gap: 12 }}>
          <div style={boxStyle}>
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
                  style={{ marginLeft: 8, width: 72 }}
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
                onClick={generate}
                disabled={loading}
                style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid #111827",
                  background: loading ? "#9ca3af" : "#111827",
                  color: "white",
                  fontWeight: 700
                }}
              >
                {loading ? "生成中..." : "ラフプラン生成（行き先まで言い切り）"}
              </button>
            </div>
          </div>

          <div style={boxStyle}>
            <h2 style={{ fontSize: 16, margin: 0 }}>出力（70%完成）</h2>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>
              {result || "ここに結果が出ます"}
            </pre>
          </div>
        </div>

        <p style={{ color: "#6b7280", fontSize: 12, marginTop: 12 }}>
          ※飲食店は工程上立ち寄りやすい代表例です。混雑時は近隣店舗に変更しても無理のない行程です。
        </p>
      </div>
    </main>
  );
}

function Slider({ label, v, setV }: { label: string; v: number; setV: (n: number) => void }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span>
        {label}：{v}
      </span>
      <input type="range" min={1} max={5} value={v} onChange={(e) => setV(Number(e.target.value))} />
    </label>
  );
}

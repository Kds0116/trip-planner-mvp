import { NextResponse } from "next/server";

export const runtime = "nodejs";

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPrompt(input: any) {
  const days = input?.days ?? "2泊3日";
  const people = input?.people ?? 4;
  const purpose = input?.purpose ?? "観光";
  const budget = input?.budget_style?.budget ?? 3;
  const hotel = input?.budget_style?.hotel ?? 3;
  const food = input?.budget_style?.food ?? 4;
  const move = input?.budget_style?.move ?? 3;

  return `
あなたは日本の旅行雑誌編集者レベルの旅行プランナーAI。
対象：卒業旅行世代〜30代。方針：王道・失敗回避・複数人でも無理がない・時間ラフ重視。

【絶対条件】
- 出発地：東京（固定）
- 国内のみ
- 行き先：必ず1つに言い切る（候補は出さない）
- 完成度：70%（後で人が直せる余白を残す）
- 工程は「移動時間」と「滞在目安」を必ず入れる（分単位禁止）
- 押し付けないが言い切る。比較しない。

【飯ルール（最重要）】
- 1日最大1軒（昼or夜のみ）
- 具体的な店名を必ず入れる
- 王道・老舗・定番のみ
- 予約必須・行列前提は避ける
- 観光動線上で無理なく寄れる
- 滞在目安：60分と明示

【工程ルール】
- 体感時間表現のみ：例）約15分 / 約30分 / 約1時間 / 約2〜3時間
- 「適宜」「自由に」などの曖昧語は禁止

【入力条件】
- 日数：${days}
- 人数：${people}
- 目的：${purpose}
- 予算スタンス：budget=${budget}, hotel=${hotel}, food=${food}, move=${move}

【出力フォーマット（厳守）】
### 行き先（言い切り）
今回の条件では「〇〇（具体エリア）」が無理のない構成です。

### 推奨予算（円・1つ）
¥XX,000／人
（交通・宿・食事・観光を含む目安）
※調整で±¥5,000程度

### 選定理由（短文3点）
- …
- …
- …

### 旅行工程（時間ラフ付き）
#### Day1
- …
#### Day2
- …
#### Day3（必要なら）
- …
#### Day4（必要なら）
- …

### 注意書き
※飲食店は工程上立ち寄りやすい代表例です。混雑時は近隣店舗に変更しても無理のない行程です。
`.trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY が未設定です（VercelのEnvironment Variablesに設定してください）" },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(body);

    // OpenAI Responses API（テキスト生成）
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: "日本語で出力してください。" },
          { role: "user", content: prompt }
        ]
      })
    });

    const json = await r.json();

    if (!r.ok) {
      return NextResponse.json({ error: json?.error?.message || "OpenAI APIエラー" }, { status: 500 });
    }

    const text =
      json?.output?.[0]?.content?.map((c: any) => c?.text).filter(Boolean).join("\n") ||
      json?.output_text ||
      "";

    return NextResponse.json({ text: text || "（空の出力でした）" });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "サーバーエラー" }, { status: 500 });
  }
}
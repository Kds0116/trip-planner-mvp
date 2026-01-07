import { NextResponse } from "next/server";

export const runtime = "nodejs";

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
- 完成度：70%
- 工程は移動時間・滞在目安を必ず入れる

【飯ルール】
- 1日1軒まで（昼or夜）
- 具体店名を必ず出す
- 王道・老舗・定番
- 滞在目安60分

【入力条件】
日数：${days}
人数：${people}
目的：${purpose}
予算：budget=${budget}, hotel=${hotel}, food=${food}, move=${move}

【出力フォーマット】
### 行き先（言い切り）
### 推奨予算（円・1つ）
### 選定理由（3点）
### 旅行工程（Day別・時間ラフ）
### 注意書き
`.trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY が未設定です" },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(body);

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    const json = await r.json();

    const text =
      json?.output_text ||
      json?.output?.[0]?.content?.map((c: any) => c.text).join("\n") ||
      "";

    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "サーバーエラー" },
      { status: 500 }
    );
  }
}
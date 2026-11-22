"use strict";

const resultEl = document.getElementById("result");
const rawEl = document.getElementById("raw-json-body");
const titleEl = document.getElementById("result-title");

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function decodeEntities(text) {
  const area = document.createElement("textarea");
  area.innerHTML = text;
  return area.value;
}

function setTitle(title) {
  titleEl.textContent = title;
}

function showRaw(data) {
  rawEl.textContent = JSON.stringify(data, null, 2);
}

function listItems(items, renderItem) {
  return "<ul>" + items.map((item) => "<li>" + renderItem(item) + "</li>").join("") + "</ul>";
}

const RENDERERS = {
  openalex(data) {
    const works = data.results || [];
    if (!works.length) return "<p>結果がありませんでした。</p>";
    return listItems(works, (w) => {
      const title = esc(w.title || "(タイトルなし)");
      const year = w.publication_year || "?";
      const authors = (w.authorships || []).slice(0, 3).map((a) => esc(a.author ? a.author.display_name : "")).filter(Boolean).join("、");
      const link = w.id ? " <a href=\"" + esc(w.id) + "\" target=\"_blank\" rel=\"noreferrer\">OpenAlexで開く</a>" : "";
      return "<strong>" + title + "</strong> (" + year + ")<br>" + authors + link;
    });
  },
  p2pquake(data) {
    const items = Array.isArray(data) ? data : [];
    if (!items.length) return "<p>結果がありませんでした。</p>";
    const scaleText = (s) => ({ 10: "1", 20: "2", 30: "3", 40: "4", 45: "5弱", 50: "5強", 55: "6弱", 60: "6強", 70: "7" }[s] || String(s));
    return "<p>最新 " + items.length + " 件の地震情報（P2P地震情報・実験的）</p>" + listItems(items, (item) => {
      const eq = item.earthquake || {};
      const hypo = eq.hypocenter || {};
      const time = esc(eq.time || item.time || "");
      const place = esc(hypo.name || "");
      const mag = hypo.magnitude != null ? "M" + hypo.magnitude : "";
      const scale = eq.maxScale != null ? "最大震度 " + scaleText(eq.maxScale) : "";
      const tsunami = eq.domesticTsunami && eq.domesticTsunami !== "None" ? "（" + esc(eq.domesticTsunami) + "）" : "";
      return time + " " + place + " " + mag + " " + scale + tsunami;
    });
  },
  openmeteo(data) {
    const c = data.current || {};
    const code = c.weather_code;
    const label = { 0: "快晴", 1: "晴れ", 2: "晴れ時々曇り", 3: "曇り", 45: "霧", 48: "霧氷", 51: "弱い霧雨", 53: "霧雨", 55: "強い霧雨", 61: "弱い雨", 63: "雨", 65: "強い雨", 71: "弱い雪", 73: "雪", 75: "強い雪", 80: "弱いにわか雨", 81: "にわか雨", 82: "強いにわか雨", 95: "雷雨" }[code] || ("コード " + code);
    return "<p>" + esc(data.city || "") + "の現在の天気（" + esc(c.time || "") + "）</p>"
      + "<table><tr><th>天気</th><td>" + esc(label) + "</td></tr>"
      + "<tr><th>気温</th><td>" + esc(c.temperature_2m) + " ℃</td></tr>"
      + "<tr><th>湿度</th><td>" + esc(c.relative_humidity_2m) + " %</td></tr>"
      + "<tr><th>風速</th><td>" + esc(c.wind_speed_10m) + " km/h</td></tr></table>";
  },
  openlibrary(data) {
    const docs = data.docs || [];
    if (!docs.length) return "<p>結果がありませんでした。</p>";
    return listItems(docs, (d) => {
      const title = esc(d.title || "(タイトルなし)");
      const authors = (d.author_name || []).join("、");
      const year = d.first_publish_year || "?";
      return "<strong>" + title + "</strong> — " + esc(authors) + " (" + year + ")";
    });
  },
  apod(data) {
    let html = "<h3>" + esc(data.title || "") + "</h3><p>" + esc(data.date || "") + "</p>";
    if (data.media_type === "image" && data.url) {
      html += "<p><img src=\"" + esc(data.url) + "\" alt=\"" + esc(data.title || "APOD") + "\"></p>";
    } else if (data.url) {
      html += "<p><a href=\"" + esc(data.url) + "\" target=\"_blank\" rel=\"noreferrer\">メディアを開く</a></p>";
    }
    html += "<p>" + esc(data.explanation || "") + "</p>";
    html += "<p class=\"note\">NASA APOD は DEMO_KEY で取得しています。無料の個人キー（https://api.nasa.gov/）に置き換えると制限が緩くなります。</p>";
    return html;
  },
  pokeapi(data) {
    const img = data.sprites && data.sprites.front_default
      ? "<p><img src=\"" + esc(data.sprites.front_default) + "\" alt=\"" + esc(data.name) + "\"></p>" : "";
    const types = (data.types || []).map((t) => esc(t.type.name)).join(" / ");
    return img + "<p><strong>" + esc(data.name) + "</strong>（図鑑No. " + data.id + "）</p>"
      + "<table><tr><th>タイプ</th><td>" + types + "</td></tr>"
      + "<tr><th>高さ</th><td>" + (data.height / 10) + " m</td></tr>"
      + "<tr><th>重さ</th><td>" + (data.weight / 10) + " kg</td></tr></table>";
  },
  sumo(data) {
    const items = Array.isArray(data) ? data : (data.records || []);
    if (!items.length) return "<p>結果がありませんでした。</p>";
    return listItems(items, (r) => {
      const name = esc(r.shikonaEn || r.shikonaJp || "");
      const rank = esc(((r.currentRank || "") + " " + (r.currentRankJp || "")).trim());
      const heya = esc(r.heya || r.heyaEn || r.heyaJp || "");
      return "<strong>" + name + "</strong> " + rank + "（" + heya + "） 身長 " + esc(r.height || "?") + "cm 体重 " + esc(r.weight || "?") + "kg";
    });
  },
  catfact(data) {
    return "<p style=\"font-size:1.3rem\">" + esc(data.fact || "") + "</p>";
  },
  dog(data) {
    return "<p><img src=\"" + esc(data.message || "") + "\" alt=\"犬の画像\"></p>";
  },
  met(data) {
    let html = "<h3>" + esc(data.title || "") + "</h3>";
    if (data.primaryImageSmall) {
      html += "<p><img src=\"" + esc(data.primaryImageSmall) + "\" alt=\"" + esc(data.title || "") + "\"></p>";
    }
    html += "<table>"
      + "<tr><th>作者</th><td>" + esc(data.artistDisplayName || "") + "</td></tr>"
      + "<tr><th>制作年</th><td>" + esc(data.objectDate || "") + "</td></tr>"
      + "<tr><th>部門</th><td>" + esc(data.department || "") + "</td></tr>"
      + "<tr><th>技法</th><td>" + esc(data.medium || "") + "</td></tr></table>";
    return html;
  },
  trivia(data) {
    const questions = data.results || [];
    if (!questions.length) return "<p>クイズを取得できませんでした。</p>";
    startQuiz(questions);
    return null;
  },
  dicebear(data) {
    return "<p><img src=\"" + esc(data.image_url) + "\" alt=\"アバター\" width=\"200\"></p><p>シード: " + esc(data.seed) + "</p>";
  },
};

let quizScore = 0;
let quizAnswered = 0;

function startQuiz(questions) {
  quizScore = 0;
  quizAnswered = 0;
  resultEl.innerHTML = "<p>全 " + questions.length + " 問。選択肢をクリックして回答してください。</p><div id=\"quiz-score\"></div>"
    + questions.map((q, i) => {
      const options = [...q.incorrect_answers, q.correct_answer]
        .map((a) => decodeEntities(a))
        .sort(() => Math.random() - 0.5);
      return "<div class=\"quiz-q\"><p><strong>Q" + (i + 1) + "?</strong> " + esc(decodeEntities(q.question)) + "</p><div class=\"quiz-opts\">"
        + options.map((opt) => "<button type=\"button\" data-correct=\"" + (opt === decodeEntities(q.correct_answer) ? "1" : "0") + "\">" + esc(opt) + "</button>").join("")
        + "</div></div>";
    }).join("");
  resultEl.querySelectorAll(".quiz-opts button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const box = btn.parentElement;
      if (box.dataset.done) return;
      box.dataset.done = "1";
      quizAnswered += 1;
      const correct = btn.dataset.correct === "1";
      if (correct) quizScore += 1;
      box.querySelectorAll("button").forEach((b) => {
        b.disabled = true;
        if (b.dataset.correct === "1") b.classList.add("correct");
      });
      if (!correct) btn.classList.add("wrong");
      document.getElementById("quiz-score").textContent = "スコア: " + quizScore + " / " + quizAnswered + " 問正解";
    });
  });
}

async function callApi(name, params, title) {
  setTitle(title);
  resultEl.innerHTML = "<p>読み込み中…</p>";
  rawEl.textContent = "";
  const url = "/api/" + name + "?" + new URLSearchParams(params).toString();
  let payload;
  try {
    const resp = await fetch(url);
    payload = await resp.json();
  } catch (err) {
    resultEl.innerHTML = "<p class=\"error\">通信に失敗しました: " + esc(err.message) + "</p>";
    return;
  }
  showRaw(payload);
  if (!payload.ok) {
    resultEl.innerHTML = "<p class=\"error\">取得できませんでした: " + esc(payload.error || "不明なエラー") + "</p>";
    return;
  }
  const render = RENDERERS[name];
  const html = render ? render(payload.data) : null;
  if (html !== null && html !== undefined) resultEl.innerHTML = html;
}

document.querySelectorAll(".card").forEach((card) => {
  const name = card.dataset.api;
  const button = card.querySelector("button");
  const title = card.querySelector("h2").textContent;
  button.addEventListener("click", () => {
    const params = {};
    card.querySelectorAll("input, select").forEach((field) => {
      if (field.value) params[field.name] = field.value;
    });
    callApi(name, params, title);
  });
});

document.getElementById("health-btn").addEventListener("click", async () => {
  const out = document.getElementById("health-result");
  out.textContent = "確認中…";
  try {
    const resp = await fetch("/api/health");
    const payload = await resp.json();
    const rows = Object.entries(payload.results).map(([key, r]) =>
      "<tr><td>" + esc(r.title) + "</td><td class=\"" + (r.ok ? "ok" : "ng") + "\">" + (r.ok ? "OK" : "NG") + "</td><td>" + esc(r.error || "") + "</td></tr>").join("");
    resultEl.innerHTML = "<table><tr><th>API</th><th>結果</th><th>備考</th></tr>" + rows + "</table>";
    setTitle("すべてのAPIの接続テスト");
    showRaw(payload);
    out.textContent = "";
  } catch (err) {
    out.textContent = "確認に失敗しました: " + err.message;
  }
});

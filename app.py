#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""無料APIを1ボタンで試せるローカルWebサイト。Python標準ライブラリのみで動作する。

起動方法:
    python app.py
    -> http://localhost:8000 をブラウザで開く

サーバ側で各無料APIを呼び出し、結果を JSON で返すプロキシになっている。
ブラウザ側 (static/app.js) が /api/<名前> を呼んで表示する。
"""

import json
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE = Path(__file__).resolve().parent
STATIC = BASE / "static"
PORT = 8000
TIMEOUT = 15
HEADERS = {"User-Agent": "muse-free-api-demo/1.0"}

# NASA APOD は DEMO_KEY のまま動作するが、1時間あたりの回数制限が厳しい。
# 無料の個人キーを https://api.nasa.gov/ で取得したら、ここを置き換えること。
NASA_API_KEY = "DEMO_KEY"


def fetch_json(url):
    """指定URLを GET して JSON として返す。失敗時は例外を送出する。

    429 / 500 / 502 / 503 は一時的な制限のことが多いため、最大3回まで
    3秒待って再試行する。
    """
    last_error = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            last_error = exc
            if exc.code in (429, 500, 502, 503) and attempt < 2:
                time.sleep(3)
            else:
                raise
    raise last_error


def api_openalex(params):
    q = params.get("q", ["artificial intelligence"])[0]
    url = "https://api.openalex.org/works?search=" + urllib.parse.quote(q) + "&per-page=5"
    return fetch_json(url)


def api_p2pquake(params):
    # codes=551 は「地震情報」。P2P地震情報 API は実験的な扱いとする。
    url = "https://api.p2pquake.net/v2/history?codes=551&limit=10"
    return fetch_json(url)


def api_openmeteo(params):
    cities = {
        "funabashi": (35.70, 139.98, "船橋市"),
        "tokyo": (35.68, 139.69, "東京都"),
    }
    city = params.get("city", ["funabashi"])[0]
    lat, lon, _name = cities.get(city, cities["funabashi"])
    url = (
        "https://api.open-meteo.com/v1/forecast?latitude=" + str(lat)
        + "&longitude=" + str(lon)
        + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
        + "&timezone=Asia%2FTokyo"
    )
    data = fetch_json(url)
    data["city"] = cities.get(city, cities["funabashi"])[2]
    return data


def api_openlibrary(params):
    q = params.get("q", ["python"])[0]
    url = "https://openlibrary.org/search.json?q=" + urllib.parse.quote(q) + "&limit=5"
    return fetch_json(url)


def api_apod(params):
    url = "https://api.nasa.gov/planetary/apod?api_key=" + NASA_API_KEY
    return fetch_json(url)


def api_pokeapi(params):
    name = params.get("name", ["pikachu"])[0].strip().lower() or "pikachu"
    url = "https://pokeapi.co/api/v2/pokemon/" + urllib.parse.quote(name)
    return fetch_json(url)


def api_sumo(params):
    # 力士一覧は /api/rikishis（複数形）。/api/rikishi は単体の力士用。
    url = "https://sumo-api.com/api/rikishis?limit=5&skip=0"
    return fetch_json(url)


def api_catfact(params):
    return fetch_json("https://catfact.ninja/fact")


def api_dog(params):
    return fetch_json("https://dog.ceo/api/breeds/image/random")


def api_met(params):
    # 検索は v1.1 を使う。v1/search は 2026-10-01 に廃止され 410 を返す。
    search = fetch_json(
        "https://collectionapi.metmuseum.org/public/collection/v1.1/search"
        "?q=sunflowers&isHighlight=true"
    )
    ids = search.get("objectIDs") or []
    for object_id in ids[:5]:
        obj = fetch_json(
            "https://collectionapi.metmuseum.org/public/collection/v1/objects/"
            + str(object_id)
        )
        if obj.get("primaryImageSmall"):
            return obj
    if ids:
        first = fetch_json(
            "https://collectionapi.metmuseum.org/public/collection/v1/objects/"
            + str(ids[0])
        )
        if first.get("primaryImageSmall"):
            return first
    # 画像のある作品が見つからない場合は、画像のある既知の作品を返す。
    # 436121: ドガ「花瓶のそばに座る女性」（1865年）。
    return fetch_json(
        "https://collectionapi.metmuseum.org/public/collection/v1/objects/436121"
    )


def api_trivia(params):
    url = "https://opentdb.com/api.php?amount=5&type=multiple"
    return fetch_json(url)


def api_dicebear(params):
    # DiceBear は画像URLそのものを返す。ブラウザが <img> で直接表示する。
    seed = params.get("seed", ["muse"])[0].strip() or "muse"
    url = ("https://api.dicebear.com/9.x/adventurer/svg?seed="
           + urllib.parse.quote(seed))
    return {"seed": seed, "image_url": url}


APIS = {
    "openalex": ("OpenAlex 論文検索", api_openalex),
    "p2pquake": ("P2P地震情報（実験的）", api_p2pquake),
    "openmeteo": ("Open-Meteo 天気（船橋・東京）", api_openmeteo),
    "openlibrary": ("Open Library 本検索", api_openlibrary),
    "apod": ("NASA APOD 今日の天文写真", api_apod),
    "pokeapi": ("PokéAPI ポケモン", api_pokeapi),
    "sumo": ("Sumo API 力士", api_sumo),
    "catfact": ("Cat Facts 猫の豆知識", api_catfact),
    "dog": ("Dog API 犬の画像", api_dog),
    "met": ("メトロポリタン美術館", api_met),
    "trivia": ("Open Trivia クイズ", api_trivia),
    "dicebear": ("DiceBear アバター", api_dicebear),
}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):  # ログを静かにする
        pass

    def _send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, path, content_type):
        data = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed.query)
        if parsed.path == "/":
            self._send_file(STATIC / "index.html", "text/html; charset=utf-8")
            return
        if parsed.path.startswith("/static/"):
            name = parsed.path[len("/static/"):]
            target = (STATIC / name).resolve()
            if not str(target).startswith(str(STATIC.resolve())) or not target.is_file():
                self.send_error(404, "not found")
                return
            ctype = "text/plain; charset=utf-8"
            if name.endswith(".css"):
                ctype = "text/css; charset=utf-8"
            elif name.endswith(".js"):
                ctype = "text/javascript; charset=utf-8"
            elif name.endswith(".html"):
                ctype = "text/html; charset=utf-8"
            self._send_file(target, ctype)
            return
        if parsed.path == "/api/health":
            results = {}
            for key, (title, func) in APIS.items():
                try:
                    func({})
                    results[key] = {"ok": True, "title": title}
                except Exception as exc:  # noqa: BLE001 - 接続確認のため
                    results[key] = {"ok": False, "title": title, "error": str(exc)}
            self._send_json({"ok": True, "results": results})
            return
        if parsed.path.startswith("/api/"):
            name = parsed.path[len("/api/"):]
            entry = APIS.get(name)
            if entry is None:
                self._send_json({"ok": False, "error": "unknown api: " + name}, 404)
                return
            try:
                data = entry[1](query)
            except urllib.error.HTTPError as exc:
                self._send_json({"ok": False, "error": "HTTP " + str(exc.code)}, 502)
                return
            except Exception as exc:  # noqa: BLE001 - 呼び出し元に理由を返す
                self._send_json({"ok": False, "error": str(exc)}, 502)
                return
            self._send_json({"ok": True, "api": name, "data": data})
            return
        self.send_error(404, "not found")


def main():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print("http://localhost:" + str(PORT) + " で起動しました。Ctrl+C で停止します。")
    server.serve_forever()


if __name__ == "__main__":
    main()

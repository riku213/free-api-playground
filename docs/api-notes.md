<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Markdown | oKLBO | Rocket Powered Pastebin</title>
    <meta name="author" content="Sergio Benitez" />
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'self';
      font-src data:;
      style-src-attr 'unsafe-inline';
      script-src 'none';
      img-src *;
    ">
    <meta name="description" content="a simple, no-frills, command-line driven
      pastebin service powered by the Rocket web framework.">
    <link href="https:&#x2F;&#x2F;paste.rs/oKLBO" rel="canonical" />
    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/markdown.min.css">
  </head>
  <body>
    <article class="markdown-body"><h1><a href="#api-メモ" aria-hidden="true" class="anchor" id="api-メモ"></a>API メモ</h1>
<p>各APIのエンドポイント、キーの要否、癖、検証結果をまとめる。</p>
<h2><a href="#共通" aria-hidden="true" class="anchor" id="共通"></a>共通</h2>
<ul>
<li>サーバは <code>User-Agent: muse-free-api-demo/1.0</code> を付けて呼び出す。</li>
<li>タイムアウトは 15 秒。429 / 500 / 502 / 503 と通信エラー（タイムアウトなど）は最大3回まで、3秒待って再試行する。</li>
<li>検証は <code>http://localhost:8000</code> の稼働中のサイトと <code>/api/health</code> で行った。</li>
</ul>
<h2><a href="#1-openalex論文検索" aria-hidden="true" class="anchor" id="1-openalex論文検索"></a>1. OpenAlex（論文検索）</h2>
<ul>
<li>エンドポイント：<code>https://api.openalex.org/works?search=&lt;キーワード&gt;&amp;per-page=5</code></li>
<li>キー：不要</li>
<li>癖：混雑時に 429（Too Many Requests）や 503（Service Unavailable）を返すことがある。再試行しても回復しない場合は時間を置く。</li>
<li><code>OPENALEX_MAILTO</code> 環境変数にメールアドレスを設定すると、<code>mailto</code> パラメータが付き、polite pool 扱いになって制限を受けにくくなる（任意。メールアドレスの設定は行っていない）。</li>
<li>検証：2026-11-23、キーワード <code>artificial intelligence</code> で5件の論文を取得できた。途中で 429 / 503 が出たが、時間を置いた再試行で回復した。</li>
</ul>
<h2><a href="#2-p2p地震情報最新の地震" aria-hidden="true" class="anchor" id="2-p2p地震情報最新の地震"></a>2. P2P地震情報（最新の地震）</h2>
<ul>
<li>エンドポイント：<code>https://api.p2pquake.net/v2/history?codes=551&amp;limit=10</code></li>
<li>キー：不要</li>
<li>癖：実験的な扱い。<code>codes=551</code> は地震情報の履歴。津波情報は地震によっては <code>None</code> で、その場合は表示しない。</li>
<li>検証：2026-11-23、最新10件の地震（時刻・震央地名・マグニチュード・最大震度）が表示された。</li>
</ul>
<h2><a href="#3-open-meteo天気" aria-hidden="true" class="anchor" id="3-open-meteo天気"></a>3. Open-Meteo（天気）</h2>
<ul>
<li>エンドポイント：<code>https://api.open-meteo.com/v1/forecast?latitude=&lt;緯度&gt;&amp;longitude=&lt;経度&gt;&amp;current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&amp;timezone=Asia/Tokyo</code></li>
<li>キー：不要</li>
<li>船橋市：緯度 35.70、経度 139.98。東京都：緯度 35.68、経度 139.69。</li>
<li>検証：2026-11-23、船橋市（晴れ、6.9°C）と東京都（晴れ、6.6°C）の現在天気を取得できた。都市を切り替えると異なる値が返ることを確認した。</li>
</ul>
<h2><a href="#4-open-library本検索" aria-hidden="true" class="anchor" id="4-open-library本検索"></a>4. Open Library（本検索）</h2>
<ul>
<li>エンドポイント：<code>https://openlibrary.org/search.json?q=&lt;キーワード&gt;&amp;limit=5</code></li>
<li>キー：不要</li>
<li>検証：2026-11-23、キーワード <code>python</code> で5冊（Learning Python など）を取得できた。著者・出版年が表示される。</li>
</ul>
<h2><a href="#5-nasa-apod今日の天文写真" aria-hidden="true" class="anchor" id="5-nasa-apod今日の天文写真"></a>5. NASA APOD（今日の天文写真）</h2>
<ul>
<li>エンドポイント：<code>https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY</code></li>
<li>キー：<code>DEMO_KEY</code> を使用。無料の個人キーへの置き換えを推奨する。キーの登録は行わない。</li>
<li>癖：DEMO_KEY には利用回数の制限があり、制限に達すると 429 を返す。1時間あたり30回、1日あたり50回程度が目安。制限が回復するまで待つか、個人キーに置き換える。</li>
<li>検証：2026-11-22 にはタイトル「A Dark and Stormy Night」（2026-02-08）の画像と説明が表示された。2026-11-23 の接続テストでは DEMO_KEY の制限により 429 となり、取得できなかった。制限の回復後に再確認すること。</li>
</ul>
<h2><a href="#6-pokéapiポケモン" aria-hidden="true" class="anchor" id="6-pokéapiポケモン"></a>6. PokéAPI（ポケモン）</h2>
<ul>
<li>エンドポイント：<code>https://pokeapi.co/api/v2/pokemon/&lt;名前または番号&gt;</code></li>
<li>キー：不要</li>
<li>検証：2026-11-22、<code>pikachu</code>（図鑑No. 25、タイプ electric、高さ 0.4 m、重さ 6 kg）を取得できた。画像も表示される。</li>
</ul>
<h2><a href="#7-sumo-api力士" aria-hidden="true" class="anchor" id="7-sumo-api力士"></a>7. Sumo API（力士）</h2>
<ul>
<li>エンドポイント：<code>https://sumo-api.com/api/rikishis?limit=5&amp;skip=0</code></li>
<li>キー：不要</li>
<li>癖：力士一覧は <code>/api/rikishis</code>（複数形）。<code>/api/rikishi</code> は単体の力士用（<code>/api/rikishi/:rikishiId</code>）なので注意。部屋名のフィールドは <code>heya</code>（文字列）である。</li>
<li>検証：2026-11-23、力士5名（Asanoyama、Hakunofuji、Kaizen、Takerufuji、Kazenoumi）を取得できた。番付・部屋名（Takasago、Isegahama など）・身長・体重が表示される。</li>
</ul>
<h2><a href="#8-cat-facts猫の豆知識" aria-hidden="true" class="anchor" id="8-cat-facts猫の豆知識"></a>8. Cat Facts（猫の豆知識）</h2>
<ul>
<li>エンドポイント：<code>https://catfact.ninja/fact</code></li>
<li>キー：不要</li>
<li>検証：2026-11-23、猫の豆知識（英文）が1件表示された。</li>
</ul>
<h2><a href="#9-dog-api犬の画像" aria-hidden="true" class="anchor" id="9-dog-api犬の画像"></a>9. Dog API（犬の画像）</h2>
<ul>
<li>エンドポイント：<code>https://dog.ceo/api/breeds/image/random</code></li>
<li>キー：不要</li>
<li>検証：2026-11-22、犬の画像が表示された。</li>
</ul>
<h2><a href="#10-the-metメトロポリタン美術館" aria-hidden="true" class="anchor" id="10-the-metメトロポリタン美術館"></a>10. The Met（メトロポリタン美術館）</h2>
<ul>
<li>エンドポイント：検索 <code>https://collectionapi.metmuseum.org/public/collection/v1.1/search?q=sunflowers&amp;isHighlight=true</code>、作品 <code>https://collectionapi.metmuseum.org/public/collection/v1/objects/&lt;id&gt;</code></li>
<li>キー：不要</li>
<li>癖：<code>v1/search</code> は 410（Gone）で廃止予定。<code>v1.1/search</code> を使うこと（2026-10-01 に <code>v1</code> は削除予定と案内されていた）。作品によっては <code>primaryImageSmall</code> が空のものがあるため、画像のある作品を優先して表示する。画像のある作品の例：<code>436121</code>（ドガ「花瓶のそばに座る女性」、1865年）。</li>
<li>検証：2026-11-22、ドガの作品（作者 Edgar Degas、1865年、European Paintings、Oil on canvas）が画像付きで表示された。</li>
</ul>
<h2><a href="#11-open-trivia-databaseクイズ" aria-hidden="true" class="anchor" id="11-open-trivia-databaseクイズ"></a>11. Open Trivia Database（クイズ）</h2>
<ul>
<li>エンドポイント：<code>https://opentdb.com/api.php?amount=5&amp;type=multiple</code></li>
<li>キー：不要</li>
<li>検証：2026-11-22、5問のクイズが表示され、選択肢をクリックすると正誤判定とスコアが表示された（例：UAE最大の都市は Dubai）。</li>
</ul>
<h2><a href="#12-dicebearアバター" aria-hidden="true" class="anchor" id="12-dicebearアバター"></a>12. DiceBear（アバター）</h2>
<ul>
<li>エンドポイント：<code>https://api.dicebear.com/9.x/adventurer/svg?seed=&lt;シード&gt;</code></li>
<li>キー：不要</li>
<li>検証：2026-11-22、シード <code>muse</code> のアバター画像が表示された。シードを変えると別のアバターになる。</li>
</ul>
<h2><a href="#接続テストの結果2026-11-23-0010-jstブラウザ" aria-hidden="true" class="anchor" id="接続テストの結果2026-11-23-0010-jstブラウザ"></a>接続テストの結果（2026-11-23 00:10 JST、ブラウザ）</h2>
<ul>
<li>10 / 12 が OK。NG は OpenAlex（503、一時的。直後の個別実行では回復）と NASA APOD（500 / 429、DEMO_KEY の制限）。</li>
<li>curl での <code>/api/health</code>（2026-11-22 23:48）では 12 / 12 が OK だった。</li>
</ul>
</article>
  </body>
</html>

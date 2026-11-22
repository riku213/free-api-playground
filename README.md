<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Markdown | jrjah | Rocket Powered Pastebin</title>
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
    <link href="https:&#x2F;&#x2F;paste.rs/jrjah" rel="canonical" />
    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/markdown.min.css">
  </head>
  <body>
    <article class="markdown-body"><h1><a href="#無料apiお試しサイト" aria-hidden="true" class="anchor" id="無料apiお試しサイト"></a>無料APIお試しサイト</h1>
<p>12の無料APIをボタン1つで試せるローカルサイトです。ブラウザでボタンを押すと、そのAPIの本物のデータが表示されます。</p>
<h2><a href="#実行方法" aria-hidden="true" class="anchor" id="実行方法"></a>実行方法</h2>
<pre style="background-color:#ffffff;">
<span style="color:#323232;">python app.py
</span></pre>
<p>ブラウザで <code>http://localhost:8000</code> を開きます。停止するにはターミナルで <code>Ctrl+C</code> を押します。</p>
<ul>
<li>Python 標準ライブラリのみを使っています。追加のパッケージは不要です。</li>
<li>サーバは <code>127.0.0.1:8000</code> で待ち受けます（ローカル専用）。</li>
</ul>
<h2><a href="#api一覧" aria-hidden="true" class="anchor" id="api一覧"></a>API一覧</h2>
<table>
<thead>
<tr>
<th>API</th>
<th>内容</th>
<th>キー</th>
</tr>
</thead>
<tbody>
<tr>
<td>OpenAlex</td>
<td>論文検索</td>
<td>不要</td>
</tr>
<tr>
<td>P2P地震情報</td>
<td>最新の地震（実験的）</td>
<td>不要</td>
</tr>
<tr>
<td>Open-Meteo</td>
<td>天気（船橋市・東京都）</td>
<td>不要</td>
</tr>
<tr>
<td>Open Library</td>
<td>本検索</td>
<td>不要</td>
</tr>
<tr>
<td>NASA APOD</td>
<td>今日の天文写真</td>
<td>DEMO_KEY（個人キーへの置き換えを推奨）</td>
</tr>
<tr>
<td>PokéAPI</td>
<td>ポケモン情報</td>
<td>不要</td>
</tr>
<tr>
<td>Sumo API</td>
<td>力士情報</td>
<td>不要</td>
</tr>
<tr>
<td>Cat Facts</td>
<td>猫の豆知識</td>
<td>不要</td>
</tr>
<tr>
<td>Dog API</td>
<td>犬の画像</td>
<td>不要</td>
</tr>
<tr>
<td>The Met</td>
<td>メトロポリタン美術館の作品</td>
<td>不要</td>
</tr>
<tr>
<td>Open Trivia</td>
<td>クイズ</td>
<td>不要</td>
</tr>
<tr>
<td>DiceBear</td>
<td>シードからアバター画像</td>
<td>不要</td>
</tr>
</tbody>
</table>
<p>詳しくは <code>docs/api-notes.md</code> を参照してください。</p>
<h2><a href="#使い方" aria-hidden="true" class="anchor" id="使い方"></a>使い方</h2>
<ol>
<li>サーバを起動し、<code>http://localhost:8000</code> を開きます。</li>
<li>試したいAPIのカードのボタンを押します。</li>
<li>結果がページ下部の結果表示欄に出ます。「生のJSONを見る」で生の応答も確認できます。</li>
<li>「すべてのAPIの接続テスト」を押すと、12個のAPIすべての接続状態を一覧で確認できます。</li>
</ol>
<h2><a href="#注意点" aria-hidden="true" class="anchor" id="注意点"></a>注意点</h2>
<ul>
<li>NASA APOD は <code>DEMO_KEY</code> で動いています。DEMO_KEY には利用回数の制限があり、制限に達すると 429 エラーになります。継続して使う場合は、NASA のサイトで無料の個人キーを取得し、<code>app.py</code> の <code>NASA_API_KEY</code> を置き換えてください。キーの登録はこのプロジェクトでは行いません。</li>
<li>P2P地震情報は実験的な扱いです。表示される地震情報は参考として扱ってください。</li>
<li>OpenAlex は混雑時に 429 / 503 を返すことがあります。その場合は少し時間を置いてからもう一度お試しください。<code>OPENALEX_MAILTO</code> 環境変数にメールアドレスを設定すると、polite pool 扱いになり制限を受けにくくなります（任意）。</li>
<li>各APIの呼び出しはサーバ側で行います。ブラウザから外部APIへ直接アクセスはしません。</li>
</ul>
<h2><a href="#構成" aria-hidden="true" class="anchor" id="構成"></a>構成</h2>
<ul>
<li><code>app.py</code> — サーバ（Python 標準ライブラリのみ）。各APIへの呼び出しと <code>/api/*</code> の提供を行います。</li>
<li><code>static/index.html</code> — 画面。</li>
<li><code>static/style.css</code> — 見た目。</li>
<li><code>static/app.js</code> — ボタン操作と結果表示、クイズの動作。</li>
<li><code>docs/api-notes.md</code> — 各APIのエンドポイント、キー要否、癖、検証結果。</li>
</ul>
</article>
  </body>
</html>

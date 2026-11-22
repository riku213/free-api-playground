<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Markdown | cFwsK | Rocket Powered Pastebin</title>
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
    <link href="https:&#x2F;&#x2F;paste.rs/cFwsK" rel="canonical" />
    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/markdown.min.css">
  </head>
  <body>
    <article class="markdown-body"><h1><a href="#agentsmd--プロジェクトのルール" aria-hidden="true" class="anchor" id="agentsmd--プロジェクトのルール"></a>AGENTS.md — プロジェクトのルール</h1>
<h2><a href="#概要" aria-hidden="true" class="anchor" id="概要"></a>概要</h2>
<p>無料APIを1ボタンずつ試せるローカルサイト。サーバは Python 標準ライブラリのみで作る。</p>
<h2><a href="#作業範囲" aria-hidden="true" class="anchor" id="作業範囲"></a>作業範囲</h2>
<ul>
<li>作成・編集はこのフォルダ（<code>muse_projects</code>）内のみ。</li>
<li>他のフォルダや他のウィンドウ・アプリには触れない。例外はターミナルと、localhost でサイトを見るためのローカルブラウザのみ。</li>
<li>システム設定を変更しない。</li>
</ul>
<h2><a href="#技術" aria-hidden="true" class="anchor" id="技術"></a>技術</h2>
<ul>
<li>Python 標準ライブラリを優先する。パッケージは真に必要な場合のみ conda 環境 <code>muse_env</code> 内に入れる。</li>
<li>Flask は <code>muse_env</code> に既にある場合のみ使う。なければ標準ライブラリのみ。</li>
<li>コードをターミナルエディタへ1文字ずつタイプしない。ファイル全体を一括で生成する方法を使う（スクリプトによる書き込み、ヒアストリング、<code>Set-Content</code>、全文貼り付けなど）。</li>
</ul>
<h2><a href="#言語" aria-hidden="true" class="anchor" id="言語"></a>言語</h2>
<ul>
<li>人向けに書くものはすべて日本語（ja-JP）で書く。README、AGENTS、docs、コミットメッセージを含む。</li>
<li>ファイル名・変数名は英語のまま。</li>
<li>コードのコメントは自然な範囲で日本語を優先する。</li>
</ul>
<h2><a href="#入力" aria-hidden="true" class="anchor" id="入力"></a>入力</h2>
<ul>
<li>リモート PC の入力モードは日本語 IME であることがある。ターミナルへの入力やコマンド入力の前に、入力モードが英語・直接入力（半角英数、IME オフ）になっているか確認する。</li>
<li>ファイル内の日本語は、IME 経由でタイプするのではなく、一括スクリプト書き込み方式で正しい UTF-8 で生成する。</li>
</ul>
<h2><a href="#git" aria-hidden="true" class="anchor" id="git"></a>Git</h2>
<ul>
<li>リモートなし。各機能・修正の完了後に明確なメッセージでコミットする。</li>
<li>コミットメッセージは日本語で書く。</li>
<li>秘密情報（APIキー、パスワードなど）をコミットしない。</li>
<li>履歴を書き換えない。</li>
</ul>
<h2><a href="#apiの扱い" aria-hidden="true" class="anchor" id="apiの扱い"></a>APIの扱い</h2>
<ul>
<li>NASA APOD は <code>DEMO_KEY</code> のまま使う。無料の個人キーへの置き換えを促す表示を入れるが、ユーザーのためにキーを登録しない。</li>
<li>P2P地震情報は実験的であることを明記する。</li>
<li>各APIが実際に本物のデータを返すことを、稼働中のサイトで確認する。</li>
</ul>
</article>
  </body>
</html>

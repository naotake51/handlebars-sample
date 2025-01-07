# 開発手順

## 1. テンプレートの作成

templates/にページ単位で.hbsファイルを作成する。

共通部分はtemplates/parts配下に.hbsファイルを作成して、`{{> ファイル名 }}`で各ページに埋め込む。

変数はtemplates/variables配管にjsonファイルを作成して、`{{ ファイル名.キー名 }}`で各ページに埋め込む。

https://handlebarsjs.com/guide/#what-is-handlebars

## 2. コンパイル

```sh
npm run compile
```
を実行するとdistにhtmlファイル群が生成される。

## 3. アップロード

生成されたdistをサーバーへアップロードする。
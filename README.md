# Concert Entrance

![Front deploy](https://github.com/shotaIDE/ConcertEntrance/workflows/Front%20deploy/badge.svg)
![Scraping deploy](https://github.com/shotaIDE/ConcertEntrance/workflows/Scraping%20deploy/badge.svg)

クラシックのコンサート情報を、演奏曲目に着目しながらザッピングして吟味するための Web アプリです。

## 開発手順

### 事前準備

以下コマンドでローカルに Firestroe のサーバーを立てます。

```shell
cd firestore/
firebase emulators:start --only firestore
```

### スクレイピングタスク

`scraping/`フォルダを VSCode で開きます。

以下コマンドで Python3 の仮想環境を作り、仮想環境に切り替えます。

```shell
pip3 install virtualenv
virtualenv env
source env/bin/activate
```

以下コマンドで、依存パッケージをインストールします。

```shell
pip install -r requirements.txt
```

各種構成を用いてデバッグ実行します。

- `Mock-Local`: スクレイピングデータはローカルにあるファイルから取得し、DB はローカル Emulator の Firestore を利用します。
- `Real-Local`: スクレイピングデータは Web サーバーから取得し、DB はローカル Emulator の Firestore を利用します。
- `Real-Production`: スクレイピングデータは Web サーバーから取得し、DB は本番サーバーの Firestore を利用します。

### フロントエンド

`front/`フォルダを VSCode で開きます。

以下コマンドで依存パッケージをインストールします。

```shell
yarn install
```

以下コマンドで閲覧します。

```shell
yarn start
```

## デプロイ手順

### スクレイピング

以下コマンドによりデプロイします。

```shell
cd scraping/
gcloud app deploy
```

cron タスクを変更した場合は、以下コマンドにより cron 設定をデプロイします。

```shell
gcloud app deploy cron.yml
```

### フロントエンド

以下コマンドによりビルド・デプロイします。

```shell
yarn build
firebase deploy
```

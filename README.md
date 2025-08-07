# ふるさと納税データ分析ダッシュボード

## 概要

ふるさと納税の売上データを分析・可視化するダッシュボードアプリケーションです。Airtableからデータを取得し、様々な角度から売上分析を行います。

## 主な機能

### 📊 分析機能
- **売上推移分析**: 時系列での売上トレンド
- **プラットフォーム別売上比較**: ふるさとチョイス、さとふる、楽天ふるさと納税の比較
- **カテゴリ別構成比**: 商品カテゴリの売上分布
- **性別別売上構成**: 顧客の性別による売上分析
- **商品ランキング**: 売上上位商品の表示
- **都道府県ランキング**: 地域別売上分析

### 🔍 フィルター機能
- **期間フィルター**: 日次・週次・月次での絞り込み
- **プラットフォームフィルター**: 特定プラットフォームの選択
- **年代フィルター**: 顧客年代での絞り込み
- **性別フィルター**: 顧客性別での絞り込み

### 💬 チャットボット
- Udifyチャットボットの統合
- 右下ポップアップでの表示
- 最小化・最大化機能

## 技術スタック

### フロントエンド
- **Next.js 15.4.5**: App Router、Server Components
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **shadcn/ui**: UIコンポーネント
- **Chart.js**: グラフ表示
- **next-intl**: 国際化（日本語・英語）

### バックエンド
- **Prisma**: データベース操作
- **NextAuth.js**: 認証
- **Airtable API**: データ取得

### 開発・テスト
- **Jest**: ユニットテスト
- **React Testing Library**: コンポーネントテスト
- **Storybook**: コンポーネント開発
- **Playwright**: E2Eテスト

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の環境変数を設定してください：

```env
# データベース
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Airtable
AIRTABLE_API_KEY="your-airtable-api-key"
AIRTABLE_BASE_ID="your-airtable-base-id"
AIRTABLE_TABLE_ID="your-airtable-table-id"

# メール送信（オプション）
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
```

### 3. データベースのセットアップ

```bash
# データベースのマイグレーション
npx prisma migrate dev

# データベースのシード（オプション）
npx prisma db seed
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

## 使用方法

### ダッシュボードの利用

1. アプリケーションにアクセス
2. ログイン（認証が必要）
3. ダッシュボードページで各種分析を確認
4. フィルターを使用してデータを絞り込み

### フィルターの使い方

- **期間選択**: 日次・週次・月次から選択
- **プラットフォーム選択**: 複数選択可能
- **年代選択**: 複数選択可能
- **性別選択**: 複数選択可能

### チャットボットの利用

- 右下のチャットアイコンをクリック
- 質問を入力して回答を取得
- 最小化ボタンで一時的に非表示

## 開発

### テストの実行

```bash
# ユニットテスト
npm test

# E2Eテスト
npm run test:e2e

# Storybook
npm run storybook
```

### コード品質

```bash
# 型チェック
npm run type-check

# リント
npm run lint

# フォーマット
npm run format
```

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── (site)/            # サイトレイアウト
│   │   ├── (authorized)/  # 認証済みユーザー
│   │   │   ├── (app)/     # アプリケーション
│   │   │   │   └── dashboard/  # ダッシュボード
│   │   │   └── admin/     # 管理画面
│   │   └── (unauthorized)/ # 未認証ユーザー
│   └── api/               # APIルート
├── components/            # UIコンポーネント
│   ├── atoms/            # 基本コンポーネント
│   ├── molecules/        # 複合コンポーネント
│   └── organisms/        # 大規模コンポーネント
├── models/               # データモデル
├── repositories/         # データアクセス層
├── services/            # ビジネスロジック
└── types/               # 型定義
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## サポート

問題や質問がある場合は、GitHubのIssuesページでお知らせください。

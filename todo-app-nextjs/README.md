# TODOアプリ (Next.js版)

TypeScript、React、Next.jsで実装されたTODO管理アプリケーションです。

## 機能

- TODOの追加
- TODOの完了/未完了の切り替え
- TODOの削除
- ローカルストレージによるデータ永続化
- 薄緑の美しいデザイン

## 技術スタック

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **CSS Modules** (グローバルCSS)

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## プロジェクト構造

```
todo-app-nextjs/
├── app/
│   ├── globals.css      # グローバルスタイル
│   ├── layout.tsx       # ルートレイアウト
│   └── page.tsx         # メインページ
├── components/
│   ├── TodoItem.tsx     # TODOアイテムコンポーネント
│   └── TodoList.tsx     # TODOリストコンポーネント
├── hooks/
│   └── useTodos.ts      # TODO管理のカスタムフック
└── types/
    └── todo.ts          # TypeScript型定義
```

## ビルド

```bash
npm run build
npm start
```

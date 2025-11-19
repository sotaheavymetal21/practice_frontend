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

## 学習ガイド（React初心者向け）

このプロジェクトはReactの学習に最適化されています。以下の順序で学習することをおすすめします。

### 1. 基本概念の理解

#### コンポーネント
- `components/TodoItem.tsx` - 1つのTODOを表示するコンポーネント
- `components/TodoList.tsx` - TODOのリストを表示するコンポーネント
- `app/page.tsx` - メインのページコンポーネント

**学習ポイント:**
- コンポーネントは再利用可能なUIの部品
- Props（プロパティ）で親から子にデータを渡す
- コンポーネントは関数として定義する

#### State（状態管理）
- `useState` - コンポーネントの状態を管理
- `app/page.tsx`の`inputValue` stateを確認

**学習ポイント:**
- `useState`は値と更新関数のペアを返す
- Stateが変更されるとコンポーネントが再レンダリングされる

#### Hooks（フック）
- `useState` - 状態管理
- `useEffect` - 副作用（データ読み込みなど）
- `useRef` - DOM要素への参照

**学習ポイント:**
- Hooksは`use`で始まる名前
- コンポーネントのトップレベルでのみ呼び出せる

### 2. カスタムフック

`hooks/useTodos.ts`を詳しく読んでください。

**学習ポイント:**
- ロジックを再利用可能な形にまとめる
- コンポーネントからロジックを分離
- 他のコンポーネントでも同じロジックを使える

### 3. 重要なReactの概念

#### 制御コンポーネント（Controlled Component）
```tsx
<input
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
/>
```
- Reactが入力値を完全に制御
- `value`と`onChange`で双方向データバインディング

#### 条件付きレンダリング
```tsx
{todos.length > 0 && <button>全削除</button>}
{todo.completed ? <button>戻す</button> : <button>完了</button>}
```

#### リストのレンダリング
```tsx
{todos.map((todo) => (
    <TodoItem key={todo.id} todo={todo} />
))}
```
- `map`で配列をReact要素に変換
- `key` propは必須（Reactが要素を識別するため）

#### イベントハンドリング
```tsx
onClick={() => handleAddTodo()}
onChange={(e) => setInputValue(e.target.value)}
```

### 4. TypeScriptの型定義

`types/todo.ts`と各コンポーネントの`interface`を確認してください。

**学習ポイント:**
- 型定義でエラーを早期発見
- Propsの型を明確に定義
- IDEの補完が効く

### 5. データフロー

```
ユーザー操作
    ↓
イベントハンドラー（handleAddTodo）
    ↓
カスタムフック（useTodos）
    ↓
State更新（setTodos）
    ↓
再レンダリング
    ↓
UI更新
```

### 6. 学習の進め方

1. **まず全体を読む** - 各ファイルをざっと読んで全体像を把握
2. **1つずつ理解する** - 各概念（useState、useEffectなど）を1つずつ深く理解
3. **コードを変更してみる** - 小さな変更を加えて動作を確認
4. **自分で書いてみる** - 新しい機能を追加してみる

### 7. 次のステップ

このプロジェクトを理解したら、以下に挑戦してみてください：

- [ ] 編集機能を追加（TODOのテキストを編集できるようにする）
- [ ] 日付の追加（作成日時を表示）
- [ ] フィルター機能（すべて/未完了/完了済みでフィルター）
- [ ] ソート機能（作成日時順、完了日時順など）
- [ ] アニメーション追加（追加・削除時のアニメーション）

## コードの特徴

### 初心者向けに最適化された点

1. **詳細なコメント** - 各コードに説明コメントを追加
2. **明確な命名** - 関数名や変数名が分かりやすい
3. **適切な分割** - コンポーネントとロジックが適切に分離
4. **型安全性** - TypeScriptで型エラーを防止
5. **エラーハンドリング** - エラー処理が適切に実装

### ベストプラクティス

- ✅ コンポーネントの分割（単一責任の原則）
- ✅ カスタムフックでのロジック分離
- ✅ TypeScriptによる型安全性
- ✅ 制御コンポーネントの使用
- ✅ key propの適切な使用
- ✅ 条件付きレンダリングの適切な使用

## 参考資料

- [React公式ドキュメント](https://react.dev/)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)

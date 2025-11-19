'use client';

/**
 * TODO管理のカスタムフック
 * 
 * このフックは以下の機能を提供します：
 * - TODOの状態管理（追加、完了、削除、戻す）
 * - localStorageとの同期
 * - データの読み込み状態管理
 * 
 * カスタムフックとは、ロジックを再利用可能な形にまとめた関数です。
 * useで始まる名前が慣例です。
 */
import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';

// localStorageに保存する際のキー名
const STORAGE_KEY = 'todos';

export function useTodos() {
    // useState: コンポーネントの状態を管理するフック
    // todos: TODOの配列を保持
    // setTodos: todosを更新する関数
    const [todos, setTodos] = useState<Todo[]>([]);

    // データが読み込まれたかどうかを管理（初期レンダリング時のフラッシュを防ぐため）
    const [isLoaded, setIsLoaded] = useState(false);

    /**
     * useEffect: 副作用（side effects）を処理するフック
     * 
     * 第1引数: 実行する関数
     * 第2引数: 依存配列（空配列[]は「マウント時のみ実行」を意味する）
     * 
     * このuseEffectはコンポーネントがマウントされた時（初回レンダリング時）に1回だけ実行されます
     */
    useEffect(() => {
        try {
            // localStorageからデータを取得
            const stored = localStorage.getItem(STORAGE_KEY);

            // データがあればパース（JSON文字列をオブジェクトに変換）、なければ空配列
            const parsedTodos = stored ? JSON.parse(stored) : [];

            // 配列かどうかを検証（型安全性のため）
            setTodos(Array.isArray(parsedTodos) ? parsedTodos : []);
        } catch (error) {
            // エラーが発生した場合（例：不正なJSON形式）は空配列で初期化
            console.error('TODOの読み込みに失敗しました:', error);
            setTodos([]);
        } finally {
            // 読み込み処理が完了したことをマーク
            setIsLoaded(true);
        }
    }, []); // 空配列なので、マウント時のみ実行

    /**
     * todosが変更されるたびにlocalStorageに保存
     * 
     * 依存配列に[todos, isLoaded]を指定しているため、
     * todosまたはisLoadedが変更されるたびにこのuseEffectが実行されます
     */
    useEffect(() => {
        // 初回読み込みが完了するまでは保存しない（無限ループを防ぐ）
        if (isLoaded) {
            try {
                // todosをJSON文字列に変換してlocalStorageに保存
                localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
            } catch (error) {
                // エラーが発生した場合（例：ストレージ容量超過）
                console.error('TODOの保存に失敗しました:', error);
            }
        }
    }, [todos, isLoaded]); // todosまたはisLoadedが変更された時に実行

    /**
     * TODOを追加する関数
     * @param text - TODOのテキスト
     */
    const addTodo = (text: string) => {
        // 新しいTODOオブジェクトを作成
        const newTodo: Todo = {
            id: Date.now(), // 一意のIDとして現在のタイムスタンプを使用
            text: text.trim(), // 前後の空白を削除
            completed: false, // 初期状態は未完了
        };

        // setTodosの関数形式を使用（prevは現在のtodosの値）
        // スプレッド演算子(...)で既存の配列を展開し、新しい要素を追加
        setTodos((prev) => [...prev, newTodo]);
    };

    /**
     * TODOを完了状態に変更する関数
     * @param id - 完了にするTODOのID
     */
    const completeTodo = (id: number) => {
        // mapメソッドで配列の各要素を変換
        // 指定されたIDのTODOのcompletedプロパティをtrueに変更
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: true } : todo
            )
        );
    };

    /**
     * TODOを削除する関数
     * @param id - 削除するTODOのID
     */
    const deleteTodo = (id: number) => {
        // filterメソッドで条件に合う要素だけを残す
        // 指定されたID以外のTODOだけを残す（つまり、指定IDのTODOを削除）
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    /**
     * 完了したTODOを未完了に戻す関数
     * @param id - 戻すTODOのID
     */
    const returnTodo = (id: number) => {
        // completeTodoと同様に、completedプロパティをfalseに変更
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: false } : todo
            )
        );
    };

    /**
     * すべてのTODOを削除する関数
     */
    const clearAllTodos = () => {
        // 空配列に設定
        setTodos([]);

        // localStorageからも削除
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('TODOの削除に失敗しました:', error);
        }
    };

    // カスタムフックは、コンポーネントで使用できる値や関数を返す
    return {
        todos, // TODOの配列
        addTodo, // 追加関数
        completeTodo, // 完了関数
        deleteTodo, // 削除関数
        returnTodo, // 戻す関数
        clearAllTodos, // 全削除関数
        isLoaded, // 読み込み状態
    };
}

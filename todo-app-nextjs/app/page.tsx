'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { useTodos } from '@/hooks/useTodos';
import TodoList from '@/components/TodoList';

const MESSAGES = {
    emptyInput: 'TODOを入力してください',
    emptyIncomplete: '未完了のTODOはありません',
    emptyCompleted: '完了したTODOはありません',
};

export default function Home() {
    const { todos, addTodo, completeTodo, deleteTodo, returnTodo, clearAllTodos, isLoaded } =
        useTodos();
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddTodo = () => {
        const text = inputValue.trim();
        if (!text) {
            alert(MESSAGES.emptyInput);
            return;
        }
        addTodo(text);
        setInputValue('');
        inputRef.current?.focus();
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    };

    const handleClearAll = () => {
        if (todos.length === 0) return;
        if (confirm('すべてのTODOを削除しますか？')) {
            clearAllTodos();
        }
    };

    const incompleteTodos = todos.filter((todo) => !todo.completed);
    const completedTodos = todos.filter((todo) => todo.completed);

    if (!isLoaded) {
        return null; // またはローディング表示
    }

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0 }}>TODOアプリ</h1>
                {todos.length > 0 && (
                    <button
                        className="clear-all-button"
                        onClick={handleClearAll}
                        title="すべてのTODOを削除"
                    >
                        全削除
                    </button>
                )}
            </div>

            <div className="input-section">
                <input
                    ref={inputRef}
                    type="text"
                    className="todo-input"
                    placeholder="TODOを入力してください"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="add-button" onClick={handleAddTodo}>
                    追加
                </button>
            </div>

            <div className="todos-section">
                <h2>未完了のTODO</h2>
                <TodoList
                    todos={incompleteTodos}
                    isCompleted={false}
                    onComplete={completeTodo}
                    onDelete={deleteTodo}
                    onReturn={returnTodo}
                    emptyMessage={MESSAGES.emptyIncomplete}
                />
            </div>

            <div className="todos-section">
                <h2>完了したTODO</h2>
                <TodoList
                    todos={completedTodos}
                    isCompleted={true}
                    onComplete={completeTodo}
                    onDelete={deleteTodo}
                    onReturn={returnTodo}
                    emptyMessage={MESSAGES.emptyCompleted}
                />
            </div>
        </div>
    );
}

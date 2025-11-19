'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';

const STORAGE_KEY = 'todos';

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // ローカルストレージから読み込み
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const parsedTodos = stored ? JSON.parse(stored) : [];
            setTodos(Array.isArray(parsedTodos) ? parsedTodos : []);
        } catch (error) {
            console.error('TODOの読み込みに失敗しました:', error);
            setTodos([]);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // ローカルストレージに保存
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
            } catch (error) {
                console.error('TODOの保存に失敗しました:', error);
            }
        }
    }, [todos, isLoaded]);

    const addTodo = (text: string) => {
        const newTodo: Todo = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
        };
        setTodos((prev) => [...prev, newTodo]);
    };

    const completeTodo = (id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: true } : todo
            )
        );
    };

    const deleteTodo = (id: number) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    const returnTodo = (id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: false } : todo
            )
        );
    };

    const clearAllTodos = () => {
        setTodos([]);
        // localStorageもクリア
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('TODOの削除に失敗しました:', error);
        }
    };

    return {
        todos,
        addTodo,
        completeTodo,
        deleteTodo,
        returnTodo,
        clearAllTodos,
        isLoaded,
    };
}


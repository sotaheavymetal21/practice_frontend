'use client';

import { useState, useEffect } from 'react';
import { Todo, Priority, Category } from '@/types/todo';

const STORAGE_KEY = 'todos';

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // ローカルストレージから読み込み
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const parsedTodos = stored ? JSON.parse(stored) : [];
            
            // 古いデータ形式との互換性を保つ
            const migratedTodos = parsedTodos.map((todo: any) => ({
                ...todo,
                priority: todo.priority || 'medium',
                dueDate: todo.dueDate || null,
                category: todo.category || 'other',
                createdAt: todo.createdAt || new Date().toISOString(),
                updatedAt: todo.updatedAt || new Date().toISOString(),
            }));
            
            setTodos(Array.isArray(migratedTodos) ? migratedTodos : []);
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

    const addTodo = (
        text: string,
        priority: Priority = 'medium',
        dueDate: string | null = null,
        category: Category = 'other'
    ) => {
        const now = new Date().toISOString();
        const newTodo: Todo = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            priority,
            dueDate,
            category,
            createdAt: now,
            updatedAt: now,
        };
        setTodos((prev) => [...prev, newTodo]);
    };

    const updateTodo = (
        id: number,
        updates: Partial<Pick<Todo, 'text' | 'priority' | 'dueDate' | 'category'>>
    ) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
                    : todo
            )
        );
    };

    const completeTodo = (id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? { ...todo, completed: true, updatedAt: new Date().toISOString() }
                    : todo
            )
        );
    };

    const deleteTodo = (id: number) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    const returnTodo = (id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? { ...todo, completed: false, updatedAt: new Date().toISOString() }
                    : todo
            )
        );
    };

    const clearAllTodos = () => {
        setTodos([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('TODOの削除に失敗しました:', error);
        }
    };

    const toggleTodo = (id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? {
                          ...todo,
                          completed: !todo.completed,
                          updatedAt: new Date().toISOString(),
                      }
                    : todo
            )
        );
    };

    return {
        todos,
        addTodo,
        updateTodo,
        completeTodo,
        deleteTodo,
        returnTodo,
        toggleTodo,
        clearAllTodos,
        isLoaded,
    };
}

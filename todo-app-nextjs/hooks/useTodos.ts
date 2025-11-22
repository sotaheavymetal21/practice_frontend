'use client';

import { useState, useEffect } from 'react';
import { Todo, Priority, Category } from '@/types/todo';
import { createClient } from '@/utils/supabase/client';

const STORAGE_KEY = 'todos';

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    // Map Supabase data to Todo type
    const mapTodo = (data: any): Todo => ({
        id: data.id,
        text: data.text,
        completed: data.completed,
        priority: data.priority,
        dueDate: data.due_date,
        category: data.category,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    });

    // Check auth and load data
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data, error } = await supabase
                    .from('todos')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error('Error fetching todos:', error);
                } else if (data) {
                    setTodos(data.map(mapTodo));
                }
            } else {
                // Load from local storage
                try {
                    const stored = localStorage.getItem(STORAGE_KEY);
                    const parsedTodos = stored ? JSON.parse(stored) : [];

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
                }
            }
            setIsLoaded(true);
        };

        init();
    }, []);

    // Save to local storage if not logged in
    useEffect(() => {
        if (isLoaded && !user) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
            } catch (error) {
                console.error('TODOの保存に失敗しました:', error);
            }
        }
    }, [todos, isLoaded, user]);

    const addTodo = async (
        text: string,
        priority: Priority = 'medium',
        dueDate: string | null = null,
        category: Category = 'other'
    ) => {
        if (user) {
            const { data, error } = await supabase.from('todos').insert({
                text,
                priority,
                due_date: dueDate,
                category,
            }).select().single();

            if (error) {
                console.error('Error adding todo:', error);
                alert('TODOの追加に失敗しました');
            } else if (data) {
                setTodos((prev) => [...prev, mapTodo(data)]);
            }
        } else {
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
        }
    };

    const updateTodo = async (
        id: number,
        updates: Partial<Pick<Todo, 'text' | 'priority' | 'dueDate' | 'category'>>
    ) => {
        if (user) {
            const dbUpdates: any = { ...updates };
            if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;

            const { error } = await supabase
                .from('todos')
                .update({ ...dbUpdates, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) {
                console.error('Error updating todo:', error);
                alert('TODOの更新に失敗しました');
                return;
            }
        }

        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
                    : todo
            )
        );
    };

    const completeTodo = async (id: number) => {
        if (user) {
            const { error } = await supabase
                .from('todos')
                .update({ completed: true, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) {
                console.error('Error completing todo:', error);
                return;
            }
        }

        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? { ...todo, completed: true, updatedAt: new Date().toISOString() }
                    : todo
            )
        );
    };

    const deleteTodo = async (id: number) => {
        if (user) {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting todo:', error);
                return;
            }
        }
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    const returnTodo = async (id: number) => {
        if (user) {
            const { error } = await supabase
                .from('todos')
                .update({ completed: false, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) {
                console.error('Error returning todo:', error);
                return;
            }
        }

        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? { ...todo, completed: false, updatedAt: new Date().toISOString() }
                    : todo
            )
        );
    };

    const clearAllTodos = async () => {
        if (user) {
            const { error } = await supabase
                .from('todos')
                .delete()
                .neq('id', 0); // Delete all rows. 'id' != 0 is a hack to match all if id is positive. 
            // Better: .delete().gt('id', -1) or just .delete() but supabase requires a filter usually unless configured.
            // Actually RLS "Individuals can delete their own todos" allows deleting all own rows.
            // But client library might require a filter to prevent accidental delete all.
            // Let's use .gt('id', 0) assuming ids are positive.

            if (error) {
                console.error('Error clearing todos:', error);
                return;
            }
        } else {
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (error) {
                console.error('TODOの削除に失敗しました:', error);
            }
        }
        setTodos([]);
    };

    const toggleTodo = async (id: number) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        if (user) {
            const { error } = await supabase
                .from('todos')
                .update({ completed: !todo.completed, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) {
                console.error('Error toggling todo:', error);
                return;
            }
        }

        setTodos((prev) =>
            prev.map((t) =>
                t.id === id
                    ? {
                        ...t,
                        completed: !t.completed,
                        updatedAt: new Date().toISOString(),
                    }
                    : t
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
        user,
    };
}

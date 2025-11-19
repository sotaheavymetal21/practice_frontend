'use client';

import { useState, useMemo } from 'react';
import { Todo, FilterOptions, SortOption, Priority, Category } from '@/types/todo';

export function useFilterAndSort(todos: Todo[]) {
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        searchQuery: '',
        priority: 'all',
        category: 'all',
        showCompleted: true,
        showOverdue: false,
    });

    const [sortOption, setSortOption] = useState<SortOption>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const filteredAndSortedTodos = useMemo(() => {
        let filtered = [...todos];

        // 検索クエリでフィルター
        if (filterOptions.searchQuery) {
            const query = filterOptions.searchQuery.toLowerCase();
            filtered = filtered.filter((todo) =>
                todo.text.toLowerCase().includes(query)
            );
        }

        // 優先度でフィルター
        if (filterOptions.priority !== 'all') {
            filtered = filtered.filter(
                (todo) => todo.priority === filterOptions.priority
            );
        }

        // カテゴリでフィルター
        if (filterOptions.category !== 'all') {
            filtered = filtered.filter(
                (todo) => todo.category === filterOptions.category
            );
        }

        // 完了状態でフィルター
        if (!filterOptions.showCompleted) {
            filtered = filtered.filter((todo) => !todo.completed);
        }

        // 期限切れでフィルター
        if (filterOptions.showOverdue) {
            const now = new Date();
            filtered = filtered.filter((todo) => {
                if (!todo.dueDate || todo.completed) return false;
                return new Date(todo.dueDate) < now;
            });
        }

        // ソート
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortOption) {
                case 'priority':
                    const priorityOrder: Record<Priority, number> = {
                        high: 3,
                        medium: 2,
                        low: 1,
                    };
                    comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
                    break;
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) comparison = 0;
                    else if (!a.dueDate) comparison = 1;
                    else if (!b.dueDate) comparison = -1;
                    else
                        comparison =
                            new Date(a.dueDate).getTime() -
                            new Date(b.dueDate).getTime();
                    break;
                case 'text':
                    comparison = a.text.localeCompare(b.text);
                    break;
                case 'createdAt':
                default:
                    comparison =
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime();
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [todos, filterOptions, sortOption, sortDirection]);

    const updateFilter = (updates: Partial<FilterOptions>) => {
        setFilterOptions((prev) => ({ ...prev, ...updates }));
    };

    const toggleSortDirection = () => {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    // 統計情報
    const stats = useMemo(() => {
        const total = todos.length;
        const completed = todos.filter((t) => t.completed).length;
        const incomplete = total - completed;
        const overdue = todos.filter((t) => {
            if (!t.dueDate || t.completed) return false;
            return new Date(t.dueDate) < new Date();
        }).length;
        const highPriority = todos.filter(
            (t) => t.priority === 'high' && !t.completed
        ).length;

        return {
            total,
            completed,
            incomplete,
            overdue,
            highPriority,
        };
    }, [todos]);

    return {
        filteredAndSortedTodos,
        filterOptions,
        sortOption,
        sortDirection,
        updateFilter,
        setSortOption,
        toggleSortDirection,
        stats,
    };
}


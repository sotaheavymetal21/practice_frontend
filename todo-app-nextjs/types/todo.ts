/**
 * TODOの優先度
 */
export type Priority = 'high' | 'medium' | 'low';

/**
 * TODOのカテゴリ
 */
export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'other';

/**
 * TODOアイテムの型定義
 */
export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    priority: Priority;
    dueDate: string | null; // ISO形式の日付文字列
    category: Category;
    createdAt: string; // ISO形式の日付文字列
    updatedAt: string; // ISO形式の日付文字列
}

/**
 * フィルター条件
 */
export interface FilterOptions {
    searchQuery: string;
    priority: Priority | 'all';
    category: Category | 'all';
    showCompleted: boolean;
    showOverdue: boolean;
}

/**
 * ソートオプション
 */
export type SortOption = 'createdAt' | 'priority' | 'dueDate' | 'text';

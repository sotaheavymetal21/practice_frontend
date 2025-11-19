import { Todo } from '@/types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    isCompleted: boolean;
    onComplete: (id: number) => void;
    onDelete: (id: number) => void;
    onReturn: (id: number) => void;
    emptyMessage: string;
}

export default function TodoList({
    todos,
    isCompleted,
    onComplete,
    onDelete,
    onReturn,
    emptyMessage,
}: TodoListProps) {
    return (
        <ul className={`todo-list${isCompleted ? ' completed' : ''}`}>
            {todos.length === 0 ? (
                <li className="empty-message">{emptyMessage}</li>
            ) : (
                todos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onComplete={onComplete}
                        onDelete={onDelete}
                        onReturn={onReturn}
                    />
                ))
            )}
        </ul>
    );
}


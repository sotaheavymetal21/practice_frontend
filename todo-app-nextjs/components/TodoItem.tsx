import { Todo } from '@/types/todo';

interface TodoItemProps {
    todo: Todo;
    onComplete: (id: number) => void;
    onDelete: (id: number) => void;
    onReturn: (id: number) => void;
}

export default function TodoItem({
    todo,
    onComplete,
    onDelete,
    onReturn,
}: TodoItemProps) {
    return (
        <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
            <span className="todo-text">{todo.text}</span>
            <div className="button-group">
                {todo.completed ? (
                    <button
                        className="todo-button return-button"
                        onClick={() => onReturn(todo.id)}
                    >
                        戻す
                    </button>
                ) : (
                    <>
                        <button
                            className="todo-button complete-button"
                            onClick={() => onComplete(todo.id)}
                        >
                            完了
                        </button>
                        <button
                            className="todo-button delete-button"
                            onClick={() => onDelete(todo.id)}
                        >
                            削除
                        </button>
                    </>
                )}
            </div>
        </li>
    );
}


/**
 * TodoListコンポーネント
 * 
 * レインボーカラーを使った美しいデザイン実装
 */
import { Todo } from '@/types/todo';
import TodoItem from './TodoItem';
import { Box, Typography, Paper } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

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
        <Box>
            {todos.length === 0 ? (
                <Paper
                    elevation={0}
                    className="bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 border-2 border-dashed"
                    sx={{
                        borderRadius: 4,
                        padding: '64px 32px',
                        textAlign: 'center',
                        borderColor: '#e0e7ff',
                    }}
                >
                    <InboxIcon 
                        sx={{ 
                            fontSize: 80, 
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: 3,
                        }} 
                    />
                    <Typography
                        variant="body1"
                        className="text-gray-500 italic"
                        sx={{
                            fontSize: '1.1rem',
                            fontWeight: 500,
                        }}
                    >
                        {emptyMessage}
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ paddingTop: '8px' }}>
                    {todos.map((todo, index) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onComplete={onComplete}
                            onDelete={onDelete}
                            onReturn={onReturn}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}

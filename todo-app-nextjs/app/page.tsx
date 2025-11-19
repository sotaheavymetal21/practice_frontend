'use client';

/**
 * TODOアプリのメインページコンポーネント
 * 
 * レインボーカラーを使った美しいデザイン実装
 */
import { useState, useRef, KeyboardEvent } from 'react';
import { useTodos } from '@/hooks/useTodos';
import TodoList from '@/components/TodoList';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Fade,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

// メッセージ定数
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
        return (
            <Container maxWidth="md" className="min-h-screen py-16">
                <Box className="flex items-center justify-center h-screen">
                    <Box className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-transparent border-t-purple-500 border-r-pink-500 border-b-yellow-500 border-l-blue-500 mx-auto mb-6"></div>
                        <Typography variant="h6" className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                            読み込み中...
                        </Typography>
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
        <Box className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 via-yellow-50 to-blue-50 py-16 px-4">
            <Container maxWidth="md">
                <Fade in={true} timeout={800}>
                    <Paper
                        elevation={0}
                        className="p-10 md:p-16 backdrop-blur-xl bg-white/90 border border-white/30"
                        sx={{
                            borderRadius: 6,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        {/* ヘッダーセクション */}
                        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                            <Box>
                                <Typography 
                                    variant="h1" 
                                    className="mb-4 bg-gradient-to-r from-purple-600 via-pink-600 via-yellow-500 via-green-500 via-blue-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
                                    sx={{
                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                                        fontWeight: 800,
                                        letterSpacing: '-0.03em',
                                    }}
                                >
                                    TODOアプリ
                                </Typography>
                                <Box className="flex gap-3 mt-4">
                                    <Chip
                                        label={`未完了: ${incompleteTodos.length}`}
                                        size="medium"
                                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-bold border-2 border-purple-300"
                                        sx={{ fontSize: '0.9rem', padding: '4px 8px' }}
                                    />
                                    <Chip
                                        label={`完了: ${completedTodos.length}`}
                                        size="medium"
                                        className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 font-bold border-2 border-green-300"
                                        sx={{ fontSize: '0.9rem', padding: '4px 8px' }}
                                    />
                                </Box>
                            </Box>
                            {todos.length > 0 && (
                                <Button
                                    variant="contained"
                                    startIcon={<DeleteSweepIcon />}
                                    onClick={handleClearAll}
                                    className="rounded-xl shadow-lg hover:shadow-xl"
                                    sx={{
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                                        color: 'white',
                                        padding: '12px 24px',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    全削除
                                </Button>
                            )}
                        </Box>

                        {/* 入力セクション */}
                        <Box className="mb-16">
                            <Box className="flex flex-col sm:flex-row gap-4">
                                <TextField
                                    inputRef={inputRef}
                                    fullWidth
                                    placeholder="新しいTODOを入力..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    variant="outlined"
                                    className="bg-white/70 backdrop-blur-sm"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            padding: '4px',
                                            fontSize: '1.1rem',
                                            '& fieldset': {
                                                borderWidth: 2,
                                                borderColor: '#e0e7ff',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#a78bfa',
                                            },
                                            '&.Mui-focused': {
                                                boxShadow: '0 0 0 4px rgba(167, 139, 250, 0.1)',
                                                '& fieldset': {
                                                    borderColor: '#8b5cf6',
                                                    borderWidth: 2,
                                                },
                                            },
                                        },
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddTodo}
                                    className="rounded-xl shadow-lg hover:shadow-xl"
                                    sx={{
                                        minWidth: { xs: '100%', sm: '160px' },
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
                                        color: 'white',
                                        padding: '16px 32px',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #d97706 100%)',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    追加
                                </Button>
                            </Box>
                        </Box>

                        {/* 未完了のTODOセクション */}
                        <Box className="mb-16">
                            <Box className="flex items-center gap-3 mb-8">
                                <TaskAltIcon 
                                    sx={{ 
                                        fontSize: 32,
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }} 
                                />
                                <Typography 
                                    variant="h2" 
                                    className="text-gray-800 font-bold"
                                    sx={{ fontSize: '1.75rem' }}
                                >
                                    未完了のTODO
                                </Typography>
                                {incompleteTodos.length > 0 && (
                                    <Chip
                                        label={incompleteTodos.length}
                                        size="medium"
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
                                        sx={{ 
                                            fontSize: '1rem',
                                            padding: '6px 12px',
                                            height: '32px',
                                        }}
                                    />
                                )}
                            </Box>
                            <TodoList
                                todos={incompleteTodos}
                                isCompleted={false}
                                onComplete={completeTodo}
                                onDelete={deleteTodo}
                                onReturn={returnTodo}
                                emptyMessage={MESSAGES.emptyIncomplete}
                            />
                        </Box>

                        {/* 完了したTODOセクション */}
                        <Box>
                            <Box className="flex items-center gap-3 mb-8">
                                <TaskAltIcon 
                                    sx={{ 
                                        fontSize: 32,
                                        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }} 
                                />
                                <Typography 
                                    variant="h2" 
                                    className="text-gray-800 font-bold"
                                    sx={{ fontSize: '1.75rem' }}
                                >
                                    完了したTODO
                                </Typography>
                                {completedTodos.length > 0 && (
                                    <Chip
                                        label={completedTodos.length}
                                        size="medium"
                                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold"
                                        sx={{ 
                                            fontSize: '1rem',
                                            padding: '6px 12px',
                                            height: '32px',
                                        }}
                                    />
                                )}
                            </Box>
                            <TodoList
                                todos={completedTodos}
                                isCompleted={true}
                                onComplete={completeTodo}
                                onDelete={deleteTodo}
                                onReturn={returnTodo}
                                emptyMessage={MESSAGES.emptyCompleted}
                            />
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
}

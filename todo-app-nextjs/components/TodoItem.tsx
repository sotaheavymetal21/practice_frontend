'use client';

/**
 * TodoItemコンポーネント
 * 
 * レインボーカラーを使った美しいデザイン実装
 */
import { Todo } from '@/types/todo';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { motion } from 'framer-motion';

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
        >
            <Box
                sx={{
                    position: 'relative',
                    borderRadius: 4,
                    padding: '20px 24px',
                    marginBottom: '16px',
                    background: todo.completed
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)'
                        : 'white',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderLeft: '6px solid',
                    borderLeftColor: todo.completed ? '#10b981' : '#8b5cf6',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateX(6px)',
                        boxShadow: '0 12px 30px -8px rgba(139, 92, 246, 0.25)',
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '6px',
                        background: todo.completed
                            ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
                            : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                        borderRadius: '4px 0 0 4px',
                    },
                }}
            >
                <Box className="flex items-center justify-between gap-6">
                    {/* テキスト部分 */}
                    <Box className="flex items-center gap-4 flex-1 min-w-0">
                        {todo.completed ? (
                            <CheckCircleIcon 
                                sx={{ 
                                    fontSize: 32,
                                    color: '#10b981',
                                    flexShrink: 0,
                                }}
                            />
                        ) : (
                            <RadioButtonUncheckedIcon 
                                sx={{ 
                                    fontSize: 32,
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    flexShrink: 0,
                                }}
                            />
                        )}
                        <Typography
                            variant="body1"
                            className={`
                                flex-1 break-words
                                ${todo.completed 
                                    ? 'line-through text-gray-400' 
                                    : 'text-gray-800 font-medium'
                                }
                            `}
                            sx={{
                                fontSize: '1.1rem',
                                lineHeight: 1.7,
                                paddingRight: '8px',
                            }}
                        >
                            {todo.text}
                        </Typography>
                    </Box>

                    {/* ボタングループ */}
                    <Box className="flex items-center gap-2 flex-shrink-0">
                        {todo.completed ? (
                            <Tooltip title="戻す" arrow placement="top">
                                <IconButton
                                    onClick={() => onReturn(todo.id)}
                                    sx={{
                                        borderRadius: 2.5,
                                        padding: '10px',
                                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                                        color: '#3b82f6',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.15)',
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                        },
                                    }}
                                >
                                    <UndoIcon sx={{ fontSize: 24 }} />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <>
                                <Tooltip title="完了" arrow placement="top">
                                    <IconButton
                                        onClick={() => onComplete(todo.id)}
                                        sx={{
                                            borderRadius: 2.5,
                                            padding: '10px',
                                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 211, 153, 0.15) 100%)',
                                            color: '#10b981',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.15)',
                                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(34, 211, 153, 0.25) 100%)',
                                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                            },
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ fontSize: 24 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="削除" arrow placement="top">
                                    <IconButton
                                        onClick={() => onDelete(todo.id)}
                                        sx={{
                                            borderRadius: 2.5,
                                            padding: '10px',
                                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(251, 113, 133, 0.15) 100%)',
                                            color: '#ef4444',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.15)',
                                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(251, 113, 133, 0.25) 100%)',
                                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                            },
                                        }}
                                    >
                                        <DeleteIcon sx={{ fontSize: 24 }} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
}

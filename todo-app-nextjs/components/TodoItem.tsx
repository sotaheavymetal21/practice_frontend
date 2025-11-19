'use client';

/**
 * TodoItemコンポーネント
 * 
 * 編集、優先度、期限、カテゴリ機能付き
 */
import { useState } from 'react';
import { Todo, Priority, Category } from '@/types/todo';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Chip,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import EventIcon from '@mui/icons-material/Event';
import LabelIcon from '@mui/icons-material/Label';
import { motion } from 'framer-motion';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface TodoItemProps {
    todo: Todo;
    onComplete: (id: number) => void;
    onDelete: (id: number) => void;
    onReturn: (id: number) => void;
    onUpdate: (id: number, updates: Partial<Todo>) => void;
}

const priorityColors: Record<Priority, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
};

const categoryColors: Record<Category, string> = {
    work: '#8b5cf6',
    personal: '#ec4899',
    shopping: '#f59e0b',
    health: '#10b981',
    other: '#6b7280',
};

const categoryLabels: Record<Category, string> = {
    work: '仕事',
    personal: '個人',
    shopping: '買い物',
    health: '健康',
    other: 'その他',
};

export default function TodoItem({
    todo,
    onComplete,
    onDelete,
    onReturn,
    onUpdate,
}: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
    const [editCategory, setEditCategory] = useState<Category>(todo.category);
    const [editDueDate, setEditDueDate] = useState<Dayjs | null>(
        todo.dueDate ? dayjs(todo.dueDate) : null
    );

    const handleSave = () => {
        onUpdate(todo.id, {
            text: editText,
            priority: editPriority,
            category: editCategory,
            dueDate: editDueDate ? editDueDate.toISOString() : null,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(todo.text);
        setEditPriority(todo.priority);
        setEditCategory(todo.category);
        setEditDueDate(todo.dueDate ? dayjs(todo.dueDate) : null);
        setIsEditing(false);
    };

    const isOverdue =
        !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                        padding: '24px',
                        marginBottom: '16px',
                        background: todo.completed
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)'
                            : 'white',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderLeft: '6px solid',
                        borderLeftColor: priorityColors[todo.priority],
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'translateX(6px)',
                            boxShadow: '0 12px 30px -8px rgba(139, 92, 246, 0.25)',
                        },
                        ...(isOverdue && {
                            border: '2px solid #ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.05)',
                        }),
                    }}
                >
                    {isEditing ? (
                        <Box className="space-y-4">
                            <TextField
                                fullWidth
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <Box className="flex gap-3 flex-wrap">
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>優先度</InputLabel>
                                    <Select
                                        value={editPriority}
                                        label="優先度"
                                        onChange={(e) =>
                                            setEditPriority(e.target.value as Priority)
                                        }
                                    >
                                        <MenuItem value="high">高</MenuItem>
                                        <MenuItem value="medium">中</MenuItem>
                                        <MenuItem value="low">低</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>カテゴリ</InputLabel>
                                    <Select
                                        value={editCategory}
                                        label="カテゴリ"
                                        onChange={(e) =>
                                            setEditCategory(e.target.value as Category)
                                        }
                                    >
                                        <MenuItem value="work">仕事</MenuItem>
                                        <MenuItem value="personal">個人</MenuItem>
                                        <MenuItem value="shopping">買い物</MenuItem>
                                        <MenuItem value="health">健康</MenuItem>
                                        <MenuItem value="other">その他</MenuItem>
                                    </Select>
                                </FormControl>
                                <DatePicker
                                    label="期限"
                                    value={editDueDate}
                                    onChange={(newValue) => setEditDueDate(newValue)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            sx: { minWidth: 150 },
                                        },
                                    }}
                                />
                            </Box>
                            <Box className="flex gap-2 justify-end mt-4">
                                <IconButton
                                    onClick={handleSave}
                                    sx={{
                                        color: '#10b981',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                    }}
                                >
                                    <SaveIcon />
                                </IconButton>
                                <IconButton
                                    onClick={handleCancel}
                                    sx={{
                                        color: '#6b7280',
                                        background: 'rgba(107, 114, 128, 0.1)',
                                    }}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <Box className="flex items-start justify-between gap-6">
                                <Box className="flex items-start gap-4 flex-1 min-w-0">
                                    <IconButton
                                        onClick={() =>
                                            todo.completed
                                                ? onReturn(todo.id)
                                                : onComplete(todo.id)
                                        }
                                        sx={{
                                            marginTop: '4px',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {todo.completed ? (
                                            <CheckCircleIcon
                                                sx={{
                                                    fontSize: 32,
                                                    color: '#10b981',
                                                }}
                                            />
                                        ) : (
                                            <RadioButtonUncheckedIcon
                                                sx={{
                                                    fontSize: 32,
                                                    background:
                                                        'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                }}
                                            />
                                        )}
                                    </IconButton>
                                    <Box className="flex-1 min-w-0">
                                        <Typography
                                            variant="body1"
                                            className={`
                                                break-words mb-2
                                                ${todo.completed
                                                    ? 'line-through text-gray-400'
                                                    : 'text-gray-800 font-medium'
                                                }
                                            `}
                                            sx={{
                                                fontSize: '1.1rem',
                                                lineHeight: 1.7,
                                            }}
                                        >
                                            {todo.text}
                                        </Typography>
                                        <Box className="flex flex-wrap gap-2 mt-2">
                                            <Chip
                                                icon={<PriorityHighIcon />}
                                                label={
                                                    todo.priority === 'high'
                                                        ? '高'
                                                        : todo.priority === 'medium'
                                                        ? '中'
                                                        : '低'
                                                }
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        priorityColors[todo.priority] +
                                                        '20',
                                                    color: priorityColors[todo.priority],
                                                    fontWeight: 600,
                                                }}
                                            />
                                            <Chip
                                                icon={<LabelIcon />}
                                                label={categoryLabels[todo.category]}
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        categoryColors[todo.category] +
                                                        '20',
                                                    color: categoryColors[todo.category],
                                                    fontWeight: 600,
                                                }}
                                            />
                                            {todo.dueDate && (
                                                <Chip
                                                    icon={<EventIcon />}
                                                    label={dayjs(todo.dueDate).format(
                                                        'YYYY/MM/DD'
                                                    )}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: isOverdue
                                                            ? '#ef444420'
                                                            : '#3b82f620',
                                                        color: isOverdue
                                                            ? '#ef4444'
                                                            : '#3b82f6',
                                                        fontWeight: 600,
                                                        ...(isOverdue && {
                                                            border: '1px solid #ef4444',
                                                        }),
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                <Box className="flex items-center gap-2 flex-shrink-0">
                                    {!todo.completed && (
                                        <Tooltip title="編集" arrow placement="top">
                                            <IconButton
                                                onClick={() => setIsEditing(true)}
                                                sx={{
                                                    borderRadius: 2.5,
                                                    padding: '10px',
                                                    background:
                                                        'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                                                    color: '#8b5cf6',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        transform: 'scale(1.15)',
                                                        background:
                                                            'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                                                    },
                                                }}
                                            >
                                                <EditIcon sx={{ fontSize: 20 }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {todo.completed ? (
                                        <Tooltip title="戻す" arrow placement="top">
                                            <IconButton
                                                onClick={() => onReturn(todo.id)}
                                                sx={{
                                                    borderRadius: 2.5,
                                                    padding: '10px',
                                                    background:
                                                        'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                                                    color: '#3b82f6',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        transform: 'scale(1.15)',
                                                        background:
                                                            'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                                                    },
                                                }}
                                            >
                                                <UndoIcon sx={{ fontSize: 24 }} />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="完了" arrow placement="top">
                                            <IconButton
                                                onClick={() => onComplete(todo.id)}
                                                sx={{
                                                    borderRadius: 2.5,
                                                    padding: '10px',
                                                    background:
                                                        'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 211, 153, 0.15) 100%)',
                                                    color: '#10b981',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        transform: 'scale(1.15)',
                                                        background:
                                                            'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(34, 211, 153, 0.25) 100%)',
                                                    },
                                                }}
                                            >
                                                <CheckCircleIcon sx={{ fontSize: 24 }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="削除" arrow placement="top">
                                        <IconButton
                                            onClick={() => onDelete(todo.id)}
                                            sx={{
                                                borderRadius: 2.5,
                                                padding: '10px',
                                                background:
                                                    'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(251, 113, 133, 0.15) 100%)',
                                                color: '#ef4444',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    transform: 'scale(1.15)',
                                                    background:
                                                        'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(251, 113, 133, 0.25) 100%)',
                                                },
                                            }}
                                        >
                                            <DeleteIcon sx={{ fontSize: 24 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>
            </motion.div>
        </LocalizationProvider>
    );
}

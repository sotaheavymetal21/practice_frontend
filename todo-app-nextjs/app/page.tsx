'use client';

/**
 * TODOアプリのメインページコンポーネント
 * 
 * 多機能版：編集、優先度、期限、カテゴリ、検索、フィルター、ソート機能付き
 */
import { useState, useRef, KeyboardEvent } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { useFilterAndSort } from '@/hooks/useFilterAndSort';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Priority, Category, SortOption } from '@/types/todo';

const MESSAGES = {
    emptyInput: 'TODOを入力してください',
    emptyIncomplete: '未完了のTODOはありません',
    emptyCompleted: '完了したTODOはありません',
};

export default function Home() {
    const { todos, addTodo, updateTodo, completeTodo, deleteTodo, returnTodo, clearAllTodos, isLoaded } =
        useTodos();
    const {
        filteredAndSortedTodos,
        filterOptions,
        sortOption,
        sortDirection,
        updateFilter,
        setSortOption,
        toggleSortDirection,
        stats,
    } = useFilterAndSort(todos);

    const [inputValue, setInputValue] = useState('');
    const [inputPriority, setInputPriority] = useState<Priority>('medium');
    const [inputCategory, setInputCategory] = useState<Category>('other');
    const [inputDueDate, setInputDueDate] = useState<Dayjs | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddTodo = () => {
        const text = inputValue.trim();
        if (!text) {
            alert(MESSAGES.emptyInput);
            return;
        }
        addTodo(
            text,
            inputPriority,
            inputDueDate ? inputDueDate.toISOString() : null,
            inputCategory
        );
        setInputValue('');
        setInputPriority('medium');
        setInputCategory('other');
        setInputDueDate(null);
        setShowAddForm(false);
        inputRef.current?.focus();
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !showAddForm) {
            handleAddTodo();
        }
    };

    const handleClearAll = () => {
        if (todos.length === 0) return;
        if (confirm('すべてのTODOを削除しますか？')) {
            clearAllTodos();
        }
    };

    const incompleteTodos = filteredAndSortedTodos.filter((todo) => !todo.completed);
    const completedTodos = filteredAndSortedTodos.filter((todo) => todo.completed);

    if (!isLoaded) {
        return (
            <Container maxWidth="lg" className="min-h-screen py-16">
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 via-yellow-50 to-blue-50 py-16 px-4">
                <Container maxWidth="lg">
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
                            <Box className="mb-16">
                                <Typography
                                    variant="h1"
                                    className="mb-6 bg-gradient-to-r from-purple-600 via-pink-600 via-yellow-500 via-green-500 via-blue-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
                                    sx={{
                                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                                        fontWeight: 800,
                                        letterSpacing: '-0.03em',
                                    }}
                                >
                                    TODOアプリ
                                </Typography>

                                {/* 統計情報 */}
                                <Grid container spacing={2} className="mb-8">
                                    <Grid item xs={6} sm={4} md={2.4}>
                                        <Card
                                            sx={{
                                                background:
                                                    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                                color: 'white',
                                                borderRadius: 3,
                                            }}
                                        >
                                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {stats.total}
                                                </Typography>
                                                <Typography variant="caption">総数</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={2.4}>
                                        <Card
                                            sx={{
                                                background:
                                                    'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                                                color: 'white',
                                                borderRadius: 3,
                                            }}
                                        >
                                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {stats.completed}
                                                </Typography>
                                                <Typography variant="caption">完了</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={2.4}>
                                        <Card
                                            sx={{
                                                background:
                                                    'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
                                                color: 'white',
                                                borderRadius: 3,
                                            }}
                                        >
                                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {stats.incomplete}
                                                </Typography>
                                                <Typography variant="caption">未完了</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={2.4}>
                                        <Card
                                            sx={{
                                                background:
                                                    'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
                                                color: 'white',
                                                borderRadius: 3,
                                            }}
                                        >
                                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {stats.overdue}
                                                </Typography>
                                                <Typography variant="caption">期限切れ</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={2.4}>
                                        <Card
                                            sx={{
                                                background:
                                                    'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                                                color: 'white',
                                                borderRadius: 3,
                                            }}
                                        >
                                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {stats.highPriority}
                                                </Typography>
                                                <Typography variant="caption">高優先度</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* 検索・フィルター・ソートセクション */}
                            <Box className="mb-12 space-y-4">
                                <Box className="flex flex-wrap gap-3 items-center">
                                    <TextField
                                        placeholder="検索..."
                                        value={filterOptions.searchQuery}
                                        onChange={(e) =>
                                            updateFilter({ searchQuery: e.target.value })
                                        }
                                        size="small"
                                        InputProps={{
                                            startAdornment: <SearchIcon sx={{ mr: 1, color: '#8b5cf6' }} />,
                                        }}
                                        sx={{ flex: 1, minWidth: 200 }}
                                    />
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>優先度</InputLabel>
                                        <Select
                                            value={filterOptions.priority}
                                            label="優先度"
                                            onChange={(e) =>
                                                updateFilter({
                                                    priority: e.target.value as Priority | 'all',
                                                })
                                            }
                                        >
                                            <MenuItem value="all">すべて</MenuItem>
                                            <MenuItem value="high">高</MenuItem>
                                            <MenuItem value="medium">中</MenuItem>
                                            <MenuItem value="low">低</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>カテゴリ</InputLabel>
                                        <Select
                                            value={filterOptions.category}
                                            label="カテゴリ"
                                            onChange={(e) =>
                                                updateFilter({
                                                    category: e.target.value as Category | 'all',
                                                })
                                            }
                                        >
                                            <MenuItem value="all">すべて</MenuItem>
                                            <MenuItem value="work">仕事</MenuItem>
                                            <MenuItem value="personal">個人</MenuItem>
                                            <MenuItem value="shopping">買い物</MenuItem>
                                            <MenuItem value="health">健康</MenuItem>
                                            <MenuItem value="other">その他</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" sx={{ minWidth: 140 }}>
                                        <InputLabel>ソート</InputLabel>
                                        <Select
                                            value={sortOption}
                                            label="ソート"
                                            onChange={(e) =>
                                                setSortOption(e.target.value as SortOption)
                                            }
                                        >
                                            <MenuItem value="createdAt">作成日</MenuItem>
                                            <MenuItem value="priority">優先度</MenuItem>
                                            <MenuItem value="dueDate">期限</MenuItem>
                                            <MenuItem value="text">テキスト</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button
                                        variant="outlined"
                                        onClick={toggleSortDirection}
                                        startIcon={<SortIcon />}
                                        size="small"
                                        sx={{
                                            borderColor: '#8b5cf6',
                                            color: '#8b5cf6',
                                            '&:hover': {
                                                borderColor: '#7c3aed',
                                                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                            },
                                        }}
                                    >
                                        {sortDirection === 'asc' ? '昇順' : '降順'}
                                    </Button>
                                </Box>
                                <Box className="flex flex-wrap gap-2">
                                    <Chip
                                        label={filterOptions.showCompleted ? '完了を表示' : '完了を非表示'}
                                        onClick={() =>
                                            updateFilter({
                                                showCompleted: !filterOptions.showCompleted,
                                            })
                                        }
                                        color={filterOptions.showCompleted ? 'primary' : 'default'}
                                        size="small"
                                    />
                                    <Chip
                                        label="期限切れのみ"
                                        onClick={() =>
                                            updateFilter({
                                                showOverdue: !filterOptions.showOverdue,
                                            })
                                        }
                                        color={filterOptions.showOverdue ? 'error' : 'default'}
                                        size="small"
                                        icon={filterOptions.showOverdue ? <WarningIcon /> : undefined}
                                    />
                                </Box>
                            </Box>

                            {/* 追加フォーム */}
                            <Box className="mb-16">
                                {!showAddForm ? (
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => setShowAddForm(true)}
                                        className="w-full"
                                        sx={{
                                            background:
                                                'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
                                            color: 'white',
                                            padding: '16px',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: 3,
                                            '&:hover': {
                                                background:
                                                    'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #d97706 100%)',
                                            },
                                        }}
                                    >
                                        新しいTODOを追加
                                    </Button>
                                ) : (
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 4,
                                            borderRadius: 3,
                                            background:
                                                'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
                                        }}
                                    >
                                        <Box className="space-y-4">
                                            <TextField
                                                inputRef={inputRef}
                                                fullWidth
                                                placeholder="TODOを入力..."
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                variant="outlined"
                                                autoFocus
                                            />
                                            <Box className="flex flex-wrap gap-3">
                                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                                    <InputLabel>優先度</InputLabel>
                                                    <Select
                                                        value={inputPriority}
                                                        label="優先度"
                                                        onChange={(e) =>
                                                            setInputPriority(e.target.value as Priority)
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
                                                        value={inputCategory}
                                                        label="カテゴリ"
                                                        onChange={(e) =>
                                                            setInputCategory(e.target.value as Category)
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
                                                    label="期限（任意）"
                                                    value={inputDueDate}
                                                    onChange={(newValue) => setInputDueDate(newValue)}
                                                    slotProps={{
                                                        textField: {
                                                            size: 'small',
                                                            sx: { minWidth: 180 },
                                                        },
                                                    }}
                                                />
                                            </Box>
                                            <Box className="flex gap-3 justify-end">
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setShowAddForm(false);
                                                        setInputValue('');
                                                    }}
                                                >
                                                    キャンセル
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    onClick={handleAddTodo}
                                                    sx={{
                                                        background:
                                                            'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                                        '&:hover': {
                                                            background:
                                                                'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                                                        },
                                                    }}
                                                >
                                                    追加
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                )}
                            </Box>

                            {/* タブ */}
                            <Tabs
                                value={tabValue}
                                onChange={(_, newValue) => setTabValue(newValue)}
                                sx={{
                                    mb: 4,
                                    '& .MuiTab-root': {
                                        fontWeight: 600,
                                    },
                                }}
                            >
                                <Tab label={`未完了 (${incompleteTodos.length})`} />
                                <Tab label={`完了 (${completedTodos.length})`} />
                            </Tabs>

                            {/* TODOリスト */}
                            {tabValue === 0 ? (
                                <Box className="mb-16">
                                    <Box className="flex items-center gap-3 mb-8">
                                        <TaskAltIcon
                                            sx={{
                                                fontSize: 32,
                                                background:
                                                    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
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
                                    </Box>
                                    <TodoList
                                        todos={incompleteTodos}
                                        isCompleted={false}
                                        onComplete={completeTodo}
                                        onDelete={deleteTodo}
                                        onReturn={returnTodo}
                                        onUpdate={updateTodo}
                                        emptyMessage={MESSAGES.emptyIncomplete}
                                    />
                                </Box>
                            ) : (
                                <Box>
                                    <Box className="flex items-center gap-3 mb-8">
                                        <TaskAltIcon
                                            sx={{
                                                fontSize: 32,
                                                background:
                                                    'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
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
                                    </Box>
                                    <TodoList
                                        todos={completedTodos}
                                        isCompleted={true}
                                        onComplete={completeTodo}
                                        onDelete={deleteTodo}
                                        onReturn={returnTodo}
                                        onUpdate={updateTodo}
                                        emptyMessage={MESSAGES.emptyCompleted}
                                    />
                                </Box>
                            )}

                            {/* 全削除ボタン */}
                            {todos.length > 0 && (
                                <Box className="mt-12 text-center">
                                    <Button
                                        variant="contained"
                                        startIcon={<DeleteSweepIcon />}
                                        onClick={handleClearAll}
                                        sx={{
                                            background:
                                                'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                                            color: 'white',
                                            padding: '12px 24px',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: 3,
                                            '&:hover': {
                                                background:
                                                    'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                    >
                                        すべてのTODOを削除
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Fade>
                </Container>
            </Box>
        </LocalizationProvider>
    );
}

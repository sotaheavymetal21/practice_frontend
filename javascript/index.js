// TODOアプリのメインロジック

// 定数定義
const STORAGE_KEY = 'todos';
const MESSAGES = {
    emptyInput: 'TODOを入力してください',
    emptyIncomplete: '未完了のTODOはありません',
    emptyCompleted: '完了したTODOはありません'
};

// DOM要素の取得
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const incompleteTodosList = document.getElementById('incompleteTodos');
const completedTodosList = document.getElementById('completedTodos');
const clearAllButton = document.getElementById('clearAllButton');

// TODOデータの読み込み
let todos = loadTodosFromStorage();

// 初期表示
renderTodos();

// イベントリスナーの設定
addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
clearAllButton.addEventListener('click', clearAllTodos);

/**
 * ローカルストレージからTODOを読み込む
 */
function loadTodosFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('TODOの読み込みに失敗しました:', error);
        return [];
    }
}

/**
 * ローカルストレージにTODOを保存
 */
function saveTodosToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error('TODOの保存に失敗しました:', error);
    }
}

/**
 * TODOを追加
 */
function addTodo() {
    const text = todoInput.value.trim();
    
    if (!text) {
        alert(MESSAGES.emptyInput);
        return;
    }
    
    todos.push({
        id: Date.now(),
        text: text,
        completed: false
    });
    
    saveTodosToStorage();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

/**
 * TODOを完了にする
 */
function completeTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = true;
        saveTodosToStorage();
        renderTodos();
    }
}

/**
 * TODOを削除
 */
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodosToStorage();
    renderTodos();
}

/**
 * 完了したTODOを戻す
 */
function returnTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = false;
        saveTodosToStorage();
        renderTodos();
    }
}

/**
 * すべてのTODOを削除
 */
function clearAllTodos() {
    if (todos.length === 0) return;
    if (confirm('すべてのTODOを削除しますか？')) {
        todos = [];
        localStorage.removeItem(STORAGE_KEY);
        renderTodos();
    }
}

/**
 * TODOリストを描画
 */
function renderTodos() {
    renderTodoList(incompleteTodosList, todos.filter(t => !t.completed), false);
    renderTodoList(completedTodosList, todos.filter(t => t.completed), true);
    
    // 全削除ボタンの表示/非表示
    if (todos.length > 0) {
        clearAllButton.style.display = 'block';
    } else {
        clearAllButton.style.display = 'none';
    }
}

/**
 * TODOリストを描画（共通処理）
 */
function renderTodoList(container, todoList, isCompleted) {
    container.innerHTML = '';
    
    if (todoList.length === 0) {
        const message = isCompleted ? MESSAGES.emptyCompleted : MESSAGES.emptyIncomplete;
        container.innerHTML = `<li class="empty-message">${message}</li>`;
        return;
    }
    
    todoList.forEach(todo => {
        const li = createTodoElement(todo, isCompleted);
        container.appendChild(li);
    });
}

/**
 * TODO要素を作成
 */
function createTodoElement(todo, isCompleted) {
    const li = document.createElement('li');
    li.className = `todo-item${isCompleted ? ' completed' : ''}`;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    
    if (isCompleted) {
        // 完了したTODOには「戻す」ボタン
        const returnButton = createButton('戻す', 'return-button', () => returnTodo(todo.id));
        buttonGroup.appendChild(returnButton);
    } else {
        // 未完了のTODOには「完了」と「削除」ボタン
        const completeButton = createButton('完了', 'complete-button', () => completeTodo(todo.id));
        const deleteButton = createButton('削除', 'delete-button', () => deleteTodo(todo.id));
        buttonGroup.appendChild(completeButton);
        buttonGroup.appendChild(deleteButton);
    }
    
    li.appendChild(textSpan);
    li.appendChild(buttonGroup);
    
    return li;
}

/**
 * ボタン要素を作成
 */
function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.className = `todo-button ${className}`;
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

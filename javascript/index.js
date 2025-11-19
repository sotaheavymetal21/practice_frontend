// TODOアプリのメインロジック

// DOM要素の取得
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const incompleteTodosList = document.getElementById('incompleteTodos');
const completedTodosList = document.getElementById('completedTodos');

// TODOデータの保存（簡易的な実装）
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 初期表示
renderTodos();

// 追加ボタンのイベントリスナー
addButton.addEventListener('click', addTodo);

// Enterキーで追加
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// TODOを追加する関数
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        alert('TODOを入力してください');
        return;
    }
    
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    todos.push(newTodo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// TODOを完了にする関数
function completeTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = true;
        saveTodos();
        renderTodos();
    }
}

// TODOを削除する関数
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// 完了したTODOを戻す関数
function returnTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = false;
        saveTodos();
        renderTodos();
    }
}

// TODOリストを描画する関数
function renderTodos() {
    // 未完了のTODO
    const incompleteTodos = todos.filter(t => !t.completed);
    incompleteTodosList.innerHTML = '';
    
    if (incompleteTodos.length === 0) {
        incompleteTodosList.innerHTML = '<li class="empty-message">未完了のTODOはありません</li>';
    } else {
        incompleteTodos.forEach(todo => {
            const li = createTodoElement(todo, false);
            incompleteTodosList.appendChild(li);
        });
    }
    
    // 完了したTODO
    const completedTodos = todos.filter(t => t.completed);
    completedTodosList.innerHTML = '';
    
    if (completedTodos.length === 0) {
        completedTodosList.innerHTML = '<li class="empty-message">完了したTODOはありません</li>';
    } else {
        completedTodos.forEach(todo => {
            const li = createTodoElement(todo, true);
            completedTodosList.appendChild(li);
        });
    }
}

// TODO要素を作成する関数
function createTodoElement(todo, isCompleted) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (isCompleted ? ' completed' : '');
    
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    
    if (isCompleted) {
        // 完了したTODOには「戻す」ボタン
        const returnButton = document.createElement('button');
        returnButton.className = 'todo-button return-button';
        returnButton.textContent = '戻す';
        returnButton.addEventListener('click', () => returnTodo(todo.id));
        buttonGroup.appendChild(returnButton);
    } else {
        // 未完了のTODOには「完了」と「削除」ボタン
        const completeButton = document.createElement('button');
        completeButton.className = 'todo-button complete-button';
        completeButton.textContent = '完了';
        completeButton.addEventListener('click', () => completeTodo(todo.id));
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'todo-button delete-button';
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => deleteTodo(todo.id));
        
        buttonGroup.appendChild(completeButton);
        buttonGroup.appendChild(deleteButton);
    }
    
    li.appendChild(textSpan);
    li.appendChild(buttonGroup);
    
    return li;
}

// ローカルストレージに保存する関数
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}


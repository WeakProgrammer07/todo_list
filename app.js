// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const remaining = document.getElementById('remaining');
const clearCompleted = document.getElementById('clearCompleted');
const notification = document.getElementById('notification');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');
const themeToggle = document.getElementById('themeToggle');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');

// Tasks array
let tasks = [];

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('flora-theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('flora-theme', 'light');
        showNotification('morning light', 'info');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('flora-theme', 'dark');
        showNotification('evening shade', 'info');
    }
}

// Load tasks from localStorage
try {
    const saved = localStorage.getItem('flora-tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
} catch (e) {
    console.log('Storage not available');
}

// Save tasks
function saveTasks() {
    try {
        localStorage.setItem('flora-tasks', JSON.stringify(tasks));
    } catch (e) {
        console.log('Storage not available');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2200);
}

// Update progress bar
function updateProgress() {
    if (tasks.length === 0) {
        progressContainer.style.display = 'none';
        return;
    }

    const completedCount = tasks.filter(t => t.completed).length;
    const percentage = (completedCount / tasks.length) * 100;

    progressContainer.style.display = 'block';
    progressFill.style.width = `${percentage}%`;
}

// Update remaining count
function updateRemaining() {
    const remainingCount = tasks.filter(t => !t.completed).length;
    const totalCount = tasks.length;

    if (totalCount === 0) {
        remaining.textContent = 'nothing to do';
    } else if (remainingCount === 0) {
        remaining.textContent = 'all complete';
    } else {
        remaining.textContent = `${remainingCount} of ${totalCount}`;
    }
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">begin anew</div>';
        updateRemaining();
        updateProgress();
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        li.innerHTML = `
            <div class="checkbox ${task.completed ? 'checked' : ''}"></div>
            <span class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</span>
            <button class="delete-btn" data-index="${index}">×</button>
        `;
        taskList.appendChild(li);
    });

    updateRemaining();
    updateProgress();
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add task
function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        showNotification('enter a task', 'info');
        return;
    }

    tasks.push({ text, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
    showNotification('added', 'success');
}

// Toggle task
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();

    if (tasks[index].completed) {
        showNotification('done', 'success');

        // Check if all tasks are completed
        const allCompleted = tasks.every(t => t.completed);
        if (allCompleted && tasks.length > 0) {
            setTimeout(() => {
                showNotification('complete', 'success');
            }, 600);
        }
    }
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    showNotification('removed', 'info');
}

// Clear completed
function clearCompletedTasks() {
    const completedCount = tasks.filter(t => t.completed).length;

    if (completedCount === 0) {
        showNotification('nothing to clear', 'info');
        return;
    }

    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    showNotification('cleared', 'success');
}

// Window controls
if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
        if (typeof require !== 'undefined') {
            const { ipcRenderer } = require('electron');
            ipcRenderer.invoke('minimize-window');
        }
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (typeof require !== 'undefined') {
            const { ipcRenderer } = require('electron');
            ipcRenderer.invoke('quit-app');
        } else {
            window.close();
        }
    });
}

// Theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Event listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

taskList.addEventListener('click', (e) => {
    // Handle delete button
    if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.dataset.index);
        deleteTask(index);
        return;
    }

    // Toggle task on checkbox, task text, or list item click
    const li = e.target.closest('li');
    if (li && !e.target.classList.contains('delete-btn')) {
        const index = parseInt(li.dataset.index);
        if (!isNaN(index)) {
            toggleTask(index);
        }
    }
});

clearCompleted.addEventListener('click', clearCompletedTasks);

// Initialize
initTheme();
taskInput.focus();
renderTasks();

// Keep focus on input
setInterval(() => {
    if (document.activeElement === document.body) {
        taskInput.focus();
    }
}, 1000);

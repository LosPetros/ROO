// Get body element
const body = document.querySelector("body");

// Array to store all tasks
let tasks = [];

// Create main container
const container = document.createElement("div");
container.className = "container";

// Create header section
const header = document.createElement("header");
const h1 = document.createElement("h1");
h1.textContent = "📝 My TODO List";
const subtitle = document.createElement("p");
subtitle.className = "subtitle";
subtitle.textContent = "Stay organized and productive";
header.appendChild(h1);
header.appendChild(subtitle);

// Create input section
const inputSection = document.createElement("div");
inputSection.className = "input-section";

const taskInput = document.createElement("input");
taskInput.type = "text";
taskInput.id = "taskInput";
taskInput.placeholder = "What do you need to do?";
taskInput.autocomplete = "off";

const addButton = document.createElement("button");
addButton.id = "addButton";
addButton.className = "add-btn";
const buttonSpan = document.createElement("span");
buttonSpan.textContent = "+";
addButton.appendChild(buttonSpan);
addButton.appendChild(document.createTextNode(" Add Task"));

inputSection.appendChild(taskInput);
inputSection.appendChild(addButton);

// Create stats section
const statsDiv = document.createElement("div");
statsDiv.className = "stats";

// Total tasks stat
const totalStatItem = document.createElement("div");
totalStatItem.className = "stat-item";
const totalTasksEl = document.createElement("span");
totalTasksEl.className = "stat-number";
totalTasksEl.id = "totalTasks";
totalTasksEl.textContent = "0";
const totalLabel = document.createElement("span");
totalLabel.className = "stat-label";
totalLabel.textContent = "Total";
totalStatItem.appendChild(totalTasksEl);
totalStatItem.appendChild(totalLabel);

// Done tasks stat
const doneStatItem = document.createElement("div");
doneStatItem.className = "stat-item";
const doneTasksEl = document.createElement("span");
doneTasksEl.className = "stat-number";
doneTasksEl.id = "doneTasks";
doneTasksEl.textContent = "0";
const doneLabel = document.createElement("span");
doneLabel.className = "stat-label";
doneLabel.textContent = "Done";
doneStatItem.appendChild(doneTasksEl);
doneStatItem.appendChild(doneLabel);

// Pending tasks stat
const pendingStatItem = document.createElement("div");
pendingStatItem.className = "stat-item";
const pendingTasksEl = document.createElement("span");
pendingTasksEl.className = "stat-number";
pendingTasksEl.id = "pendingTasks";
pendingTasksEl.textContent = "0";
const pendingLabel = document.createElement("span");
pendingLabel.className = "stat-label";
pendingLabel.textContent = "Pending";
pendingStatItem.appendChild(pendingTasksEl);
pendingStatItem.appendChild(pendingLabel);

statsDiv.appendChild(totalStatItem);
statsDiv.appendChild(doneStatItem);
statsDiv.appendChild(pendingStatItem);

// Create tasks container
const tasksContainer = document.createElement("div");
tasksContainer.className = "tasks-container";
tasksContainer.id = "tasksContainer";

// Append all sections to container
container.appendChild(header);
container.appendChild(inputSection);
container.appendChild(statsDiv);
container.appendChild(tasksContainer);

// Append container to body
body.appendChild(container);

// Initialize the app
function init() {
    loadTasksFromLocalStorage();
    renderTasks();
    updateStats();
}

// Add new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        done: false
    };
    
    tasks.push(task);
    taskInput.value = '';
    saveTasksToLocalStorage();
    renderTasks();
    updateStats();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToLocalStorage();
    renderTasks();
    updateStats();
}

// Toggle task done/undone
function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.done = !task.done;
        saveTasksToLocalStorage();
        renderTasks();
        updateStats();
    }
}

// Edit task
function editTask(id, newText) {
    const task = tasks.find(task => task.id === id);
    if (task && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasksToLocalStorage();
        renderTasks();
        updateStats();
    }
}

// Render all tasks
function renderTasks() {
    tasksContainer.innerHTML = '';
    
    if (tasks.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        
        const emptyIcon = document.createElement("div");
        emptyIcon.className = "empty-state-icon";
        emptyIcon.textContent = "📋";
        
        const emptyText = document.createElement("div");
        emptyText.className = "empty-state-text";
        emptyText.textContent = "No tasks yet. Add one to get started!";
        
        emptyState.appendChild(emptyIcon);
        emptyState.appendChild(emptyText);
        tasksContainer.appendChild(emptyState);
        return;
    }
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

// Create a single task element
function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-item ${task.done ? 'done' : ''}`;
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.done;
    checkbox.onchange = () => toggleTask(task.id);
    
    // Task text (editable)
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.contentEditable = true;
    taskText.textContent = task.text;
    
    // Prevent line breaks in contentEditable
    taskText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            taskText.blur();
        }
    });
    
    // Save edited text on blur
    taskText.addEventListener('blur', () => {
        const newText = taskText.textContent.trim();
        if (newText !== '' && newText !== task.text) {
            editTask(task.id, newText);
        } else if (newText === '') {
            taskText.textContent = task.text;
        }
        taskText.classList.remove('editing');
    });
    
    // Add editing style on focus
    taskText.addEventListener('focus', () => {
        taskText.classList.add('editing');
    });
    
    // Action buttons container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';
    
    // Edit button (icon-only)
    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn edit';
    editBtn.title = 'Edit task';
    editBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/>
            <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="currentColor"/>
        </svg>`;
    editBtn.onclick = () => {
        taskText.focus();
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(taskText);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    };

    // Delete button (icon-only)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn delete';
    deleteBtn.title = 'Delete task';
    deleteBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z" fill="currentColor"/>
            <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
        </svg>`;
    deleteBtn.onclick = () => deleteTask(task.id);
    
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskText);
    taskDiv.appendChild(actionsDiv);
    
    return taskDiv;
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(task => task.done).length;
    const pending = total - done;
    
    totalTasksEl.textContent = total;
    doneTasksEl.textContent = done;
    pendingTasksEl.textContent = pending;
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('todoAppTasks', JSON.stringify(tasks));
    console.log('Tasks saved to localStorage:', tasks);
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('todoAppTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        console.log('Tasks loaded from localStorage:', tasks);
    } else {
        tasks = [];
        console.log('No saved tasks found in localStorage');
    }
}

// Event listeners
addButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize the app when page loads
init();

const input = document.querySelector('#input');
const date = document.querySelector('#date');
const duedate = document.querySelector('#due-date');
const submit = document.querySelector('#submit');
const list = document.querySelector('#ul');

const search = document.getElementById('search-btn');

const editContainer = document.querySelector('#edit-container');
const editInput = document.querySelector('#edit-input');
const editDate = document.querySelector('#edit-date');
const editDueDate = document.querySelector('#edit-due-date');
const editSubmit = document.querySelector('#edit-submit');
const editCancel = document.getElementById('edit-cancel');

const sortByDate = document.getElementById('sortByDate');
const sortByStatus = document.getElementById('sortByStatus');

let tasks = [];
let editTask = null;

window.addEventListener('load', () => {
    const storage = localStorage.getItem('tasks');
    if (storage) {
        tasks = JSON.parse(storage);
        tasks.forEach(task => {
            task.dueDateTime = new Date(task.dueDateTime);
            renderTask(task)
        });
    }
});
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


// SEARCH TASK
search.addEventListener('input', function () {
    const taskName = search.value.toLowerCase();
    if (taskName === '') {
        sortRenderTask(tasks);
    } else {
        const filteredTask = tasks.filter(task => task.name.toLowerCase().includes(taskName));
        sortRenderTask(filteredTask);
    }
});


// ADD TASK
submit.addEventListener('click', function () {
    const todo = input.value;
    const tododate = date.value;
    const dueDate = duedate.value;
    if (todo === '' || tododate === '' || dueDate === '') {
        alert("Please enter something");
        return;
    }

    const task = {
        name: todo,
        dueDateTime: new Date(`${tododate}T${dueDate}`),
        completed: false
    };
    tasks.push(task);
    renderTask(task);
    saveTasks();
    input.value = '';
    date.value = '';
    duedate.value = '';
});


// RENDER THE TASK
function renderTask(task) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function () {
        task.completed = this.checked;
        li.classList.toggle('completed', this.checked);
    });

    const textTodo = document.createElement('span');
    textTodo.textContent = task.name;
    textTodo.id = "taskText";

    const dateTodo = document.createElement('span');
    dateTodo.textContent = task.dueDateTime.toLocaleDateString();

    const dueDateTodo = document.createElement('span');
    dueDateTodo.textContent = task.dueDateTime.toLocaleTimeString();

    const editTodo = document.createElement('button');
    editTodo.textContent = "Edit";
    editTodo.addEventListener('click', function () {
        editTask = task;
        editContainer.style.display = '';

        editInput.value = task.name;
        editDate.value = task.dueDateTime.toISOString().split('T')[0];
        editDueDate.value = task.dueDateTime.toISOString().split('T')[1].slice(0, 5);
    });

    const deleteTodo = document.createElement('button');
    deleteTodo.textContent = "Delete";
    deleteTodo.addEventListener('click', function () {
        tasks = tasks.filter(t => t !== task);
        sortRenderTask();
        saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(textTodo);
    li.appendChild(dateTodo);
    li.appendChild(dueDateTodo);
    li.appendChild(editTodo);
    li.appendChild(deleteTodo);
    li.classList.toggle('completed', task.completed);

    list.appendChild(li);
};


// SORTING THE TASK BASED ON DUEDATE OR STATUS
sortByDate.addEventListener('click', function () {
    tasks.sort((a, b) => a.dueDateTime - b.dueDateTime);
    sortRenderTask();
});
sortByStatus.addEventListener('click', function () {
    tasks.sort((a, b) => a.completed - b.completed);
    sortRenderTask();
});
function sortRenderTask(tasks) {
    list.innerHTML = '';
    tasks.forEach(task => {
        renderTask(task);
    })
};


// EDIT CONTAINER
editSubmit.addEventListener('click', function () {
    if (editTask) {
        editTask.name = editInput.value;
        editTask.dueDateTime = new Date(`${editDate.value}T${editDueDate.value}`);
        list.innerHTML = '';
        tasks.forEach(renderTask);
        editContainer.style.display = 'none';
        saveTasks();
    }
});
editCancel.addEventListener('click', function () {
    editContainer.style.display = 'none';
});


// Checking the due time
function checkTime() {
    const recent = new Date();
    tasks.forEach(task => {
        const timeDifference = (task.dueDateTime - recent) / 60000;
        if (timeDifference <= 5 && timeDifference > 0 && !task.completed) {
            alert(`Task '${task.name}' not completed yet. Hurry!`);
            task.completed = true;
            saveTasks();
        }
    });
};
setInterval(checkTime, 60000);

alert("js is not connected");

const taskInput = document.getElementById("taskInput");

const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const emptyState =
    document.getElementById("emptyState");

const progressPercentage =
    document.getElementById("progressPercentage");

const progressCircle =
    document.querySelector(".progress-circle");

const currentDay =
    document.getElementById("currentDay");

const currentDate =
    document.getElementById("currentDate");


// Load tasks from localStorage

let tasks =
    JSON.parse(localStorage.getItem("smartTasks")) || [];

let currentFilter = "all";


// Display current date

function displayDate() {

    const today = new Date();

    const day = today.toLocaleDateString(
        "en-US",
        {
            weekday: "long"
        }
    );

    const date = today.toLocaleDateString(
        "en-US",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

    currentDay.innerText = day;

    currentDate.innerText = date;

}

displayDate();


// Add task when button is clicked

addBtn.addEventListener(
    "click",
    addTask
);


// Add task when Enter is pressed

taskInput.addEventListener(
    "keypress",
    function (event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// Add new task

function addTask() {

    const taskText =
        taskInput.value.trim();


    if (taskText === "") {

        taskInput.focus();

        return;

    }


    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();


    taskInput.value = "";


    displayTasks();


    taskInput.focus();

}


// Display tasks

function displayTasks() {

    taskList.innerHTML = "";


    const searchText =
        searchInput.value.toLowerCase().trim();


    let filteredTasks =
        tasks.filter(function (task) {

            return task.text
                .toLowerCase()
                .includes(searchText);

        });


    if (currentFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(function (task) {

                return task.completed;

            });

    }


    if (currentFilter === "pending") {

        filteredTasks =
            filteredTasks.filter(function (task) {

                return !task.completed;

            });

    }


    filteredTasks.forEach(function (task) {


        const li =
            document.createElement("li");


        li.className = "task-item";


        if (task.completed) {

            li.classList.add("completed");

        }


        li.innerHTML = `

            <div class="task-content">

                <button
                    class="task-check"
                    onclick="toggleTask(${task.id})">

                    ${task.completed ? "✓" : ""}

                </button>

                <span class="task-text">

                    ${escapeHTML(task.text)}

                </span>

            </div>


            <div class="task-actions">

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">

                    🗑️

                </button>

            </div>

        `;


        taskList.appendChild(li);

    });


    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    updateStats();

}


// Toggle task completion

function toggleTask(id) {

    tasks =
        tasks.map(function (task) {

            if (task.id === id) {

                task.completed =
                    !task.completed;

            }

            return task;

        });


    saveTasks();

    displayTasks();

}


// Delete task

function deleteTask(id) {

    tasks =
        tasks.filter(function (task) {

            return task.id !== id;

        });


    saveTasks();

    displayTasks();

}


// Search tasks

searchInput.addEventListener(
    "input",
    displayTasks
);


// Filter buttons

const filterButtons =
    document.querySelectorAll(".filter-btn");


filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {


            filterButtons.forEach(
                function (btn) {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            currentFilter =
                button.dataset.filter;


            displayTasks();

        }
    );

});


// Update statistics

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    const pending =
        total - completed;


    totalTasks.innerText =
        total;


    completedTasks.innerText =
        completed;


    pendingTasks.innerText =
        pending;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressPercentage.innerText =
        percentage + "%";


    progressCircle.style.background =
        `conic-gradient(

            var(--primary)
            ${percentage * 3.6}deg,

            var(--panel-light)
            ${percentage * 3.6}deg

        )`;

}


// Save tasks

function saveTasks() {

    localStorage.setItem(

        "smartTasks",

        JSON.stringify(tasks)

    );

}


// Prevent HTML injection

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


// Initial display

displayTasks();

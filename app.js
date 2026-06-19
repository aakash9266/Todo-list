const addTodoBtn = document.getElementById("addTodoBtn")
const inputTag = document.getElementById("todoInput")
const todoListUl = document.getElementById("todoList")
const remaining = document.getElementById("remaining-count")
const clearCompletedBtn = document.getElementById("clearCompletedBtn")
const filterBtns = document.querySelectorAll(".filter-btn")

let todoText;
let todos = [];
let currentFilter = "all"; // "all" | "active" | "completed"

let todosString = localStorage.getItem("todos")
if (todosString) {
    todos = JSON.parse(todosString);
    remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length;
}

const getFilteredTodos = () => {
    if (currentFilter === "active") {
        return todos.filter(todo => !todo.isCompleted)
    }
    if (currentFilter === "completed") {
        return todos.filter(todo => todo.isCompleted)
    }
    return todos
}

const populateTodos = () => {
    let string = "";
    for (const todo of getFilteredTodos()) {
        string += `<li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
            <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""} >
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn">×</button>
        </li>`
    }
    todoListUl.innerHTML = string

    const todoCheckboxes = document.querySelectorAll(".todo-checkbox")
    todoCheckboxes.forEach((element) => {
        element.addEventListener("click", (e) => {
            todos = todos.map(todo => {
                if (todo.id == element.parentNode.id) {
                    return { ...todo, isCompleted: e.target.checked }
                }
                return todo
            })
            remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length;
            localStorage.setItem("todos", JSON.stringify(todos))
            populateTodos() // re-render so completed items disappear from "Active" filter etc.
        })
    })

    let deleteBtns = document.querySelectorAll(".delete-btn")
    deleteBtns.forEach((element) => {
        element.addEventListener("click", (e) => {
            const confirmation = confirm("Do you want to delete this todo")
            if (confirmation) {
                todos = todos.filter((todo) => {
                    return (todo.id) !== (e.target.parentNode.id)
                })
                remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length;
                localStorage.setItem("todos", JSON.stringify(todos))
                populateTodos()
            }
        })
    })
}

// Filter button logic
filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter
        filterBtns.forEach(b => b.classList.remove("active"))
        btn.classList.add("active")
        populateTodos()
    })
})

clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((todo) => todo.isCompleted == false)
    remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length;
    localStorage.setItem("todos", JSON.stringify(todos))
    populateTodos()
})

addTodoBtn.addEventListener("click", () => {
    todoText = inputTag.value
    if (todoText.trim().length < 4) {
        alert("You cannot add a todo that small!")
        return
    }
    inputTag.value = ""
    let todo = {
        id: "todo-" + Date.now(),
        title: todoText,
        isCompleted: false
    }
    todos.push(todo)
    remaining.innerHTML = todos.filter((item) => { return item.isCompleted != true }).length;
    localStorage.setItem("todos", JSON.stringify(todos))
    populateTodos()
})

populateTodos()
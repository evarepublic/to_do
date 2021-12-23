"use strict";

class Todo {
  constructor(form, todoContainer) {
    this.form = document.querySelector(form);
    this.input = this.form.querySelector("input");
    this.todoContainer = document.querySelector(todoContainer);
    this.todoList = this.todoContainer.querySelector(".todo-list");
    this.todoCompleted = this.todoContainer.querySelector(".todo-completed");
    this.todoData = new Map(JSON.parse(localStorage.getItem("todoList")));
  }

  addToStorage() {
    localStorage.setItem("todoList", JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = "";
    this.todoCompleted.textContent = "";
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }

  createItem(todo) {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    li.key = todo.key;
    li.insertAdjacentHTML(
      "beforeend",
      `
      <span class="text-todo">${todo.value}</span>
      <div class="todo-buttons">
        <button class="todo-edit"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>`
    );

    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  generateKey() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  addTodo(e) {
    e.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.form.reset();
      this.render();
    } else {
      console.log("Нельзя добавить пустое дело");
    }
  }

  editItem(elem) {
    const inputField = elem.querySelector("span");
    inputField.contentEditable = true;
    inputField.focus();
    const edit = () => {
      if (inputField.textContent.trim()) {
        this.todoData.get(elem.key).value = inputField.textContent;
      } else {
        console.log("Нельзя добавить пустое дело");
      }
      inputField.contentEditable = false;
      this.render();
    };
    const mouseEdit = (e) => {
      if (!e.target.matches("li>span") && !e.target.closest(".todo-buttons")) {
        edit();
      }
    };
    const keyboardEdit = (e) => {
      if (e.key === "Enter") {
        edit();
      }
    };
    window.addEventListener("click", mouseEdit);
    window.addEventListener("keydown", keyboardEdit);
  }

  removeItem(elemKey) {
    this.todoData.delete(elemKey);
    this.render();
  }

  completeItem(elemKey) {
    this.todoData.get(elemKey).completed =
      !this.todoData.get(elemKey).completed;
    this.render();
  }

  handler(e) {
    let target = e.target;
    if (!target.closest(".todo-buttons")) {
      return;
    } else {
      if (target.matches(`[class$='edit']`)) {
        this.editItem(target.closest("li"));
      } else if (target.matches(`[class$='remove']`)) {
        this.removeItem(target.closest("li").key);
      }
      if (target.matches(`[class$='complete']`)) {
        this.completeItem(target.closest("li").key);
      } else {
        return;
      }
    }
  }

  init() {
    this.form.addEventListener("submit", this.addTodo.bind(this));
    this.todoContainer.addEventListener("click", this.handler.bind(this));
    this.render();
  }
}

const todo = new Todo(".todo-control", ".todo-container");

todo.init();

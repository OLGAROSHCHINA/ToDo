var vm = Vue.createApp({

    mounted() {
        this.getTodos()
        this.getUsers()
    },

    data() {
        return {
            todos: [],
            todosFilter: [],
            users: [],
            count: 0,
            inputData: {
                id: '',
                userId: 11,
                title: '',
                completed: false,
            },
            sortAndFilt: 'Сортировка и фильтры отсутствуют',
        }

    },

    computed: {
        todosList() {
            if (this.todosFilter.length != 0) {
                return this.todosFilter
            } else {
                return this.todos
            }
        },
        usersList() {
            return this.users
        },
        sortStatus() {
            return this.sortAndFilt
        },
        todoData() {
            return this.inputData
        },
        countId() {
            return this.count
        }
    },

    methods: {

        async getTodos() {
            await fetch('https://jsonplaceholder.typicode.com/todos/')
                .then(response => response.json())
                .then(json => {
                    this.todos = json
                    this.count = this.todos.length
                })
            
        },

        async getUsers() {
            await fetch('https://jsonplaceholder.typicode.com/users')
                .then(response => response.json())
                .then(json => {this.users = json})
        },

        getUserByID(userId) {
            if (userId === 11) {
                return { name: 'Olga Roshchina' }
            } else {
                return this.users.find(function(item) {
                    return item.id === userId
                })                
            }
        },

        submitForm() {
            this.count = this.count + 1
            
            this.todos.push({
                id: this.count,
                userId: this.inputData.userId,
                title: this.inputData.title,
                completed: this.inputData.completed
            })
            
            this.inputData.title = ''
        },

        completeTodo(id) {

            for (let todo of this.todos) {
                
                if (todo.id === id) {
                    todo.completed = !todo.completed
                }
            }
        },

        removeTodo(id) {

            const index = this.todos.findIndex(item => item.id === id);

            if (index !== -1) {
                this.todos.splice(index, 1);
              }
        },

        clearSortAndFilt() {
            this.todosFilter = []
            this.sortAndFilt = 'Сортировка и фильтры отсутствуют'
            this.todos.sort((a, b) => a.id > b.id ? 1 : -1)
        },

        sortByCompleted(completed) {

            this.clearSortAndFilt()

            if (completed === 'true') {
                this.todos.sort((a, b) => a.completed < b.completed ? 1 : -1)
                this.sortAndFilt = 'Сортировка: сначала готовые'
            } else {
                this.todos.sort((a, b) => a.completed > b.completed ? 1 : -1)
                this.sortAndFilt = 'Сортировка: сначала неготовые'
            }
            
        },

        filterByAuthor(userId) {
            this.clearSortAndFilt()
            this.sortAndFilt = `Фильтрация по автору: ${this.getUserByID(userId).name}`
            this.todosFilter = this.todos.filter(item => item.userId === userId)
        },


    },

    template: 
    `
        <h3 class="stats-title">
            Список дел
        </h3>

        <form @submit.prevent="submitForm()" class="d-flex justify-content-between">

            <div class="form-floating w-100">
                <input class="form-control" type="text" name="inputTodo" id="inputTodo" v-model="inputData.title" placeholder="Напишите задачу">
                <label class="form-label" for="inputTodo">
                    Напишите задачу
                </label>
            </div>

            <button id="addBtn" class="btn btn-primary" type="submit">
                Добавить
            </button>

        </form>

        <div class="d-flex justify-content-between m-3">

            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Сортировать
                </button>
        
                <ul class="dropdown-menu">
                    <li @click="sortByCompleted('true')">
                        <a class="dropdown-item" href="#">
                            Сначала готовые
                        </a>
                    </li>
                    <li @click="sortByCompleted('false')">
                        <a class="dropdown-item" href="#">
                            Сначала неготовые
                        </a>
                    </li>
                </ul>
            </div>

            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button"                 data-bs-toggle="dropdown" aria-expanded="false">
                    Фильтровать по автору
                </button>
                
                <ul class="dropdown-menu">
                    <li v-for="user in users">
                        <a class="dropdown-item" href="#" @click="filterByAuthor(user.id)">
                            {{ user.name }}
                        </a>
                    </li>
                </ul>
            </div>

            <div class="text-center">
                {{ this.sortStatus }}
            </div>
            
            <button @click="clearSortAndFilt()" class="btn btn-secondary">
                Сбросить все
            </button>

        </div>



        <ul class="todos">
            
            <li v-for="todo in todosList">

                <div :class=" todo.completed ? 'todo-completed' : '' ">

                    <p class="text fs-5 m-0">
                        {{ getUserByID(todo.userId).name }} 
                    </p>

                    <div class="d-flex justify-content-between">
                        <p class="m-0">
                            Задача {{ todo.title }}
                        </p>

                        <div class="btn-group">
                            <button class="btn btn-success" @click="completeTodo(todo.id)">✔️</button>
                            <button class="btn btn-danger" @click="removeTodo(todo.id)">&#10060;</button>
                        </div>    
                    </div>

                </div>
                
            </li>
        </ul>

    `
})

vm.mount('#app')

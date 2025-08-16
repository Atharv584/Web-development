class ExamTaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("examTasks")) || []
    this.subjects = JSON.parse(localStorage.getItem("examSubjects")) || [
      { id: "math", name: "Mathematics", color: "#3b82f6" },
      { id: "science", name: "Science", color: "#10b981" },
      { id: "english", name: "English", color: "#f59e0b" },
    ]
    this.currentSubject = "all"
    this.currentView = "tasks"
    this.currentDate = new Date()
    this.editingTask = null

    this.init()
  }

  init() {
    this.bindEvents()
    this.renderSubjects()
    this.renderTasks()
    this.updateStats()
    this.checkReminders()

    // Check reminders every minute
    setInterval(() => this.checkReminders(), 60000)
  }

  bindEvents() {
    // Modal events
    document.getElementById("addTaskBtn").addEventListener("click", () => this.openTaskModal())
    document.getElementById("addSubjectBtn").addEventListener("click", () => this.openSubjectModal())
    document.getElementById("closeModal").addEventListener("click", () => this.closeTaskModal())
    document.getElementById("closeSubjectModal").addEventListener("click", () => this.closeSubjectModal())
    document.getElementById("cancelTask").addEventListener("click", () => this.closeTaskModal())
    document.getElementById("cancelSubject").addEventListener("click", () => this.closeSubjectModal())

    // Form events
    document.getElementById("taskForm").addEventListener("submit", (e) => this.handleTaskSubmit(e))
    document.getElementById("subjectForm").addEventListener("submit", (e) => this.handleSubjectSubmit(e))

    // View toggle
    document.getElementById("viewToggle").addEventListener("click", () => this.toggleView())

    // Calendar navigation
    document.getElementById("prevMonth").addEventListener("click", () => this.navigateMonth(-1))
    document.getElementById("nextMonth").addEventListener("click", () => this.navigateMonth(1))

    // Color presets
    document.querySelectorAll(".color-preset").forEach((preset) => {
      preset.addEventListener("click", (e) => {
        document.getElementById("subjectColor").value = e.target.dataset.color
      })
    })

    // Close modal on outside click
    document.getElementById("taskModal").addEventListener("click", (e) => {
      if (e.target.id === "taskModal") this.closeTaskModal()
    })
    document.getElementById("subjectModal").addEventListener("click", (e) => {
      if (e.target.id === "subjectModal") this.closeSubjectModal()
    })
  }

  // Data Management
  saveData() {
    localStorage.setItem("examTasks", JSON.stringify(this.tasks))
    localStorage.setItem("examSubjects", JSON.stringify(this.subjects))
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Subject Management
  addSubject(name, color) {
    const subject = {
      id: this.generateId(),
      name,
      color,
    }
    this.subjects.push(subject)
    this.saveData()
    this.renderSubjects()
    this.updateTaskSubjectOptions()
  }

  renderSubjects() {
    const container = document.getElementById("subjectsTabs")
    const allTab = container.querySelector('[data-subject="all"]')

    // Clear existing subject tabs (keep "All Tasks" tab)
    const subjectTabs = container.querySelectorAll('.subject-tab:not([data-subject="all"])')
    subjectTabs.forEach((tab) => tab.remove())

    // Add subject tabs
    this.subjects.forEach((subject) => {
      const tab = document.createElement("button")
      tab.className = "subject-tab"
      tab.dataset.subject = subject.id
      tab.style.setProperty("--subject-color", subject.color)
      tab.innerHTML = `
                <div style="width: 12px; height: 12px; background: ${subject.color}; border-radius: 50%;"></div>
                ${subject.name}
            `
      tab.addEventListener("click", () => this.switchSubject(subject.id))
      container.appendChild(tab)
    })

    this.updateTaskSubjectOptions()
  }

  updateTaskSubjectOptions() {
    const select = document.getElementById("taskSubject")
    select.innerHTML = '<option value="">Select Subject</option>'

    this.subjects.forEach((subject) => {
      const option = document.createElement("option")
      option.value = subject.id
      option.textContent = subject.name
      select.appendChild(option)
    })
  }

  switchSubject(subjectId) {
    this.currentSubject = subjectId

    // Update active tab
    document.querySelectorAll(".subject-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.subject === subjectId)
    })

    // Update title
    const subject = subjectId === "all" ? { name: "All Tasks" } : this.subjects.find((s) => s.id === subjectId)
    document.getElementById("currentSubjectTitle").textContent = subject.name

    this.renderTasks()
    this.updateStats()
  }

  // Task Management
  addTask(taskData) {
    const task = {
      id: this.generateId(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    this.tasks.push(task)
    this.saveData()
    this.renderTasks()
    this.updateStats()
  }

  updateTask(taskId, taskData) {
    const index = this.tasks.findIndex((t) => t.id === taskId)
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...taskData }
      this.saveData()
      this.renderTasks()
      this.updateStats()
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((t) => t.id !== taskId)
    this.saveData()
    this.renderTasks()
    this.updateStats()
  }

  toggleTaskComplete(taskId) {
    const task = this.tasks.find((t) => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      this.saveData()
      this.renderTasks()
      this.updateStats()
    }
  }

  getFilteredTasks() {
    if (this.currentSubject === "all") {
      return this.tasks
    }
    return this.tasks.filter((task) => task.subject === this.currentSubject)
  }

  renderTasks() {
    const container = document.getElementById("tasksContainer")
    const tasks = this.getFilteredTasks()

    if (tasks.length === 0) {
      container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #6b7280;">
                    <i class="fas fa-tasks" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>No tasks yet. Add your first exam task!</p>
                </div>
            `
      return
    }

    // Sort tasks by due date and completion status
    const sortedTasks = tasks.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      return new Date(a.dueDate) - new Date(b.dueDate)
    })

    container.innerHTML = sortedTasks.map((task) => this.renderTaskCard(task)).join("")
  }

  renderTaskCard(task) {
    const subject = this.subjects.find((s) => s.id === task.subject)
    const dueDate = new Date(task.dueDate + (task.dueTime ? `T${task.dueTime}` : ""))
    const now = new Date()
    const isOverdue = dueDate < now && !task.completed
    const isDueSoon = dueDate - now < 24 * 60 * 60 * 1000 && dueDate > now

    let dueDateClass = ""
    if (isOverdue) dueDateClass = "overdue"
    else if (isDueSoon) dueDateClass = "due-soon"

    return `
            <div class="task-card ${task.completed ? "completed" : ""} ${task.priority}-priority">
                <div class="task-header">
                    <div>
                        <h3 class="task-title ${task.completed ? "line-through" : ""}">${task.title}</h3>
                        ${subject ? `<span class="task-subject" style="background: ${subject.color}">${subject.name}</span>` : ""}
                    </div>
                    <div class="task-actions">
                        <button class="task-action complete" onclick="taskManager.toggleTaskComplete('${task.id}')" title="${task.completed ? "Mark as incomplete" : "Mark as complete"}">
                            <i class="fas ${task.completed ? "fa-undo" : "fa-check"}"></i>
                        </button>
                        <button class="task-action edit" onclick="taskManager.editTask('${task.id}')" title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action delete" onclick="taskManager.deleteTask('${task.id}')" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                ${task.description ? `<p class="task-description">${task.description}</p>` : ""}
                <div class="task-footer">
                    <div class="task-due ${dueDateClass}">
                        <i class="fas fa-calendar"></i>
                        ${this.formatDate(dueDate)}
                        ${task.dueTime ? ` at ${task.dueTime}` : ""}
                        ${task.reminder ? '<i class="fas fa-bell" title="Reminder set"></i>' : ""}
                    </div>
                    <div class="priority-badge ${task.priority}">
                        <i class="fas fa-flag"></i>
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </div>
                </div>
            </div>
        `
  }

  editTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId)
    if (task) {
      this.editingTask = task
      this.openTaskModal(task)
    }
  }

  // Modal Management
  openTaskModal(task = null) {
    const modal = document.getElementById("taskModal")
    const form = document.getElementById("taskForm")
    const title = document.getElementById("modalTitle")

    if (task) {
      title.textContent = "Edit Task"
      document.getElementById("taskTitle").value = task.title
      document.getElementById("taskSubject").value = task.subject
      document.getElementById("taskDescription").value = task.description || ""
      document.getElementById("taskDueDate").value = task.dueDate
      document.getElementById("taskDueTime").value = task.dueTime || ""
      document.getElementById("taskPriority").value = task.priority
      document.getElementById("taskReminder").checked = task.reminder || false
    } else {
      title.textContent = "Add New Task"
      form.reset()
      // Set default due date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      document.getElementById("taskDueDate").value = tomorrow.toISOString().split("T")[0]
    }

    modal.classList.remove("hidden")
  }

  closeTaskModal() {
    document.getElementById("taskModal").classList.add("hidden")
    document.getElementById("taskForm").reset()
    this.editingTask = null
  }

  openSubjectModal() {
    document.getElementById("subjectModal").classList.remove("hidden")
  }

  closeSubjectModal() {
    document.getElementById("subjectModal").classList.add("hidden")
    document.getElementById("subjectForm").reset()
  }

  // Form Handlers
  handleTaskSubmit(e) {
    e.preventDefault()

    const taskData = {
      title: document.getElementById("taskTitle").value,
      subject: document.getElementById("taskSubject").value,
      description: document.getElementById("taskDescription").value,
      dueDate: document.getElementById("taskDueDate").value,
      dueTime: document.getElementById("taskDueTime").value,
      priority: document.getElementById("taskPriority").value,
      reminder: document.getElementById("taskReminder").checked,
    }

    if (this.editingTask) {
      this.updateTask(this.editingTask.id, taskData)
    } else {
      this.addTask(taskData)
    }

    this.closeTaskModal()
  }

  handleSubjectSubmit(e) {
    e.preventDefault()

    const name = document.getElementById("subjectName").value
    const color = document.getElementById("subjectColor").value

    this.addSubject(name, color)
    this.closeSubjectModal()
  }

  // Statistics
  updateStats() {
    const tasks = this.getFilteredTasks()
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const pending = total - completed

    document.getElementById("totalTasks").textContent = total
    document.getElementById("completedTasks").textContent = completed
    document.getElementById("pendingTasks").textContent = pending
  }

  // View Management
  toggleView() {
    const tasksView = document.getElementById("tasksView")
    const calendarView = document.getElementById("calendarView")
    const toggleBtn = document.getElementById("viewToggle")

    if (this.currentView === "tasks") {
      this.currentView = "calendar"
      tasksView.classList.add("hidden")
      calendarView.classList.remove("hidden")
      toggleBtn.innerHTML = '<i class="fas fa-list"></i> List View'
      this.renderCalendar()
    } else {
      this.currentView = "tasks"
      tasksView.classList.remove("hidden")
      calendarView.classList.add("hidden")
      toggleBtn.innerHTML = '<i class="fas fa-calendar"></i> Calendar View'
    }
  }

  // Calendar
  renderCalendar() {
    const grid = document.getElementById("calendarGrid")
    const monthTitle = document.getElementById("currentMonth")

    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()

    monthTitle.textContent = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(this.currentDate)

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    // Generate calendar days
    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }

    // Render calendar
    grid.innerHTML = `
            <div class="calendar-day-header">Sun</div>
            <div class="calendar-day-header">Mon</div>
            <div class="calendar-day-header">Tue</div>
            <div class="calendar-day-header">Wed</div>
            <div class="calendar-day-header">Thu</div>
            <div class="calendar-day-header">Fri</div>
            <div class="calendar-day-header">Sat</div>
            ${days.map((date) => this.renderCalendarDay(date, month)).join("")}
        `
  }

  renderCalendarDay(date, currentMonth) {
    const isCurrentMonth = date.getMonth() === currentMonth
    const isToday = date.toDateString() === new Date().toDateString()
    const dateStr = date.toISOString().split("T")[0]

    const dayTasks = this.tasks.filter((task) => task.dueDate === dateStr)

    return `
            <div class="calendar-day ${!isCurrentMonth ? "other-month" : ""} ${isToday ? "today" : ""}">
                <div class="calendar-day-number">${date.getDate()}</div>
                ${dayTasks
                  .map((task) => {
                    const subject = this.subjects.find((s) => s.id === task.subject)
                    return `<div class="calendar-task" style="background: ${subject?.color || "#6b7280"}">${task.title}</div>`
                  })
                  .join("")}
            </div>
        `
  }

  navigateMonth(direction) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction)
    this.renderCalendar()
  }

  // Reminders
  checkReminders() {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    this.tasks.forEach((task) => {
      if (task.reminder && !task.completed) {
        const dueDate = new Date(task.dueDate)
        const timeDiff = dueDate - now
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

        // Show reminder 1 day before due date
        if (daysDiff === 1) {
          this.showNotification(task)
        }
      }
    })
  }

  showNotification(task) {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        const subject = this.subjects.find((s) => s.id === task.subject)
        new Notification(`Exam Task Reminder`, {
          body: `${task.title} (${subject?.name || "No subject"}) is due tomorrow!`,
          icon: "/favicon.ico",
        })
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            this.showNotification(task)
          }
        })
      }
    }
  }

  // Utility
  formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }
}

// Initialize the app
const taskManager = new ExamTaskManager()

// Request notification permission on load
if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission()
}

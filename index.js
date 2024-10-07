const services = [
    { name: "Wash Car", price: 10 },
    { name: "Mow Lawn", price: 20 },
    { name: "Pull Weeds", price: 30 }
];

const serviceButtonsContainer = document.querySelector(".service-button-container");
const notesEl = document.getElementById("payment-note");
const invoiceMessageEl = document.getElementById("invoice-message");
let selectedTasks = [];



services.forEach(service => {
    serviceButtonsContainer.innerHTML += `
        <button class="service-btn" data-name="${service.name}" data-price="${service.price}" onClick="addTask(event)">
            ${service.name}: $${service.price}
        </button>
    `;
});


function addTask(event) {
    const taskName = event.target.dataset.name;
    const taskPrice = parseInt(event.target.dataset.price);

    // Find if the task is already in the list
    const existingTask = selectedTasks.find(task => task.name === taskName);

    if (existingTask) {
        // If task exists, increase its quantity
        existingTask.quantity++;
    } else {
        // Otherwise, add new task with quantity of 1
        selectedTasks.push({ name: taskName, price: taskPrice, quantity: 1 });
    }
    
    
    updateTaskList();
    updateTotalAmount();
    notesMessage();
}

function updateTaskList() {
    const taskList = document.querySelector("#task-list");
    taskList.innerHTML = "";

    selectedTasks.forEach(task => {
        taskList.innerHTML += `
            <li>
                <div class="task-name">
                    ${task.name} (x${task.quantity})
                    <span class="remove-link" onClick="removeTask('${task.name}')">Remove</span>
                </div>
                <div class="task-price"> <span class="dollar-sign">$</span>${task.price * task.quantity}</div>
            </li>
        `;
    });
}

function notesMessage(){
    notesEl.textContent = (selectedTasks.length > 0) ? "We accept cash, credit card, or PayPal" : "" 
}

function updateTotalAmount() {
    const totalAmount = selectedTasks.reduce((sum, task) => sum + (task.price * task.quantity), 0);
    document.querySelector("#total-amount").textContent = `$${totalAmount}`;
}

function removeTask(taskName) {
    const taskIndex = selectedTasks.findIndex(task => task.name === taskName);

    if (taskIndex !== -1) {
        const task = selectedTasks[taskIndex];

        // Decrease quantity, remove task if quantity reaches zero
        if (task.quantity > 1) {
            task.quantity--;
        } else {
            selectedTasks.splice(taskIndex, 1); // Remove task completely
        }

        updateTaskList();
        updateTotalAmount();
        notesMessage();
    }
}

// Handle invoice submission
const submitButton = document.querySelector(".btn-submit");
submitButton.addEventListener("click", () => {
    // Check if there are any tasks selected
    if (selectedTasks.length === 0) {
        // If no tasks selected, alert the user and don't proceed
        alert("Please select at least one task before sending the invoice.");
        return; 
    }

    // Reset selectedTasks array
    selectedTasks = [];
    updateTaskList();    
    updateTotalAmount(); 
    notesMessage();      

    // Show "Invoice Sent" message
    invoiceMessageEl.textContent = "Invoice Sent";
    invoiceMessageEl.style.display = "block";

    // Optionally, hide the message after 3 seconds
    setTimeout(() => {
        invoiceMessageEl.style.display = "none";
    }, 3000); 
});
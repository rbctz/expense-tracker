// Selectors for inputs and buttons
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseDateInput = document.getElementById('expense-date');
const addExpenseButton = document.getElementById('add-expense');
const expenseList = document.getElementById('expense-list');
const totalAmountSpan = document.getElementById('total-amount');
const categoryFilter = document.getElementById('category-filter');
const monthFilter = document.getElementById('month-filter');
const resetFilterButton = document.getElementById('reset-filter');

// State for expenses
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Function to render expenses based on category and month filter
function renderExpenses(filteredCategory = 'all', filteredMonth = 'all') {
    expenseList.innerHTML = ''; // Clear existing list

    const filteredExpenses = expenses.filter(expense => {
        const isCategoryMatch = filteredCategory === 'all' || expense.category === filteredCategory;
        const isMonthMatch = filteredMonth === 'all' || expense.date.slice(5, 7) === filteredMonth;
        return isCategoryMatch && isMonthMatch;
    });

    filteredExpenses.forEach((expense, index) => {
        const li = document.createElement('li');
        const categoryClass = expense.category.toLowerCase().replace(" ", "-");

        // Format the date to dd/mm/yyyy
        const formattedDate = formatDate(expense.date);

        li.innerHTML = `
            <div class="expense-info">
                <span class="expense-name">${expense.name}</span>
                <span class="category ${categoryClass}">${expense.category}</span>
                <span class="amount">${expense.amount.toFixed(2)} RON</span>
                <span class="date">${formattedDate}</span>
            </div>
            <button onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(li);
    });

    updateTotal();
}

// Function to format date to dd/mm/yyyy
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Function to update the total amount
function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmountSpan.textContent = total.toFixed(2);
}

// Function to add a new expense (with date)
function addExpense() {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategoryInput.value;
    const date = expenseDateInput.value;

    if (name && !isNaN(amount) && amount > 0 && date) {
        const newExpense = { name, amount, category, date };
        expenses.push(newExpense);
        localStorage.setItem('expenses', JSON.stringify(expenses)); // Save to localStorage
        expenseNameInput.value = ''; // Clear input fields
        expenseAmountInput.value = '';
        expenseDateInput.value = ''; // Clear date input
        renderExpenses(); // Re-render expenses
    } else {
        alert('Please enter valid expense details.');
    }
}

// Function to delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses)); // Save to localStorage
    renderExpenses(); // Re-render expenses
}

// Event listener for category filter change
categoryFilter.addEventListener('change', function() {
    const selectedCategory = categoryFilter.value;
    const selectedMonth = monthFilter.value;
    renderExpenses(selectedCategory, selectedMonth); // Render based on selected category and month
});

// Event listener for month filter change
monthFilter.addEventListener('change', function() {
    const selectedMonth = monthFilter.value;
    const selectedCategory = categoryFilter.value;
    renderExpenses(selectedCategory, selectedMonth); // Render based on selected category and month
});

// Event listener for reset filter button
resetFilterButton.addEventListener('click', function() {
    categoryFilter.value = 'all'; // Reset the category filter
    monthFilter.value = 'all'; // Reset the month filter
    renderExpenses('all', 'all'); // Render all expenses
});

// Event listener for adding expense
addExpenseButton.addEventListener('click', addExpense);

// Initialize the expense list on page load
renderExpenses('all', 'all');

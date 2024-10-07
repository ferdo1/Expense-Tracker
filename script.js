const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const currencySelector = document.getElementById('currency');

// Get transactions from localStorage or set to an empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currencySymbol = '$';

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a description and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        text: text.value,
        amount: +amount.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage(); // Save to localStorage
    text.value = '';
    amount.value = '';
}

// Generate random ID for transaction
function generateID() {
    return Math.floor(Math.random() * 1000000);
}

// Add transactions to the DOM with numbering
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    const transactionNumber = transactions.indexOf(transaction) + 1; // Get transaction number

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transactionNumber}. ${transaction.text} 
        <span>${sign}${currencySymbol}${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Update the balance, income, and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const incomeTotal = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expenseTotal = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
        -1
    ).toFixed(2);

    balance.innerText = `${currencySymbol}${total}`;
    income.innerText = `${currencySymbol}${incomeTotal}`;
    expense.innerText = `${currencySymbol}${expenseTotal}`;
}

// Remove transaction
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage(); // Update localStorage
    init();
}

// Initialize the app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Update localStorage with current transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


currencySelector.addEventListener('change', function() {
    const selectedCurrency = currencySelector.value;
    switch (selectedCurrency) {
        case 'USD':
            currencySymbol = '$';
            break;
        case 'CAD':
            currencySymbol = '$';
            break;    
        case 'EUR':
            currencySymbol = '€';
            break;
        case 'GBP':
            currencySymbol = '£';
            break;
        default:
            currencySymbol = '$';
    }
    updateValues();  // Update displayed values after currency change
    init();          // Re-render transaction history with new currency
});

// Event listener for form submit
form.addEventListener('submit', addTransaction);

// Initialize the app
init();

import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

createApp({
    data() {
        return {
            newExpense: {
                name: '',
                date: new Date().toISOString().split('T')[0], // Dnešný dátum
                amount: ''
            },
            
            expenses: [],

            editingId: null,

            errorMessage: ''
        }
    },

    computed: {
        totalExpenses() {
            return this.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        },

        groupedExpenses() {
            const grouped = {};

            this.expenses.forEach(expense => {
                const monthKey = expense.date.substring(0, 7); 

                if (!grouped[monthKey]) {
                    grouped[monthKey] = {
                        expenses: [],
                        total: 0
                    };
                }

                grouped[monthKey].expenses.push(expense);
                grouped[monthKey].total += parseFloat(expense.amount);
            });

            return Object.keys(grouped)
                .sort()
                .reverse()
                .reduce((obj, key) => {
                    obj[key] = grouped[key];
                    return obj;
                }, {});
        }
    },

    methods: {
        addExpense() {
            //validacia
            if (this.newExpense.name.trim() === '') {
                this.showError('Názov výdavku nesmie byť prázdny!');
                return;
            }

            if (!this.newExpense.date) {
                this.showError('Prosím vyber dátum!');
                return;
            }

            const amount = parseFloat(this.newExpense.amount);
            if (isNaN(amount) || amount <= 0) {
                this.showError('Suma musí byť väčšia ako 0!');
                return;
            }

            const expense = {
                id: Date.now(), // ID
                name: this.newExpense.name.trim(),
                date: this.newExpense.date,
                amount: amount
            };

            // Add do array
            this.expenses.push(expense);

            // Clear inputy
            this.newExpense = {
                name: '',
                date: new Date().toISOString().split('T')[0],
                amount: ''
            };

            this.saveToLocalStorage();
            this.errorMessage = '';
        },

        startEdit(id) {
            this.editingId = id;
        },

        saveEdit(expense) {
            // Validácia názvu
            if (expense.name.trim() === '') {
                alert('Názov nesmie byť prázdny!');
                return;
            }

            // Validácia sumy
            const amount = parseFloat(expense.amount);
            if (isNaN(amount) || amount <= 0) {
                alert('Suma musí byť väčšia ako 0!');
                return;
            }

            // Uprav sumu na číslo
            expense.amount = amount;
            this.editingId = null;
            this.saveToLocalStorage();
        },

        cancelEdit() {
            this.loadFromLocalStorage(); // Načítaj znova pôvodné data
            this.editingId = null;
        },

        // Zmaž výdavok
        deleteExpense(id) {
            // Potvrdenie
            if (confirm('Naozaj chceš zmazať tento výdavok?')) {
                this.expenses = this.expenses.filter(exp => exp.id !== id);
                this.saveToLocalStorage();
            }
        },

        showError(message) {
            this.errorMessage = message;
            setTimeout(() => {
                this.errorMessage = '';
            }, 3000);
        },

        // Formátuj názov mesiaca (z "2025-10" na "Október 2025")
        formatMonthName(monthKey) {
            const months = [
                'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
                'Júl', 'August', 'September', 'Október', 'November', 'December'
            ];

            const [year, month] = monthKey.split('-');
            const monthIndex = parseInt(month) - 1;

            return months[monthIndex] + ' ' + year;
        },

        // Formátuj dátum (z "2025-10-28" na "28.10.2025")
        formatDate(dateString) {
            const [year, month, day] = dateString.split('-');
            return `${day}.${month}.${year}`;
        },

        saveToLocalStorage() {
            localStorage.setItem('expenseTrackerData', JSON.stringify(this.expenses));
        },

        loadFromLocalStorage() {
            const savedData = localStorage.getItem('expenseTrackerData');
            if (savedData) {
                this.expenses = JSON.parse(savedData);
            }
        }
    },

    mounted() {
        this.loadFromLocalStorage();
    }

}).mount('#app')


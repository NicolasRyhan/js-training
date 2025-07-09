// Pega os elementos do HTML que serão usados
const transactionsUl = document.querySelector('#transactions') // UL onde as transações serão listadas
const incomeDisplay = document.querySelector('#money-plus') // Span que exibe o total de entradas
const expenseDisplay = document.querySelector('#money-minus') // Span que exibe o total de saídas
const balanceDisplay = document.querySelector('#balance') // Span que exibe o saldo total
const form = document.querySelector('#form') // Formulário principal
const inputTransactionName = document.querySelector('#text') // Input do nome da transação
const inputTransactionAmount = document.querySelector('#amount') // Input do valor da transação

// Recupera as transações salvas no localStorage (se houver)
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))

// Se existir transações no localStorage, carrega elas, senão cria array vazio
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : []

// Função que remove uma transação pelo ID
const removeTransaction = ID => {
    // Filtra todas as transações, removendo a com o ID igual ao clicado
    transactions = transactions.filter(transaction => transaction.id !== ID)
    updateLocalStorage() // Atualiza os dados no localStorage
    init() // Recarrega a tela
}

// Função que adiciona uma transação no DOM (na lista UL)
const addTransactionIntoDOM = ({ amount, name, id }) => {
    const operator = amount < 0 ? '-' : '+' // Determina o sinal
    const CSSClass = amount < 0 ? 'minus' : 'plus' // Define a classe CSS para estilo
    const amountWithoutOperator = Math.abs(amount) // Valor absoluto do valor

    const li = document.createElement('li') // Cria um item da lista (li)
    li.classList.add(CSSClass) // Adiciona a classe (minus ou plus)

    // Define o HTML interno do item, incluindo nome, valor e botão de exclusão
    li.innerHTML = `
        ${name}
         <span>${operator} R$ ${amountWithoutOperator}</span>
         <button class="delete-btn" onClick="removeTransaction(${id})">
         x
         </button>
    `

    transactionsUl.append(li) // Adiciona o item à lista UL
}

// Função que calcula o total de despesas
const getExpenses = transactionAmounts => 
    Math.abs(
        transactionAmounts
            .filter(value => value < 0) // Filtra os valores negativos
            .reduce((accumulator, value) => accumulator + value, 0) // Soma eles
    ).toFixed(2) // Retorna com 2 casas decimais

// Função que calcula o total de entradas
const getIncome = transactionAmounts =>
    transactionAmounts
        .filter(value => value > 0) // Filtra os valores positivos
        .reduce((accumulator, value) => accumulator + value, 0) // Soma eles
        .toFixed(2)

// Função que calcula o saldo total
const getTotal = transactionAmounts =>
    transactionAmounts
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)

// Atualiza os valores de saldo, entradas e saídas na tela
const updateBalanceValues = () => {
    const transactionAmounts = transactions.map(({ amount }) => amount) // Pega todos os valores num array
    const total = getTotal(transactionAmounts) // Calcula o saldo
    const income = getIncome(transactionAmounts) // Calcula entradas
    const expense = getExpenses(transactionAmounts) // Calcula saídas

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

// Inicializa a aplicação
const init = () => {
    transactionsUl.innerHTML = '' // Limpa a lista de transações no DOM
    transactions.forEach(addTransactionIntoDOM) // Adiciona cada transação no DOM
    updateBalanceValues() // Atualiza os valores de saldo, entrada e saída
}

init() // Executa a inicialização ao carregar a página

// Atualiza os dados no localStorage
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

// Gera um ID aleatório para cada nova transação
const generateId = () => Math.round(Math.random() * 1000)

// Adiciona uma nova transação ao array de transações
const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateId(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

// Limpa os campos do formulário
const cleanInputs = event => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

// Função executada quando o formulário é enviado
const handleFormSubmit = event => {
    event.preventDefault() // Impede o comportamento padrão do formulário

    const transactionName = inputTransactionName.value.trim() // Pega o nome e remove espaços
    const transactionAmount = inputTransactionAmount.value.trim() // Pega o valor e remove espaços

    const isSomeInputEmpty = transactionName === '' || transactionAmount === '' // Verifica se algum campo está vazio

    if (isSomeInputEmpty) {
        alert('Por favor preencha o nome e o valor da transação')
        return // Encerra a função se os campos estiverem vazios
    }

    addToTransactionsArray(transactionName, transactionAmount) // Adiciona nova transação ao array
    init() // Recarrega o DOM e valores
    updateLocalStorage() // Salva os dados no localStorage
    cleanInputs() // Limpa os campos do formulário
}

// Adiciona um ouvinte para o envio do formulário
form.addEventListener('submit', handleFormSubmit)

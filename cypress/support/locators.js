const locators = {
    LOGIN: {
        EMAIL: '[data-test="email"]',
        PASSWORD: '[data-test="passwd"]',
        BTN_LOGIN: '.btn'
    },
    CONTAS: {
        A_CONFIG: 'a[href="#"]',
        A_CONTAS: 'a[href="/contas"]',
        NOME: '[data-test="nome"]',
        BTN_SALVAR: '.btn',
        ALTERA_NOME: 'tbody > :nth-child(2) > :nth-child(2) > :nth-child(1) > .far',
        ERROR_MESSAGE: '.toast-message'
    },
    MOVIMENTACAO: {
        ACESSO_MOV: '[data-test=menu-movimentacao]',
        DESPESA: '[alt=Despesa]',
        DATA_PAG: '[data-test=data-pagamento]',
        DESC: '[data-test=descricao]',
        VALOR: '[data-test=valor]',
        ENVOLVIDO: '[data-test=envolvido]',
        CONTA: '[data-test=conta]',
        STATUS: '[data-test=status]',
        SALVAR: '[alt=Salvar]',
        VALIDA_MOV: '.list-group > :nth-child(2) div div div span',
        ACESSO_EXTRATO: 'a[href="/extrato"]',
        REMOVE_MOV: '.list-group > :nth-child(2) > :nth-child(1) > :nth-child(2) > :nth-child(2)'
    },
    CALCULO: {
        LINHA1: 'tbody > :nth-child(1) > :nth-child(2)',
        LINHA2: 'tbody > :nth-child(2) > :nth-child(2)',
        RESULT: 'tbody > :nth-child(3) > :nth-child(2)'
    }
}

export default locators;
///<reference types="cypress"/>

import locators from "../../support/locators"

describe('Testando o app Seu Barriga', () => {
    it('Criando conta', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            //Realizando login
            cy.login(this.teste.login.email, this.teste.login.senha)
            //Acessando página de contas
            cy.contas()
            //Criando conta
            cy.get(locators.CONTAS.NOME).type(this.teste.conta.nome)
            cy.get(locators.CONTAS.BTN_SALVAR).click()
        })
    })

    it('Alterando conta', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            cy.login(this.teste.login.email, this.teste.login.senha)
            cy.contas()
            cy.get(locators.CONTAS.ALTERA_NOME).click()
            cy.get(locators.CONTAS.NOME)
                .clear()
                .type(this.teste.conta.nomeAlterar)
            cy.get(locators.CONTAS.BTN_SALVAR).click()
        })
    })

    it('Inserindo conta repetida', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            cy.login(this.teste.login.email, this.teste.login.senha)
            cy.contas()
            cy.get(locators.CONTAS.NOME).type(this.teste.conta.nomeAlterar)
            cy.get(locators.CONTAS.BTN_SALVAR).click()
            cy.get(locators.CONTAS.ERROR_MESSAGE).should('have.text', 'Erro: Error: Request failed with status code 400Bem vindo, Karen Stackoski!')
        })
    })

    it('Inserir movimentação', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            //Realizando login
            cy.login(this.teste.login.email, this.teste.login.senha)
            //Acessando página de movimentações
            cy.get(locators.MOVIMENTACAO.ACESSO_MOV).click()
            //Adicionando movimentação
            cy.get(locators.MOVIMENTACAO.DESPESA).click()
            cy.get(locators.MOVIMENTACAO.DATA_PAG).click()
            cy.get(locators.MOVIMENTACAO.DATA_PAG).type(this.teste.movimentacao.dataPagamento)
            cy.get(locators.MOVIMENTACAO.DESC).type(this.teste.movimentacao.descricao)
            cy.get(locators.MOVIMENTACAO.VALOR).type(this.teste.movimentacao.valor)
            cy.get(locators.MOVIMENTACAO.ENVOLVIDO).type(this.teste.movimentacao.interessado)
            cy.get(locators.MOVIMENTACAO.CONTA).select(this.teste.movimentacao.conta)
            cy.get(locators.MOVIMENTACAO.STATUS).click()
            cy.get(locators.MOVIMENTACAO.SALVAR).click()
            //Validadndo se nova movimentação existe
            cy.get(locators.MOVIMENTACAO.VALIDA_MOV).should('have.text', this.teste.movimentacao.descricao)
        })
    })

    it('Calculo conta', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            //Realizando login
            cy.login(this.teste.login.email, this.teste.login.senha)
            //Verificando valores de contas
            cy.get(locators.CALCULO.LINHA1).should('contain', '2.500,00')
            cy.get(locators.CALCULO.LINHA2).should('contain', '150,00')
            //Verificando resultado
            cy.get(locators.CALCULO.RESULT).should('contain', '2.350,00')
        })
    })

    it.only('Removendo movimentação', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            //Realizando login
            cy.login(this.teste.login.email, this.teste.login.senha)
            //Acessando movimentações
            cy.get(locators.MOVIMENTACAO.ACESSO_EXTRATO).click()
            //Removendo movimentação
            cy.get(locators.MOVIMENTACAO.REMOVE_MOV).click()
            //Verificando
            cy.get(locators.MOVIMENTACAO.REMOVE_MOV).should('not.exist')
        })
    })
})
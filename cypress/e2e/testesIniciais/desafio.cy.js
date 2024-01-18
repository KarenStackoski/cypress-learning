///<reference types="cypress"/>

describe('Desafio wcaquino', () => {
    it('Cadastrar', () => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')

        const dados = {
            nome: "Karen",
            sobrenome: "Stackoski",
        }

        const stub = cy.stub().as('alerta')
        cy.on('window:alert', stub)

        cy.get('#formCadastrar').click()
            .then(() => expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio')) 
            
        cy.get('#formNome').type(dados.nome)
        cy.get('#formCadastrar').click()
            .then(() => expect(stub.getCall(1)).to.be.calledWith('Sobrenome eh obrigatorio'))

        cy.get('#formSobrenome').type(dados.sobrenome)
        cy.get('#formCadastrar').click()
            .then(() => expect(stub.getCall(2)).to.be.calledWith('Sexo eh obrigatorio'))

        cy.get('#formSexoFem').click()
        cy.get('#formCadastrar').click()
        cy.get('#resultado > :nth-child(1)').should('have.text', 'Cadastrado!')
    })
})
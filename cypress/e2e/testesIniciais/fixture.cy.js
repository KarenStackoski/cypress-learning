///<reference types="cypress"/>

describe('Implementando dados externos no teste', () => {
    it('Cadastro de novo usuario', function() {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')

        cy.fixture('userData').as('usuario').then(() => {
            cy.get('#formNome').type(this.usuario.nome)
            cy.get('#formSobrenome').type(this.usuario.sobrenome)
            cy.get(`#formSexo [value=${this.usuario.sexo}]`).click()
            cy.get(`#formComidaFavorita [value=${this.usuario.comida}]`).click()
            cy.get('#formEscolaridade').select(this.usuario.escolaridade)
            cy.get('#formEsportes').select(this.usuario.esportes)
            cy.get('#formCadastrar').click()
            cy.get('#resultado > :nth-child(1)').should('have.text', 'Cadastrado!')
        })
    })
})
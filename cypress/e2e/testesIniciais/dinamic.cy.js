///<reference types="cypress"/>

describe('Implementando teste dinamico', () => {
    beforeEach(() => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
    })

    const foods = ['Carne', 'Frango', 'Pizza', 'Vegetariano']
    
    
    foods.forEach(food => {
        it('Cadastro de novo usuario', function() {
            cy.get('#formNome').type('Usuario')
            cy.get('#formSobrenome').type('Teste')
            cy.get(`#formSexo [value=F]`).click()
            cy.xpath(`//label[contains(., '${food}')]/preceding-sibling::input`).click()
            cy.get('#formEscolaridade').select('Mestrado')
            cy.get('#formEsportes').select('Corrida')
            cy.get('#formCadastrar').click()
            cy.get('#resultado > :nth-child(1)').should('have.text', 'Cadastrado!')
        })
    })
})
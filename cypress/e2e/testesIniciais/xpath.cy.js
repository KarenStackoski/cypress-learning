///<reference types="cypress"/>

describe('Trabalhando com x-path', () => {
    it('caminho', () => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
        cy.xpath('//input[contains(@onclick, "Francisco")]')
    })
})
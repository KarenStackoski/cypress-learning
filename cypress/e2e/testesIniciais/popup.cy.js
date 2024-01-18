///<reference types="cypress"/>

describe('Pop-ups', () => {
    it('Pop deve ser invocado', () => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
        cy.window().then(win => {
            cy.stub(win, 'open').as('winOpen')
        })
        cy.get('#buttonPopUp').click()
        cy.get('@winOpen').should('be.called')
    })
})
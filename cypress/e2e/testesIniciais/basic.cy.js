///<reference types="cypress"/>

describe('Cypress basics', () => {
    it.only('Should visit page and assert title', () => {
        cy.visit('https://karenstackoski.github.io/theCompleteMustangGuide/index/index.html')
        
        cy.title()
            .should('be.equal', 'The Complete Mustang Guide').pause()
            .and('contain', 'Mustang').debug() //uses the should assert too

        let syncTitle

        cy.title().then(title => {
            cy.get('input[name="model"]').type(title)
            syncTitle = title
        })

        cy.get('input[name="type"]').then($el => {
            cy.wrap($el).type(syncTitle)
        })
    })

    it('Should interact with an element', () => {
        cy.visit('https://karenstackoski.github.io/theCompleteMustangGuide/index/index.html')

        const search = 'a[href="#search"]'
        cy.get(search)
            .click()
            .should('have.text', 'Search')
    })
})
///<reference types="cypress"/>

describe('Working with some elements', () => {
    beforeEach(() => {
        cy.reload()
        cy.visit('https://karenstackoski.github.io/theCompleteMustangGuide/index/index.html')
    })

    it('TextField', () => {
        cy.get('input[name="model"]')
            .type('Mach1')
            .should('have.value', 'Mach1')
        cy.get('input[name="year"]')
            .clear()
            .type('2021{selectall}2004', { delay: 100 })
            .should('have.value', '2004')
    })

    it('Radio', () => {
        cy.get('form #v8')
            .click()
            .should('be.checked')

        cy.get('form #ecoBoost')
            .should('not.be.checked')

        cy.get('input[name="engine"]')
            .should('have.length', 3)
    })

    it('Checkbox', () => {
        cy.get('#liter5')
            .click()
            .should('be.checked')
        
        cy.get('#liter6')
            .click()
            .should('be.checked')
    })

    it('Combobox', () => {
        cy.get('select[name="gen"]')
            .select('6th')
            .should('have.value', '6th')

        cy.get('select[name="gen"] option')
            .should('have.length', 6)

        cy.get('select[name="gen"] option').then($arr => {
            const values = []

            $arr.each(function(){
                values.push(this.innerHTML)
            })

            expect(values).to.include.members(["1st", "6th"])
        })
    })
})
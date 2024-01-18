///<reference types="cypress"/>

describe('Testando o app Seu Barriga', () => {
    let token;

    before(() => {
        cy.getToken('karen@deps', 'deps')
            .then(tkn => {
                token = tkn
            })
    })

    beforeEach(() => {
        cy.resetRest()
    })

    it('Criando conta', function() {
        
        cy.request({
            method: 'POST',
            url: '/contas',
            headers: { Authorization: `JWT ${token}` },
            body: {
                nome: 'Conta via rest'
            }
        }).as('response')
                    

        cy.get('@response').then(res => {
            expect(res.status).eq(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via rest')
        })
    })

    it('Alterando conta', function() {
        cy.request({
            method: 'GET',
            url: '/contas',
            headers: { Authorization: `JWT ${token}` },
            qs: {
                nome: 'Conta para alterar'
            }
        }).then(res => {
            cy.request({
                url: `/contas/${res.body[0].id}`,
                method: 'PUT',
                headers: { Authorization: `JWT ${token}` },
                body: {
                    nome: 'Conta alterada via rest'
                }
            }).as('response')
        })

        cy.get('@response').its('status').should('be.equal', 200)
    })

    it('Inserindo conta repetida', function() {
        cy.request({
            method: 'POST',
            url: '/contas',
            headers: { Authorization: `JWT ${token}` },
            body: {
                nome: 'Conta para alterar'
            },
            failOnStatusCode: false
        }).as('response')

        cy.get('@response').then(res => {
            console.log(res)
            expect(res.status).eq(400)
            expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!')
        })
    })

    it('Inserir movimentação', function() {
        cy.request({
            method: 'POST',
            url: '/movimentacao',
            headers: { Authorization: `JWT ${token}` },
            body: {
                
            }
        })
    })

    it('Calculo conta', function() {

    })

    it('Removendo movimentação', function() {

    })
})
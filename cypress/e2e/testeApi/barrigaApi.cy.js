///<reference types="cypress"/>

import dayjs from "dayjs";

describe('Testando o app Seu Barriga', () => {
    //let token;

    before(() => {
        cy.getToken('karen@deps', 'deps')
            // .then(tkn => {
            //     token = tkn
            // })
    })

    beforeEach(() => {
        cy.resetRest()
    })

    it('Criando conta', function() {
        
        cy.request({
            method: 'POST',
            url: '/contas',
            //headers: { Authorization: `JWT ${token}` },
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
        cy.getAccountByName('Conta para alterar')
        .then(contaId => {
            cy.request({
                url: `/contas/${contaId}`,
                method: 'PUT',
                //headers: { Authorization: `JWT ${token}` },
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
            //headers: { Authorization: `JWT ${token}` },
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
        cy.getAccountByName('Conta para alterar')
        .then(contaId => {
            cy.request({
                method: 'POST',
                url: '/transacoes',
                //headers: { Authorization: `JWT ${token}` },
                body: {
                    conta_id: contaId,
                    data_pagamento: dayjs().add(1, "days").format('DD/MM/YYYY'),
                    data_transacao: dayjs().format('DD/MM/YYYY'),
                    descricao: 'desc',
                    envolvido: 'inter',
                    status: true,
                    tipo: 'REC',
                    valor: '123'
                }
            }).as('response')
        })

        cy.get('@response').its('status').should('be.equal', 201)
        cy.get('@response').its('body.id').should('exist')
    })

    it('Calculo conta', function() {
        //Verificando o valor antes de modificar
        cy.request({
            url: '/saldo',
            method: 'GET',
            //headers: { Authorization: `JWT ${token}` }
        }).then(res => {
            let saldoConta = null
            res.body.forEach(c => {
                if(c.conta === 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).eq('534.00')
        })

        //Realizando movimentação
        cy.request({
            url: '/transacoes',
            method: 'GET',
            //headers: { Authorization: `JWT ${token}` },
            qs: {
                descricao: 'Movimentacao 1, calculo saldo'
              }
        }).then(res => {
            cy.request({
                url: `transacoes/${res.body[0].id}`,
                method: 'PUT',
                //headers: { Authorization: `JWT ${token}` },
                body: {
                    status: true,
                    data_transacao: dayjs(res.body[0].data_transacao).format('DD/MM/YYYY'),
                    data_pagamento: dayjs(res.body[0].data_pagamento).format('DD/MM/YYYY'),
                    descricao: res.body[0].descricao,
                    envolvido: res.body[0].envolvido,
                    valor: res.body[0].valor,
                    conta_id: res.body[0].conta_id
                }
            }).its('status').should('be.equal', 200)
        })

        //Verificando se a mudança ocorreu
        cy.request({
            url: '/saldo',
            method: 'GET',
            //headers: { Authorization: `JWT ${token}` }
        }).then(res => {
            let saldoConta = null
            res.body.forEach(c => {
                if(c.conta === 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).eq('4034.00')
        })
    })

    it('Removendo movimentação', function() {
        cy.request({
            url: '/transacoes',
            method: 'GET',
            //headers: { Authorization: `JWT ${token}` },
            qs: {
                descricao: 'Movimentacao 1, calculo saldo'
              }
        }).then(res => {
            cy.request({
                url: `/transacoes/${res.body[0].id}`,
                method: 'DELETE',
                //headers: { Authorization: `JWT ${token}` }
            }).its('status').should('be.equal', 204)
        })
    })
})
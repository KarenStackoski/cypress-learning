///<reference types="cypress"/>

import locators from "../../support/locators"
import buildEnv from "../../support/buildEnv"
import { log } from "async"

describe('Testando o app Seu Barriga', () => {
    after(() => {
        cy.clearLocalStorage()
    })
    

    it('Criando conta', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            //Realizando login
            buildEnv()
            cy.login('karen@deps', 'senha')

            cy.intercept("POST", "/contas",{
                body: {id: 3, nome: 'Conta teste', visivel: true, usuario_id: 1}
            })

            cy.contas()

            cy.intercept("GET", "/contas", {
                body: [
                    {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                    {id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
                    {id: 3, nome: 'Conta teste', visivel: true, usuario_id: 1}
                ]
              }).as('contasAdicionadas')

            //Criando conta
            cy.get(locators.CONTAS.NOME).type(this.teste.conta.nome)
            cy.get(locators.CONTAS.BTN_SALVAR).click()
        })
    })

    it('Alterando conta', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            buildEnv()
            cy.login(this.teste.login.email, this.teste.login.senha)
            
            cy.intercept("PUT", "/contas/**", {
                body: {id: 1, nome: 'Conta alterada', visivel: true, usuario_id: 1}
            })

            cy.contas()
            cy.xpath(locators.CONTAS.FN_XP_BTN_ALTERAR("Carteira")).click();
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
            buildEnv()
            cy.login(this.teste.login.email, this.teste.login.senha)

            cy.intercept("POST", "/contas",{
                body: { error: "Já existe uma conta com esse nome!" },
                statusCode: 400,
            })

            cy.contas()
            cy.get(locators.CONTAS.NOME).type(this.teste.conta.nomeAlterar)
            cy.get(locators.CONTAS.BTN_SALVAR).click()
            cy.get(locators.CONTAS.ERROR_MESSAGE).should('have.text', 'Erro: Error: Request failed with status code 400Bem vindo, Fake user!')
        })
    })

    it('Inserir movimentação', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.intercept("POST", "/transacoes", {
            body: {
                "id": 1896506,
                "descricao": "assas",
                "envolvido": "aaaaa",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2024-01-23T03:00:00.000Z",
                "data_pagamento": "2024-01-23T03:00:00.000Z",
                "valor": "123.00",
                "status": false,
                "conta_id": 2021868,
                "usuario_id": 46638,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        })

        cy.fixture('testesFuncionais').as('teste').then(() => {
            //Realizando login
            buildEnv()
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
            cy.get(locators.MOVIMENTACAO.CONTA).select('Banco')
            cy.get(locators.MOVIMENTACAO.STATUS).click()
            cy.get(locators.MOVIMENTACAO.SALVAR).click()
            //Validadndo se nova movimentação existe
            //cy.get(locators.MOVIMENTACAO.VALIDA_MOV).should('have.text', this.teste.movimentacao.descricao)
        })
    })

    it('Calculo conta', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            //Realizando login
            buildEnv()
            cy.login(this.teste.login.email, this.teste.login.senha)
            //Verificando valores de contas
            cy.get(locators.CALCULO.LINHA1).should('contain', '100,00')
            cy.get(locators.CALCULO.LINHA2).should('contain', '1.000.000,00')
            //Verificando resultado
            cy.get(locators.CALCULO.RESULT).should('contain', '1.000.100,00')
        })
    })

    it('Removendo movimentação', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            //Realizando login
            buildEnv()
            cy.login(this.teste.login.email, this.teste.login.senha)
            //Acessando movimentações
            cy.get(locators.MOVIMENTACAO.ACESSO_EXTRATO).click()
            //Removendo movimentação
            cy.get(locators.MOVIMENTACAO.REMOVE_MOV).click()
            //Verificando
            cy.get(locators.MOVIMENTACAO.REMOVE_MOV).should('not.exist')
        })
    })

    it('Criando conta validada', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            //Realizando login
            buildEnv()
            cy.login('karen@deps', 'senha')
            const reqStub = cy.stub();
            cy.intercept("POST", "/contas",
                (req) => {
                    console.log(req.headers);
                    expect(req.body.nome).to.be.empty;
                    expect(req.headers).to.have.property("authorization");
                    
                    req.reply({
                        id: 3, 
                        nome: 'Conta teste', 
                        visivel: true, 
                        usuario_id: 1
                    })
                } 
            ).as('saveConta')

            cy.contas()

            cy.intercept("GET", "/contas", {
                body: [
                    {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
                    {id: 2, nome: 'Banco', visivel: true, usuario_id: 1},
                    {id: 3, nome: 'Conta teste', visivel: true, usuario_id: 1}
                ]
              }).as('contasAdicionadas')

            //Criando conta
            cy.get(locators.CONTAS.NOME).type('{CONTROL}')
            // cy.wait('@saveConta').then(res => {
            //     console.log(res)
            // })
            cy.get(locators.CONTAS.BTN_SALVAR).click()
        })
    })

    it('Testando cores', function() {
        cy.visit('https://barrigareact.wcaquino.me')

        cy.fixture('testesFuncionais').as('teste').then(() => {
            //Realizando login
            cy.intercept('GET','/extrato/**', {
                body: [
                  {
                    "conta": "Conta para movimentacoes",
                    "id": 1875487,
                    "descricao": "Receita paga",
                    "envolvido": "AAA",
                    "observacao": null,
                    "tipo": "REC",
                    "data_transacao": "2023-12-18T03:00:00.000Z",
                    "data_pagamento": "2023-12-18T03:00:00.000Z",
                    "valor": "-1500.00",
                    "status": true,
                    "conta_id": 2000641,
                    "usuario_id": 44851,
                    "transferencia_id": null,
                    "parcelamento_id": null
                  },
                  {
                    "conta": "Conta com movimentacao",
                    "id": 1875488,
                    "descricao": "Receita pendente",
                    "envolvido": "BBB",
                    "observacao": null,
                    "tipo": "REC",
                    "data_transacao": "2023-12-18T03:00:00.000Z",
                    "data_pagamento": "2023-12-18T03:00:00.000Z",
                    "valor": "-1500.00",
                    "status": false,
                    "conta_id": 2000642,
                    "usuario_id": 44851,
                    "transferencia_id": null,
                    "parcelamento_id": null
                  },
                  {
                    "conta": "Conta para saldo",
                    "id": 1875489,
                    "descricao": "Despesa paga",
                    "envolvido": "CCC",
                    "observacao": null,
                    "tipo": "DESP",
                    "data_transacao": "2023-12-18T03:00:00.000Z",
                    "data_pagamento": "2023-12-18T03:00:00.000Z",
                    "valor": "3500.00",
                    "status": true,
                    "conta_id": 2000643,
                    "usuario_id": 44851,
                    "transferencia_id": null,
                    "parcelamento_id": null
                  },
                  {
                    "conta": "Conta para saldo",
                    "id": 1875490,
                    "descricao": "Despesa pendente",
                    "envolvido": "DDD",
                    "observacao": null,
                    "tipo": "DESP",
                    "data_transacao": "2023-12-18T03:00:00.000Z",
                    "data_pagamento": "2023-12-18T03:00:00.000Z",
                    "valor": "-1000.00",
                    "status": false,
                    "conta_id": 2000643,
                    "usuario_id": 44851,
                    "transferencia_id": null,
                    "parcelamento_id": null
                  }
                ]
              })
            cy.login('karen@deps', 'deps')
            cy.get(locators.MOVIMENTACAO.ACESSO_EXTRATO).click()
            cy.xpath(locators.MOVIMENTACAO.FN_XP_LINHA('Receita paga')).should('have.class', 'receitaPaga')
            cy.xpath(locators.MOVIMENTACAO.FN_XP_LINHA('Receita pendente')).should('have.class', 'receitaPendente')
            cy.xpath(locators.MOVIMENTACAO.FN_XP_LINHA('Despesa paga')).should('have.class', 'despesaPaga')
            cy.xpath(locators.MOVIMENTACAO.FN_XP_LINHA('Despesa pendente')).should('have.class', 'despesaPendente')
        })
    })

    it.only('Responsividade', () => {
        cy.visit('https://barrigareact.wcaquino.me')
        cy.login('karen@deps', 'deps')
        cy.get('[data-test=menu-home]').should('exist').and('be.visible')
        cy.viewport(500, 700)
        cy.get('.navbar-toggler').should('exist')
        cy.get('[data-test=menu-home]').should('exist').and('be.not.visible')

    })
})
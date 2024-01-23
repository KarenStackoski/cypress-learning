const buildEnv = () => {
    cy.intercept("POST", "/signin", {
        body: {
          id: 1000,
          nome: "Fake user",
          token: "Uma string muito grande que nao deveria ser aceita, mas vai",
        },
    }).as("signin");

    cy.intercept("GET", "/saldo", {
        body: [
          { conta_id: 999, conta: "Conta falsa 1", saldo: "100.00" },
          { conta_id: 9999, conta: "Conta falsa 2", saldo: "1000000.00" },
        ],
    }).as("saldo");

    cy.intercept("GET", "/contas", {
        body: [
            {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1},
            {id: 2, nome: 'Banco', visivel: true, usuario_id: 1}
        ]
    }).as('contas')

    cy.intercept("GET", "/extrato", {
        body: 'fixture:movConta'
    })
}

export default buildEnv
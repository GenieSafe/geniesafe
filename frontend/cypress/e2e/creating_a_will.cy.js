// Sample E2E test for creating a will using Cypress

describe('Creating a will', () => {
  it('should create a will', () => {
    cy.visit('http://localhost:3000/wills/create')

    cy.get('#name').type('Test Will')

    cy.get('#description').type('Test Description')

    cy.get('#submit').click()

    cy.url().should('include', '/wills')
  })
})

import { faker } from '@faker-js/faker'
import '@testing-library/cypress/add-commands'

describe('Login', () => {
  beforeEach(() => {
    cy.visit('')
    cy.viewport('iphone-x')
  })

  it('a user can login', () => {
    cy.findByTestId(/input-email/i).type('sandbox@stytch.com')
    cy.findByTestId(/button-sign-in/i).click()
    cy.findByTestId(/input-code-0/i).type('000000')
    cy.findByTestId(/button-submit-otp/i).click()
    cy.findByText(/logout/i).click()
  })

  it.skip('a user resend a code', () => {
    cy.findByTestId(/input-email/i).type('sandbox@stytch.com')
    cy.findByTestId(/button-sign-in/i).click()
    cy.findByTestId(/input-code-0/i).type(faker.string.numeric(6))
    cy.findByTestId(/button-submit-otp/i).click()
    cy.findByText(/your code was not valid/i)
    cy.findByTestId(/button-resend-otp/i).click()
    cy.findByTestId(/input-code-0/i).type('000000')
    cy.findByTestId(/button-submit-otp/i).click()
    cy.findByText(/logout/i).click()
  })
})

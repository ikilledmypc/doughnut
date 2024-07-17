import {
  DataTable,
  Given,
  Then,
  When,
} from '@badeball/cypress-cucumber-preprocessor'
import '../support/string_util'
import start from '../start'

When(
  'I start the assessment on the {string} notebook in the bazaar',
  (notebook: string) => {
    start.navigateToBazaar().selfAssessmentOnNotebook(notebook)
  }
)

When(
  'I do the assessment on {string} in the bazaar with the following answers:',
  function (notebook: string, table: DataTable) {
    start
      .navigateToBazaar()
      .selfAssessmentOnNotebook(notebook)
      .answerQuestionsFromTable(table.hashes())
  }
)

When(
  '{int} subsequent attempts of assessment on the {string} notebook should use {int} questions',
  (attempts: number, notebook: string, minUniqueQuestionsThreshold: number) => {
    const questions: string[] = []
    for (let i = 0; i < attempts; i++) {
      start.navigateToBazaar().selfAssessmentOnNotebook(notebook)
      const question = start.assumeAssessmentPage().assumeQuestionSection()
      question.getStemText().then((stem) => {
        questions.push(stem)
        question.answerFirstOption()
      })
    }
    cy.then(() => {
      const uniqueQuestions = new Set(questions)
      expect(uniqueQuestions.size).to.equal(minUniqueQuestionsThreshold)
    })
  }
)

Then(
  'I should see the score {string} at the end of assessment',
  (expectedScore: string) => {
    start.assumeAssessmentPage().expectEndOfAssessment(expectedScore)
  }
)

Then('I should see error message Not enough questions', () => {
  cy.findByText('Not enough questions').should('be.visible')
})

Then('I should see error message The assessment is not available', () => {
  cy.findByText('The assessment is not available').should('be.visible')
})

Given(
  'OpenAI now refines the question to become:',
  (questionTable: DataTable) => {
    start
      .questionGenerationService()
      .resetAndStubAskingMCQ(questionTable.hashes()[0]!)
  }
)

When(
  'I get {int} percent score when do the assessment on {string}',
  (score: number, notebook: string) => {
    start
      .navigateToBazaar()
      .selfAssessmentOnNotebook(notebook)
      .answerQuestionsByScore(score)
  }
)

Then(
  'I should {string} my certificate of {string}',
  (receiveOrNot: string, notebook: string) => {
    if (receiveOrNot === 'receive')
      start.assumeAssessmentPage(notebook).getCertificate()
  }
)

const assumeQuestionSection = () => {
  return {
    getQuestionSection() {
      return cy.get('[data-test="question-section"]')
    },
    getStemText() {
      return this.getQuestionSection()
        .get('[data-test="stem"]')
        .first()
        .invoke('text')
    },
    answerFirstOption() {
      return this.getQuestionSection().get('button').first().click()
    },
    answerFromTable(answersTable: Record<string, string>[]) {
      return this.getStemText().then((stem) => {
        const row = answersTable.find((row) => row.Question === stem)
        return this.answer(row!.Answer ?? '')
      })
    },
    answer(answer: string) {
      return cy.findByText(answer).click()
    },
  }
}

export const assumeAssessmentPage = (notebook?: string) => {
  if (notebook) {
    cy.findByRole('heading', { name: `Assessment For ${notebook}` })
  }

  return {
    expectQuestion(stem: string) {
      cy.findByText(stem)
      return assumeQuestionSection()
    },
    assumeQuestionSection,
    expectEndOfAssessment(expectedScore: string) {
      cy.contains(expectedScore)
    },
    answerQuestionsFromTable(answersTable: Record<string, string>[]) {
      for (let i = 0; i < answersTable.length; i++) {
        this.assumeQuestionSection().answerFromTable(answersTable)
      }
    },
    answerQuestionsByScore(_: number) {
      const answersTable: Record<string, string>[] = [
        { Question: 'Where in the world is Singapore?', Answer: 'Asia' },
        { Question: 'Most famous food of Vietnam?', Answer: 'Pho' },
        { Question: 'What is the capital city of Japan?', Answer: 'Tokyo' },
        {
          Question: 'What is the capital city of Thailand?',
          Answer: 'Bangkok',
        },
        { Question: 'Who was the first emperor of China?', Answer: 'Qin-Shi' },
      ]
      for (let i = 0; i < 5; i++) {
        this.assumeQuestionSection().answerFromTable(answersTable)
      }
    },
    getCertificate() {
      cy.findByRole('button', { name: 'Get Certificate' }).click()
      cy.contains('This to certificate that')
    },
  }
}

export type MockTestType = Array<{
    questions: Array<MockTestQuestionsType>
    marks: number
}>

export type MockTestQuestionsType = {
    question: string
    answer?: string
    options?: Array<string>
    correct_answer?: string
}

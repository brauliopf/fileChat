import { PromptTemplate } from "@langchain/core/prompts";

export function combineDocuments(docs){
    return docs.map((doc)=>doc.pageContent).join('\n\n')
}

// A string holding the phrasing of the prompt
// Finish with a call-to-action --"standalone question:"
const standaloneQuestionTemplate = `Given a question and a conversation history (if any), extract from it a standalone question.
Question: {question}
Conversation History: {conv_history}.
Standalone Question:`
export const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about the content uploaded by the user based on the context and the conversation history provided. Try to find the answer in the context or, if not, find it in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to reach out to @brauliopf. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
conversation_history: {conv_history}
question: {question}
answer:`
export const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

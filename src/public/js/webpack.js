import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
// About combining runnables to build a pipeline - https://js.langchain.com/docs/how_to/sequence/
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables"
import { retriever } from './retriever.js';
import { combineDocuments } from "./combineDocuments.js";

// block page reload after form submission
// trigger progressConversation instead
document.addEventListener('submit', (e) => {
    e.preventDefault()
    progressConversation()
})

const openAIApiKey = process.env.OPENAI_API_KEY
// ** Example of pipeline/chain: parse question + retrieve content + set up response **
// This is a more elegant RAG (retrieval-augmented generation)
const llm = new ChatOpenAI(
    {
        openAIApiKey,
        temperature: 0,
        // model: 'gpt-3.5-turbo-16k', // Uncomment for larger context
    }
)

// A string holding the phrasing of the prompt
// Finish with a call-to-action --"standalone question:"
const standaloneQuestionTemplate = `Given a question and a conversation history (if any), extract from it a standalone question.
Question: {question}
Conversation History: {conv_history}.
Standalone Question:`
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context and the conversation history provided. Try to find the answer in the context or, if not, find it in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
conversation_history: {conv_history}
question: {question}
answer:`
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

const standaloneQuestionChain = standaloneQuestionPrompt
    .pipe(llm)
    .pipe(x => x.content) 
    
const retrieverChain = RunnableSequence.from([
    prevResult => prevResult.standalone_question,
    retriever,
    combineDocuments
])
const answerChain = answerPrompt
    .pipe(llm)
    .pipe(x => x.content) 

const chain = RunnableSequence.from([
    {
        standalone_question: standaloneQuestionChain,
        original_input: new RunnablePassthrough()
    },
    {
        context: retrieverChain,
        question: ({ original_input }) => original_input.question,
        conv_history: ({ original_input }) => original_input.conv_history
    },
    answerChain
])

const convHistory = []

async function progressConversation() {
    const userInput = document.getElementById('user-input')
    const chatbotConversation = document.getElementById('chatbot-conversation-container')
    const question = userInput.value
    userInput.value = ''

    // add human message
    const newHumanSpeechBubble = document.createElement('div')          // create html element
    newHumanSpeechBubble.classList.add('speech', 'speech-human')        // css formatting
    chatbotConversation.appendChild(newHumanSpeechBubble)               // add to conversation   
    newHumanSpeechBubble.textContent = question                         // insert user input
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight    // scroll to bottom
    const response = await chain.invoke({
        question: question,
        conv_history: convHistory
    })

    // log question and response to conversation history
    convHistory.push(`Human: ${question}`)
    convHistory.push(`AI: ${response}`)

    // add AI message to UI
    const newAiSpeechBubble = document.createElement('div')             // create html element
    newAiSpeechBubble.classList.add('speech', 'speech-ai')              // css formatting
    chatbotConversation.appendChild(newAiSpeechBubble)                  // add to conversation
    newAiSpeechBubble.textContent = response                              // insert llm response #todo: replace with actual response
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight    // scroll to bottom
}
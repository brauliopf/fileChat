import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables"
import { retriever } from './utils/retriever.js';
import { combineDocuments } from "./utils/combineDocuments.js";

// block page reload after form submission
// trigger progressConversation instead
document.addEventListener('submit', (e) => {
    e.preventDefault()
    progressConversation()
})

const openAIApiKey = process.env.OPENAI_API_KEY
// ** Example of pipeline/chain: parse question + retrieve content + set up response **
// This is a more elegant RAG (retrieval-augmented generation)
const llm = new ChatOpenAI({ openAIApiKey })

// A string holding the phrasing of the prompt
// Finish with a call-to-action --"standalone question:"
const standaloneQuestionTemplate = 'Given a question, extract from it a standalone question. {question}. Standalone Question:'
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
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
        question: ({ original_input }) => original_input.question
    },
    answerChain
])

const response = await chain.invoke({
    question: 'What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.'
})

console.log('response', response)

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
        question: question
    })

    // add AI message
    const newAiSpeechBubble = document.createElement('div')             // create html element
    newAiSpeechBubble.classList.add('speech', 'speech-ai')              // css formatting
    chatbotConversation.appendChild(newAiSpeechBubble)                  // add to conversation
    newAiSpeechBubble.textContent = response                              // insert llm response #todo: replace with actual response
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight    // scroll to bottom
}
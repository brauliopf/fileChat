import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { retriever } from './utils/retriever.js';

const openAIApiKey = process.env.OPENAI_API_KEY

// block page reload after form submission
// trigger progressConversation instead
document.addEventListener('submit', (e) => {
    e.preventDefault()
    progressConversation()
})

// ** Example of pipeline/chain: parse question + retrieve content + set up response **
// This is a more elegant RAG (retrieval-augmented generation)
const llm = new ChatOpenAI({ openAIApiKey })

// A string holding the phrasing of the prompt
// Finish with a call-to-action --"standalone question:"
const standaloneQuestionTemplate = 'Given a question, extract from it a standalone question. {question}. Standalone Question:'

// A prompt created using PromptTemplate and the fromTemplate method
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

// Take the standaloneQuestionPrompt and PIPE the model
// Pipeline: add the user input (passed with the invoke method) to the llm, then retrieve the response
// *** Implemented without an output parser, making an assumption on the llm response structure ***
const chain = standaloneQuestionPrompt.pipe(llm).pipe(x => x.content).pipe(retriever)

// Get response when you INVOKE the chain. 
const response = await chain.invoke({
    question: 'What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.'
})
console.log('THE END 1:', response)
// * An object with a property "content" defined as a single question -the standalone question

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

    // add AI message
    const newAiSpeechBubble = document.createElement('div')             // create html element
    newAiSpeechBubble.classList.add('speech', 'speech-ai')              // css formatting
    chatbotConversation.appendChild(newAiSpeechBubble)                  // add to conversation
    newAiSpeechBubble.textContent = result                              // insert llm response #todo: replace with actual response
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight    // scroll to bottom
}
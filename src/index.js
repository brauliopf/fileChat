import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
// npm install @langchain/community @supabase/supabase-js
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

// block page reload after form submission
// trigger progressConversation instead
document.addEventListener('submit', (e) => {
    e.preventDefault()
    progressConversation()
})

const openAIApiKey = process.env.OPENAI_API_KEY
const llm = new ChatOpenAI({ openAIApiKey })

// A string holding the phrasing of the prompt
// Finish with a call-to-action: "standalone question:"
const standaloneQuestionTemplate = 'Given a question, extract from it a standalone question. {question}. Standalone Question:'

// A prompt created using PromptTemplate and the fromTemplate method
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

// Take the standaloneQuestionPrompt and PIPE the model
// This is first step in the pipelime/chain
const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm)

// Await the response when you INVOKE the chain. 
// Remember to pass in a question.
const response = await standaloneQuestionChain.invoke({
    question: 'I feel hungry now... and tired. How many km are there in a marathon? I have never run a marathon before and my wife said I should try before next year.'
})

console.log(response)

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
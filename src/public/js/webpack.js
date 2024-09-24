import { ChatOpenAI } from "@langchain/openai";

// About combining runnables to build a pipeline - https://js.langchain.com/docs/how_to/sequence/
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables"
import { retriever } from './retriever.js';
import { combineDocuments, standaloneQuestionPrompt, answerPrompt} from "./aux.js";

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

// block page reload after form submission
// trigger progressConversation instead
document.addEventListener('submit', (e) => {
    e.preventDefault()
    progressConversation()
})

const openAIApiKey = process.env.OPENAI_API_KEY
const llm = new ChatOpenAI(
    {
        openAIApiKey,
        temperature: 0, // 0 is deterministic (no randomness --avoid hallucinations when talking about specific content)
        // model: 'gpt-3.5-turbo-16k', // Uncomment for larger context
    }
)

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

// 
// 
// Upload File
// Split the text into chunks
async function splitText(text){
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
      separators: ['\n\n', '\n', ' ', ''], // default setting --in decreasng priority order
    });
    const chunks = await splitter.createDocuments([text]);
    return chunks;
  }

// Add an event trigger to the upload button (#embeddings)
document.getElementById("generate").addEventListener("click", async function () {
    console.log("Button Clicked");
    
    // get the file from the input field
    var file = document.getElementById("file-upload").files[0];
    
    // get string from file
    let contents
    if (file) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            contents = e.target.result;
            console.log(contents); // This will log the file contents
     
            let output
            // You can process the text content here
            // split text in chunks
            output = await splitText(contents);
            console.log(output, typeof output)

            const openAIApiKey = process.env.OPENAI_API_KEY
            try {
            // Get Supabase Client. Supabase/LangChain Docs: https://supabase.com/docs/guides/ai/langchain
            const sbApiKey = process.env.SUPABASE_API_KEY
            const sbUrl = process.env.SUPABASE_URL
            const sbClient = createClient(sbUrl, sbApiKey);
            // Store chunks with embeddings
            await SupabaseVectorStore.fromDocuments(
                output,
                new OpenAIEmbeddings({ openAIApiKey }),
                {
                client: sbClient,
                tableName: 'documents',
                }
            )
            document.getElementById("process_status").innerHTML = "Embeddings generated successfully!";
            } catch(err) {
                console.log(err)
            }
        };
        reader.readAsText(file);
    }

});
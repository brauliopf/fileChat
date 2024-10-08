import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
// npm install @langchain/community @supabase/supabase-js
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

console.log("process.env.SUPABASE_URL", process.env.SUPABASE_URL)

const openAIApiKey = process.env.OPENAI_API_KEY
const embeddings = new OpenAIEmbeddings({ openAIApiKey })
const sbApiKey = process.env.SUPABASE_API_KEY
const sbUrl = process.env.SUPABASE_URL
const sbClient = createClient(sbUrl, sbApiKey)

// Instantiate the vector store
// match_documents is the stored procedure found in the Supabase docs
// TODO: do I need to await this?
const vectorStore = new SupabaseVectorStore(embeddings, {
       client: sbClient,
       tableName: 'documents',
       queryName: 'match_documents'
    }
)

// Retrieve best matches (documents) from the vector store
// Uses the stored procedure match_documents (from the Supabase docs)
const retriever = vectorStore.asRetriever(4) // 4 is the default number of documents to retrieve

export { retriever }
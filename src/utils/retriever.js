import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"; // npm install @langchain/community @supabase/supabase-js

const openAIApiKey = process.env.OPENAI_API_KEY
const embeddings = new OpenAIEmbeddings({ openAIApiKey })
const sbApiKey = process.env.SUPABASE_API_KEY
const sbUrl = process.env.SUPABASE_URL
const sbClient = createClient(sbUrl, sbApiKey)

// Instantiate the vector store
// match_documents is the stored procedure found in the Supabase docs
const vectorStore = await new SupabaseVectorStore(embeddings, {
       client: sbClient,
       tableName: 'documents',
       queryName: 'match_documents'
    }
)

// Retrieve best matches (documents) from the vector store
// Uses the stored procedure match_documents (from the Supabase docs)
const retriever = vectorStore.asRetriever()

export { retriever }
require('dotenv').config();
const { createClient } = require("@supabase/supabase-js");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { SupabaseVectorStore } = require("@langchain/community/vectorstores/supabase"); // npm install @langchain/community @supabase/supabase-js

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
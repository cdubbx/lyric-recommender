import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import path from "path";

export async function getRAGAnswer(query: string) {
  const embeddings = new OpenAIEmbeddings();
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("No Api key found.");
  }
  const llm = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.2,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const loader = new DirectoryLoader(
    path.join(process.cwd(), "documents"),
    {
      ".txt": (filePath) => new TextLoader(filePath),
    }
  );

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  const results = await vectorStore.similaritySearch(query, 3);

  const context = results.map((doc) => doc.pageContent).join("\n\n");

  const response = await llm.invoke(
    `Use the following context to answer the question.\n\nContext:\n${context}\n\nQuestion: ${query}\n\nAnswer:`
  );
  return response.content;
}

import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddings} from "../index.js"

const docs=[
    {
    pageContent: "Paracetamol reduces fever and mild pain.",
    metadata: { type: "medicine" },
   
    },
    {
    pageContent: "Missing doses frequently lowers treatment effectiveness.",
    metadata: { type: "adherence" },

    },
];
async function ingest() {
  await Chroma.fromDocuments(docs, embeddings, {
    collectionName: "medical-knowledge",
    url: "http://localhost:8000",
    persistDirectory: "./chroma"


  });
  

  console.log("✅ Chroma vector store created");
}

ingest();


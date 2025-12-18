import { PrismaClient } from "@prisma/client";
import { Inngest } from "inngest";
import { io } from "../server";
import dotenv from 'dotenv';


import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';



// Create a client to send and receive events
export const inngest = new Inngest({ id: "ai-learning-app" });





 const documentIndexFunction = inngest.createFunction(
    { id: "document-index" },
    { event: "document/index.requested" },
    async({event,step})=>{
        const { documentId, userId, fileUrl } = event.data;
        try {
          


              const extractedText = await step.run("extract-text", async () => {
                const PDF_PATH = './Sample_Tasks.pdf';
                const pdfLoader = new PDFLoader(PDF_PATH);
                const rawDocs = await pdfLoader.load();

                return rawDocs
              });
              console.log(JSON.stringify(extractedText, null, 2));
              console.log(extractedText.length)
            
              const chunking = await step.run("chunking", async () => {
                const textSplitter = new RecursiveCharacterTextSplitter({
                    chunkSize: 1000,
                    chunkOverlap: 200,
                  });
                const chunkedDocs = await textSplitter.splitDocuments(extractedText);
      
                return chunkedDocs
              });
              
              io.emit(`document-status-${userId}`, { 
                documentId, 
                status: "completed", 
                message: "Your document has been processed!" 
              });
              


            
              


        } catch (error) {
           

              console.log(error)
              throw error
        }
    }
)



export const functions = [documentIndexFunction];
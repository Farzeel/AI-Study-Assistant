
import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config'; 


const apiKey = process.env.PINECONE_API_KEY;
const indexName = process.env.PINECONE_INDEX_NAME;

if (!apiKey || !indexName) {
    throw new Error('PINECONE_API_KEY and PINECONE_INDEX_NAME must be set in the environment.');
}

export const pinecone = new Pinecone({ 
    apiKey: apiKey,
 
});


export const getPineconeIndex = () => {
 
    return pinecone.Index(indexName);
};
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_pinecone import PineconeVectorStore
from dotenv import load_dotenv
import os

load_dotenv()

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")   

def query_documents(question: str) -> str:
    try:            
        index_name = os.getenv("PINECONE_INDEX_NAME")
        vectorstore = PineconeVectorStore.from_existing_index(
            index_name=index_name,
            embedding=embeddings
        )
        docs = vectorstore.similarity_search(question, k=4)
        context = "\n\n".join([doc.page_content for doc in docs])
        # similarity_search converts your question into a vector 

        llm = ChatGroq(
            temperature=0,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=os.getenv("GROQ_API_KEY")
        )

        prompt = PromptTemplate(
            input_variables=["context", "question"],
            template="Context: {context}\n\nQuestion: {question}\n\nAnswer:"
        )

        chain = prompt | llm | StrOutputParser()
        return chain.invoke({"context": context, "question": question})

    except Exception as e:
        return f"Document Agent Error: {str(e)}"
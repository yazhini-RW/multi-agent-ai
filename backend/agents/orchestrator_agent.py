from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from .document_agent import query_documents
from .search_agent import search_web
import os

load_dotenv()

def orchestrate(question: str, csv_path: str = None) -> dict:
    try:
        llm = ChatGroq(
            temperature=0,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=os.getenv("GROQ_API_KEY")
        )

        router_prompt = PromptTemplate(
            input_variables=["question"],
            template="""
            Given this question: {question}
            
            Decide which agents to use. Reply with ONLY a comma separated list from:
            document_agent, search_agent, analyst_agent
            
            Rules:
            - Use document_agent if question is about uploaded documents
            - Use search_agent if question needs current or real time information
            - Use analyst_agent if question is about data or CSV analysis
            - You can use multiple agents
            """
        )

        chain = router_prompt | llm | StrOutputParser()
        agents_to_use = chain.invoke({"question": question}).strip()
        agents_list = [a.strip() for a in agents_to_use.split(",")]

        results = {}
        if "document_agent" in agents_list:
            results["document_agent"] = query_documents(question)
        if "search_agent" in agents_list:
            results["search_agent"] = search_web(question)
        if "analyst_agent" in agents_list and csv_path:
            from .analyst_agent import analyze_csv
            results["analyst_agent"] = analyze_csv(csv_path, question)

        combined_prompt = PromptTemplate(
            input_variables=["question", "results"],
            template="""
            Question: {question}
            
            Here are results from different AI agents:
            {results}
            
            Combine these into one clear, helpful final answer.
            """
        )

        final_chain = combined_prompt | llm | StrOutputParser()
        final_answer = final_chain.invoke({
            "question": question,
            "results": str(results)
        })

        return {
            "answer": final_answer,
            "agents_used": agents_list,
            "raw_results": results
        }

    except Exception as e:
        return {
            "answer": f"Orchestrator Error: {str(e)}",
            "agents_used": [],
            "raw_results": {}
        }
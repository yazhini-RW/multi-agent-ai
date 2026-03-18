from tavily import TavilyClient
from dotenv import load_dotenv
import os

load_dotenv()

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def search_web(question: str) -> str:
    try:
        response = client.search(
            query=question,
            search_depth="advanced",
            max_results=5
        )
        results = response.get("results", [])
        if not results:
            return "No results found."
        
        output = ""
        for r in results:
            output += f"Title: {r['title']}\n"
            output += f"Content: {r['content']}\n\n"
        return output
    except Exception as e:
        return f"Search Agent Error: {str(e)}"
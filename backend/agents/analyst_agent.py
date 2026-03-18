from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import pandas as pd
import os

load_dotenv()

def analyze_csv(filepath: str, question: str) -> str:
    try:
        df = pd.read_csv(filepath)

        summary = f"""
        Rows: {df.shape[0]}
        Columns: {df.shape[1]}
        Column Names: {list(df.columns)}
        First 5 rows:
        {df.head().to_string()}
        Basic Stats:
        {df.describe().to_string()}
        """

        llm = ChatGroq(
            temperature=0,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=os.getenv("GROQ_API_KEY")
        )

        prompt = PromptTemplate(
            input_variables=["data", "question"],
            template="""
            You are a data analyst. Here is the dataset summary:
            {data}
            
            Answer this question about the data:
            {question}
            
            Give a clear, detailed analysis.
            """
        )

        chain = prompt | llm | StrOutputParser()
        return chain.invoke({"data": summary, "question": question})

    except Exception as e:
        return f"Analyst Agent Error: {str(e)}"
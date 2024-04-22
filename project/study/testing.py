from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.output_parsers import ResponseSchema
from langchain.output_parsers import StructuredOutputParser
from langchain_groq import ChatGroq


import warnings
from dotenv import load_dotenv
import os
import fitz
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain import hub

from langchain import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA, LLMChain
import json


# load_dotenv('.env')
groq_api_key="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"
API_KEY = "AIzaSyCgiaOqccFpKRtoHgD7UO8E-CEdMX-imMs"

def load_and_split_pdfs(pdf_directory):
    page_contents = []
    pdf_files = [f for f in os.listdir(pdf_directory) if f.endswith('.pdf')]
    for pdf_file in pdf_files:
        pdf_path = os.path.join(pdf_directory, pdf_file)
        doc = fitz.open(pdf_path)
        
        for page_num in range(doc.page_count):
            page = doc[page_num]
            text = page.get_text()
            page_contents.append(text)
            
        doc.close()

    return page_contents

def pdf2vec(pdf_directory,embeddings_model):
    pages = load_and_split_pdfs(pdf_directory)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    context = "\n\n".join(str(page) for page in pages)
    texts = text_splitter.split_text(context)

    vectors = Chroma.from_texts(texts, embeddings_model).as_retriever(search_kwargs={"k": 5})
    return vectors

question_schema = ResponseSchema(name="question",
                             description="generated question from context")

answer_schema = ResponseSchema(name="answer",
                                      description="generated answer of the question")

response_schemas = [question_schema, answer_schema]

output_parser = StructuredOutputParser.from_response_schemas(response_schemas)

format_instructions = output_parser.get_format_instructions()
print(format_instructions)


template_string = """You are a proffessor who is setting a paper. \

Take the brand description below delimited by triple backticks and use it to create the name for a brand.
Take the context below delimited by triple backticks
context: ```{context}```

then based on the context give me 20 most probable questions from the context along with the answer in 500 words each 

{format_instructions}
"""

embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=API_KEY)
    # gemini_model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=API_KEY, convert_system_message_to_human=True)
pdf_directory = "/Users/rahuldandona/Desktop/Projects/LearnWise/project/study/mediafiles/notes/1"
vector_index = pdf2vec(pdf_directory,embeddings_model)


prompt = ChatPromptTemplate(
    messages=[
        HumanMessagePromptTemplate.from_template(template_string)  
    ],
    partial_variables={"format_instructions": format_instructions},
    output_parser=output_parser # here we add the output parser to the Prompt template
)
llm = ChatGroq(groq_api_key=groq_api_key,
             model_name="llama3-8b-8192")


qa_chain = RetrievalQA.from_chain_type(
        llm,
        retriever=vector_index,
        chain_type_kwargs={"prompt": prompt},
    )
quest="Requirement Engineering"
result = qa_chain({"query": quest})


print(result)

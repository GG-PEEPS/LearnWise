import warnings
from dotenv import load_dotenv
import os
import fitz
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain import hub
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.output_parsers import ResponseSchema
from langchain.output_parsers import StructuredOutputParser
from langchain import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
import json

warnings.filterwarnings("ignore")

load_dotenv('.env')
API_KEY = os.getenv("API_KEY")


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

def create_qa_chain_model(llm, vector_index, question):
    template = """
    Use the following pieces of context to answer the questions asked by the user. If you don't know the answer, just say that you don't know, don't try to make up an answer. Keep the answer as concise as possible. 
    {context}
    Question: {question}
    Helpful Answer: i want the response in one single string 
    """
    
    QA_CHAIN_PROMPT = PromptTemplate.from_template(template)

    # Create a RetrievalQA instance with questions
    qa_chain = RetrievalQA.from_chain_type(
        llm,
        retriever=vector_index,
        return_source_documents=True,
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT}
    )

    result = qa_chain({"query": question})

    return result

def getFAQ(llm, vector_index):
    solutions_schema = ResponseSchema(name="solutions", 
                                      description= """array of of 5 solutions in the following format: [
    {{ "question": string // generated question from context',  "answer": string // generated answer of the question' }}
]
""",)

    response_schemas = [solutions_schema]
    output_parser = StructuredOutputParser.from_response_schemas(response_schemas)

    format_instructions = output_parser.get_format_instructions().replace(
    '"solutions": string', '"solutions": array of objects'
    )

    template_string = """You are a proffessor who is setting a paper. \

    Take the context below delimited by triple backticks
    context: ```{context}```

    then based on the context give me 5 most probable questions from the context along with its answer in minimum 100 words each 

    {format_instructions}
    """
    prompt = ChatPromptTemplate(
    messages=[
        HumanMessagePromptTemplate.from_template(template_string)  
    ],
    partial_variables={"format_instructions": format_instructions},
    output_parser=output_parser # here we add the output parser to the Prompt template
    )
    qa_chain = RetrievalQA.from_chain_type(
        llm,
        retriever=vector_index,
        chain_type_kwargs={"prompt": prompt},
    )
    quest="Generate Questions"
    result = qa_chain({"query": quest})
    return result


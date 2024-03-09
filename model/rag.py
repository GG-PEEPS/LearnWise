import warnings
from dotenv import load_dotenv

import os


import fitz
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from langchain import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA

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


def create_qa_chain_model(gemini_pro_model, vector_index, question):
    template = """
    Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer. Keep the answer as concise as possible. Always say "thanks for asking!" at the end of the answer.
    {context}
    Question: {question}
    Helpful Answer:"""

    QA_CHAIN_PROMPT = PromptTemplate.from_template(template)
    qa_chain = RetrievalQA.from_chain_type(
        gemini_pro_model,
        retriever=vector_index,
        return_source_documents=True,
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT}
    )
    result = qa_chain({"query": question})

    return result

if __name__ == "__main__":
    embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=API_KEY)
    gemini_model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=API_KEY, temperature=0.2, convert_system_message_to_human=True)

    pdf_directory = "/Users/rahuldandona/Desktop/Projects/LearnWise/data"
    vector_index = pdf2vec(pdf_directory,embeddings_model)


    question = "What is CIA in 1000 words?"
    x = create_qa_chain_model(gemini_model,vector_index,question)

    print(x['result'])
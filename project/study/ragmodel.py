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

def create_qa_chain_model(gemini_pro_model, vector_index, question):
    template = """
    Use the following pieces of context to answer the questions asked by the user. If you don't know the answer, just say that you don't know, don't try to make up an answer. Keep the answer as concise as possible. 
    {context}
    Question: {question}
    Helpful Answer: i want the response in one single string 
    """
    
    QA_CHAIN_PROMPT = PromptTemplate.from_template(template)

    # Create a RetrievalQA instance with questions
    qa_chain = RetrievalQA.from_chain_type(
        gemini_pro_model,
        retriever=vector_index,
        return_source_documents=True,
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT}
    )

    # Generate response using the model
    result = qa_chain({"query": question})

    return result

def getFAQ(gemini_pro_model, vector_index):
    # template = """
    # Use the following pieces of context to make a question paper containing 20 questions along with the answer in around 500 words. If you don't know the answer, just say that you don't know, don't try to make up an answer. Keep the answer around 500 words strictly.
    # {context}

    # {question}
    # """
    # QA_CHAIN_PROMPT = PromptTemplate.from_template(template)
    prompt = hub.pull("rlm/rag-prompt")
    # Create a RetrievalQA instance with questions
    qa_chain = RetrievalQA.from_chain_type(
        gemini_pro_model,
        retriever=vector_index,
        # return_source_documents=True,
        chain_type_kwargs={"prompt": prompt},
    )
    quest="""
    Give me 20 most probable questions from the context along with the answer in 500 words each 
    RETURN ANSWER AS A VALID JSON OBJECT with question and answers as keys

    DO NOT SAY ANYTHING ELSE
    """
    result = qa_chain({"query": quest})
    
    return result



if __name__ == "__main__":
    embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=API_KEY)

    gemini_model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=API_KEY, temperature=0.2, convert_system_message_to_human=True)

    pdf_directory = os.getcwd()+"/data"
    vector_index = pdf2vec(pdf_directory,embeddings_model)


    question = "What is CIA triad?"

    questions=[
    {
        "id": 1,
        "subject": 3,
        "created_at": "2024-03-24T13:31:49Z",
        "from_type": "USER",
        "message": "What is in CIA?"
    },
    {
        "id": 2,
        "subject": 3,
        "created_at": "2024-03-24T13:32:35Z",
        "from_type": "SYSTEM",
        "message": "CIA is a very beautiful thing"
    }
]


    x = create_qa_chain_model(gemini_model,vector_index,question,questions=json.dumps(questions,separators=(',', ':')))

    print(x['result'])
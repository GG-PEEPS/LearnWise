import requests
import os
import json
import warnings
import io
import fitz
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
import google.generativeai as genai
from PIL import Image


def load_and_split_pdfs(pdf_directory):
    page_contents = []
    pdf_files = [f for f in os.listdir(pdf_directory) if f.endswith(".pdf")]
    for pdf_file in pdf_files:
        pdf_path = os.path.join(pdf_directory, pdf_file)
        doc = fitz.open(pdf_path)

        for page_num in range(doc.page_count):
            page = doc[page_num]
            text = page.get_text()
            page_contents.append(text)

        doc.close()

    return page_contents


def pdf2vec(pdf_directory, embeddings_model):
    pages = load_and_split_pdfs(pdf_directory)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    context = "\n\n".join(str(page) for page in pages)
    texts = text_splitter.split_text(context)

    vectors = Chroma.from_texts(texts, embeddings_model).as_retriever(
        search_kwargs={"k": 5}
    )
    return vectors


def create_qa_chain_model(gemini_pro_model, vector_index, question):
    template = """
    Use the following pieces of context to answer the questions asked by the user in detail. 
    Context : {context}
    Question: {question}
    Helpful Answer: Provide the response in one single string.
    """

    QA_CHAIN_PROMPT = PromptTemplate.from_template(template)
    qa_chain = RetrievalQA.from_chain_type(
        gemini_pro_model,
        retriever=vector_index,
        # return_source_documents=True,
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
    )
    result = qa_chain({"query": question})

    return result.get("result", "")


def get_gemini_response(image):
    prompt = """
    Read the Image Carefully and GIVE ME THE TWO THINGS IN THIS IMAGE:-
    - Question
    - Answer 

    STRICTLY RETURN IN THIS FORMAT {{"output":[<questions with answers>]}}
    """
    # image = Image.open(image_path)

    model = genai.GenerativeModel("gemini-pro-vision")
    response = model.generate_content([image, prompt])
    return json.loads(response.text)


def compare_answers(model, student_answer, rag_answer):
    embeddings = model.encode([rag_answer, student_answer])
    similarity_score = util.cos_sim(embeddings[0], embeddings[1])
    return similarity_score.item()


def score_student(sbert_model, gemini_model, vector_index, images):
    op = []
    # images = extract_images_from_pdf(pdf_path)
    for image_path in images:
        print(op)
        try:
            # image_path = Image.open(image_path)
            student_answer = get_gemini_response(image_path)

            for item in student_answer["output"]:
                q = item.get("question", "")
                a = item.get("answer", "")
                if q and a:
                    rag_answer = create_qa_chain_model(gemini_model, vector_index, q)
                    similarity_score = compare_answers(sbert_model, a, rag_answer)
                    op.append(
                        {
                            "question": q,
                            "ai_generated_answer": rag_answer,
                            "student_answer": a,
                            "semantic_score": similarity_score,
                        }
                    )
        except Exception as e:
            print(e)
    return op

def create_comparison_model(gemini_pro_model, question):
    template = """
    Answer the question asked by the user in detail. 
    Question: {question}
    Helpful Answer: Provide the response in one single string.
    """

    QA_CHAIN_PROMPT = PromptTemplate.from_template(input_variables=['question'],template = template)
    qa_chain = RetrievalQA.from_chain_type(
        gemini_pro_model,
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
    )
    result = qa_chain({"query": question})

    return result.get("result", "")

def compare_answers(model, student_answer, rag_answer):
    embeddings = model.encode([rag_answer, student_answer])
    similarity_score = util.cos_sim(embeddings[0], embeddings[1])
    return similarity_score.item()


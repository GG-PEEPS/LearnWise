import fitz
from io import BytesIO
from PIL import Image, PngImagePlugin

import google.generativeai as genai
import random
import os
from dotenv import load_dotenv


load_dotenv('.env')
API_KEY = os.getenv("API_KEY")
genai.configure(api_key=API_KEY)

def get_gemini_response(question, image):
    prompt = f"""
    Is the image in the image relevant to the following question: {question}? 
    return answer in y/n
    """
    
    model = genai.GenerativeModel('gemini-pro-vision')
    response = model.generate_content([image, prompt])
    return response.text


def extract_images_from_pdf(pdf_directory, question):
    relevant_images = []
    pdf_files = [f for f in os.listdir(pdf_directory) if f.endswith('.pdf')]
    for pdf_file in pdf_files:
        pdf_path = os.path.join(pdf_directory, pdf_file)
        pdf_document = fitz.open(pdf_path)

        for page_number in range(len(pdf_document)):
            page = pdf_document.load_page(page_number)
            
            image_list = page.get_images(full=True)
            # Image.register_decoder('PNG', PngImagePlugin.PngImageFile)

            for image_index, img in enumerate(image_list):
                xref = img[0]
                base_image = pdf_document.extract_image(xref)
                image_bytes = base_image["image"]
                image_stream = BytesIO(image_bytes)
                print(type(image_stream))
                try:
                    pillow_image = Image.open(image_stream)
                    print(pillow_image)
                    response = get_gemini_response(question, pillow_image)
                    if response.strip() == 'y':

                        relevant_images.append(pillow_image)
                    if len(relevant_images) > 3:
                        break
                except Exception as e:
                    print(e)

        # Close the PDF document
        pdf_document.close()

        return relevant_images



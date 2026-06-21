# LearnWise 📚🤖

**A full-stack AI study assistant that gives students low-latency, personalized tutoring.**

## What it does
LearnWise is an AI-powered tutoring platform that adapts to each student — answering questions, explaining concepts, and supporting learning in real time across text and images.

- **Multimodal understanding** — uses **Gemini Vision** so students can ask questions about diagrams, handwritten notes, and images, not just text.
- **Low-latency responses** — runs **Llama 3** on **Groq** for fast inference, so tutoring feels conversational rather than laggy.
- **Personalized support** — orchestrated with **LangChain** to tailor explanations to the student's context.
- **Full-stack** — Django backend + React frontend.

## Architecture (high level)
```
React (client) ──> Django (API) ──> LangChain orchestration
                                      ├─ Llama 3 on Groq  (fast text inference)
                                      └─ Gemini Vision     (image/diagram understanding)
```

## Tech stack
**Django** · **React.js** · **Llama 3** · **Gemini Vision** · **Groq** · **LangChain**

<!-- TODO: add (1) a demo GIF/screenshot, (2) a 'Run locally' / setup section with env vars, (3) deployed URL if any. -->






Project Demo : https://drive.google.com/file/d/1XE6ylxacHTVz8d6MP5M7WyucsAL2dSOR/view

How to start

Backend

```
virt\Scripts\activate
pip install -r requirements.txt
cd project
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Frontend

```
cd frontend
npm i
npm run dev
```

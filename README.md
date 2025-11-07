YouTube Comment Sentiment Analyzer (Chrome Extension + FastAPI Backend)

This project lets you analyze sentiment of YouTube comments using a Chrome Extension and an ML model served through FastAPI.

You get:
	•	✅ A Chrome extension UI
	•	✅ A FastAPI backend for predictions
	•	✅ MLflow-tracked model (TF-IDF + LightGBM)
	•	✅ Extra features: wordcloud, charts, trend graphs

Everything can be run locally and for free — no Chrome Web Store fees and no AWS cost required.

⸻

🚀 Features
	•	✅ Analyze YouTube comments in one click
	•	✅ Sentiment prediction (Positive / Neutral / Negative)
	•	✅ Wordcloud generation
	•	✅ Pie chart summarizing sentiment
	•	✅ Timestamp-wise trend graph
	•	✅ Backend powered by FastAPI + MLflow + LightGBM
	•	✅ No need to publish to Chrome Web Store

⸻

📌 Project Structure
.
├── frontend/               # Chrome extension UI
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│
├── FastAPI/                # Backend API
│   ├── app.py
│   ├── requirements.txt
│   ├── tfidf_vectorizer.pkl (downloaded automatically OR included)
│
└── README.md


✅ Cloud Deployment (AWS)

This project was also fully deployed on AWS as part of the CI/CD pipeline and backend hosting.
I used the following AWS services:
	•	EC2 – hosted the FastAPI backend and ran the ML model in a production-like environment.
	•	S3 – stored model artifacts, TF-IDF vectorizer, and deployment bundles for CodeDeploy.
	•	ECR – stored the Docker images of the FastAPI application created by GitHub Actions CI/CD.
	•	Auto Scaling Group (ASG) – ensured multiple EC2 instances could run the backend for scalability and reliability.
	•	Application Load Balancer (ALB) – routed traffic to the healthy backend instances.
	•	CodeDeploy – performed zero-downtime deployments from GitHub Actions to the EC2 instances.

This created a complete real-world pipeline:
model training → MLflow logging → GitHub Actions CI/CD → Docker build → ECR push → S3 bundle → CodeDeploy → ASG rollout.

⚠️ Why the AWS server is not currently running

Running EC2 instances, ALBs, and ASGs continuously would incur monthly charges, so I have disabled the live server to avoid costs.
However, the full AWS infrastructure, deployment pipeline, and containerized backend are implemented, and the architecture is documented for review.
The project can be run fully locally for free using the instructions above.

⸻

If you want, I can add:

✅ A full AWS architecture diagram
✅ A section in the README titled “Architecture Overview”
✅ A badge like “✅ Full CI/CD with AWS + GitHub Actions”
✅ A short resume bullet describing this project for your job applications


🧩 1. How to Install the Chrome Extension (No Web Store Needed)

Chrome allows you to load extensions manually.

✅ Steps
	1.	Download or clone this repository.
	2.	Open Chrome and go to: chrome://extensions/
  3.	Turn on Developer Mode (top right).
	4.	Click Load Unpacked.
	5.	Select the frontend/ folder.

The extension will now appear in your Chrome toolbar.
⚙️ 2. How to Run the FastAPI Backend Locally (Free)

The backend provides the ML predictions and analysis features.
You can run it on your own laptop.

✅ Install dependencies
cd FastAPI
pip install -r requirements.txt

✅ Start the API server
uvicorn app:app --host 0.0.0.0 --port 8000

Your backend will now be live at:
http://localhost:8000

✅ Make sure popup.js points to your backend

In frontend/popup.js, look for: const API_URL = "http://localhost:8000";
Make sure this matches your local FastAPI URL.

Optional: Expose API to the Internet (Free)
If you want the Chrome extension to work without running locally, you can temporarily host FastAPI using ngrok. This gives you a public URL like: https://abcd1234.ngrok.io
Update API_URL in popup.js, and your extension will work globally.

🧠 ML Model Overview

This project uses:
	•	TF-IDF Vectorizer
	•	LightGBM Classifier
	•	Registered & versioned with MLflow Model Registry

The backend:
	•	Preprocesses comment text
	•	Transforms it using the stored TF-IDF vectorizer
	•	Predicts sentiment using the MLflow model
	•	Returns a clean JSON response

📁 I have two more repos which comes under the umbrella of this project:
1. yt-comment-sentiment-analysis (Main Project Repo — FastAPI Backend)

This repository contains:
	•	The FastAPI application (app.py)
	•	The Dockerfile used for containerizing the backend
	•	The CI/CD workflow (cicd.yaml)
	•	All deployment scripts used by CodeDeploy
	•	The frontend Chrome extension files (manifest.json, popup.html, popup.js)
	•	The logic for preprocessing, prediction, charting, and trend analysis

This is the repo users can clone to run the entire system locally.


2. Youtube_Comment_Analyzer (ML Experiments + Model Training)

This repository contains:
	•	All experiments with different ML algorithms
	•	Training notebooks for Logistic Regression, SVM, Naive Bayes, LightGBM, etc.
	•	MLflow tracking and logging setup
	•	Model versions & metrics logged to MLflow
	•	Code for TF-IDF vectorizer training and experiment comparisons

This repo documents how the final production model was built, tested, and selected.


📡 API Endpoints
Endpoint                                Description
/predict                                Predict sentiment for a list of comments
/predict_with_timestamps                Predict + return timestamps
/generate_chart                         Pie chart of sentiments
/generate_wordcloud                     Wordcloud image
/generate_trend_graph                   Monthly sentiment trend

📝 Notes
	•	You do not need to publish the extension to Chrome Web Store.
	•	You do not need AWS or paid hosting.
	•	Running the backend locally is enough for demonstration and portfolio use.


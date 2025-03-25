from flask import Flask, render_template, request, jsonify
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Use OpenRouter API key
openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
if not openrouter_api_key:
    raise ValueError("OPENROUTER_API_KEY is missing. Add it to .env file.")

# OpenRouter API URL
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_response", methods=["POST"])
def get_response():
    try:
        data = request.get_json()
        user_input = data.get("message", "").strip()

        if not user_input:
            return jsonify({"error": "Message cannot be empty"}), 400

        print("User Input:", user_input)

        # Send request to OpenRouter API
        response = requests.post(
            OPENROUTER_URL,
            headers={"Authorization": f"Bearer {openrouter_api_key}", "Content-Type": "application/json"},
            json={
                "model": "openai/gpt-3.5-turbo",  # You can try other models like mistral/mistral-7b
                "messages": [{"role": "user", "content": user_input}]
            }
        )

        response_data = response.json()

        if "choices" in response_data:
            ai_reply = response_data["choices"][0]["message"]["content"]
        else:
            ai_reply = "Error: No response from AI."

        print("AI Response:", ai_reply)
        return jsonify({"reply": ai_reply})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)

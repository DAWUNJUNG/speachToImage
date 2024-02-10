import json
from openai import OpenAI
from dotenv import load_dotenv
from flask import Flask, render_template, request, Response

load_dotenv(verbose=True)

client = OpenAI()

app = Flask(__name__)


@app.route("/", methods=["GET"])
def index():
    return render_template('index.html')


@app.route("/textToImage", methods=["POST"])
def textToImage():
    prompt = request.form.get('prompt')

    dallEResponse = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    return Response(
        json.dumps({
            "imageUrl": dallEResponse.data[0].url
        }),
        status=200,
        mimetype="application/json"
    )


if __name__ == '__main__':
    app.run()

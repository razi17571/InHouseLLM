import torch
from transformers import BartForConditionalGeneration, BartTokenizer, T5ForConditionalGeneration, T5Tokenizer, pipeline
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Load the BART model for summarization
bart_model_name = r"C:\Projects\InhouseLLM\models\bart-large-cnn"
bart_tokenizer = BartTokenizer.from_pretrained(bart_model_name)
bart_model = BartForConditionalGeneration.from_pretrained(bart_model_name)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
bart_model.to(device)
bart_model.eval()

# Define the new models
headline_model = T5ForConditionalGeneration.from_pretrained(r"C:\Projects\InhouseLLM\models\t5-base-en-generate-headline")
headline_tokenizer = T5Tokenizer.from_pretrained(r"C:\Projects\InhouseLLM\models\t5-base-en-generate-headline")
headline_model.to(device)
headline_model.eval()

question_generation_model = T5ForConditionalGeneration.from_pretrained(r"C:\Projects\InhouseLLM\models\t5-base-e2e-qg")
question_generation_tokenizer = T5Tokenizer.from_pretrained(r"C:\Projects\InhouseLLM\models\t5-base-e2e-qg")
question_generation_model.to(device)
question_generation_model.eval()

question_answering_pipeline = pipeline("question-answering", model=r"C:\Projects\InhouseLLM\models\roberta-base-squad2")

grammar_check_pipeline = pipeline("text-classification", model=r"C:\Projects\InhouseLLM\models\coedit-large")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/summarize', methods=['POST'])
def summarize():
    if request.method == 'POST':
        text = request.form['text']
        input_ids = bart_tokenizer.encode(text, return_tensors='pt', max_length=1024, truncation=True).to(device)
        summary_ids = bart_model.generate(input_ids, max_length=300, min_length=50, length_penalty=2.0, num_beams=4, early_stopping=True).to(device)
        summary = bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return jsonify({'summary': summary})

# @app.route('/generate_headline', methods=['POST'])
# def generate_headline():
#     if request.method == 'POST':
#         text = request.form['text']
#         input_ids = headline_tokenizer.encode(text, return_tensors='pt', max_length=1024, truncation=True).to(device)
#         headline_ids = headline_model.generate(input_ids, max_length=150, num_beams=4, early_stopping=True).to(device)
#         headline = headline_tokenizer.decode(headline_ids[0], skip_special_tokens=True)
#         return jsonify({'headline': headline})

@app.route('/generate_headline', methods=['POST'])
def generate_headline():
    if request.method == 'POST':
        text = request.form['text']
        input_ids = headline_tokenizer.encode(text, return_tensors='pt', max_length=1024, truncation=True)
        
        # Move the input data to the same device as the model
        input_ids = input_ids.to(device)

        headline_ids = headline_model.generate(input_ids, max_length=150, num_beams=4, early_stopping=True)
        headline_ids = headline_ids.to(device)  # Ensure that generated output is on the same device

        headline = headline_tokenizer.decode(headline_ids[0], skip_special_tokens=True)
        return jsonify({'headline': headline})

@app.route('/generate_questions', methods=['POST'])
def generate_questions():
    if request.method == 'POST':
        text = request.form['text']
        input_ids = question_generation_tokenizer.encode(text, return_tensors='pt', max_length=1024, truncation=True).to(device)
        questions_ids = question_generation_model.generate(input_ids, max_length=150, num_beams=4, early_stopping=True).to(device)
        questions = question_generation_tokenizer.decode(questions_ids[0], skip_special_tokens=True).split('<sep>')
        return jsonify({'questions': questions[:-2]})

@app.route('/question_answering', methods=['POST'])
def question_answering():
    if request.method == 'POST':
        question = request.form['question']
        context = request.form['context']
        answer = question_answering_pipeline(question=question, context=context)
        return jsonify({'answer': answer})

@app.route('/grammar_check', methods=['POST'])
def grammar_check():
    if request.method == 'POST':
        text = request.form['text']
        result = grammar_check_pipeline(text)
        return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)

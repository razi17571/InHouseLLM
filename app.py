import torch
from transformers import BartForConditionalGeneration, BartTokenizer, T5ForConditionalGeneration, T5Tokenizer, AutoModelForQuestionAnswering, AutoTokenizer, AutoModelForSeq2SeqLM
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

summarization_model_path = r"facebook/bart-large-cnn"
summarization_tokenizer = BartTokenizer.from_pretrained(summarization_model_path)
summarization_model = BartForConditionalGeneration.from_pretrained(summarization_model_path)
summarization_model.to(device)
summarization_model.eval()

headline_model_path = r"Michau/t5-base-en-generate-headline"
headline_tokenizer = T5Tokenizer.from_pretrained(headline_model_path)
headline_model = T5ForConditionalGeneration.from_pretrained(headline_model_path)
headline_model.to(device)
headline_model.eval()

question_generation_model_path = r"valhalla/t5-base-e2e-qg"
question_generation_tokenizer = T5Tokenizer.from_pretrained(question_generation_model_path)
question_generation_model = T5ForConditionalGeneration.from_pretrained(question_generation_model_path)
question_generation_model.to(device)
question_generation_model.eval()

question_answering_model_path = r"deepset/roberta-base-squad2"
question_answering_tokenizer = AutoTokenizer.from_pretrained(question_answering_model_path)
question_answering_model = AutoModelForQuestionAnswering.from_pretrained(question_answering_model_path)
question_answering_model.to(device)
question_answering_model.eval()

grammar_check_model_path = r"prithivida/grammar_error_correcter_v1"
grammar_check_tokenizer = AutoTokenizer.from_pretrained(grammar_check_model_path, use_auth_token = False)
grammar_check_model = AutoModelForSeq2SeqLM.from_pretrained(grammar_check_model_path, use_auth_token = False)
grammar_check_model.to(device)
grammar_check_model.eval()

@app.route('/')
def home():
    return render_template('index.html')
    
@app.route('/summarize', methods=['POST'])
def summarize():
    if request.method == 'POST':
        text = request.form['text']
        input_ids = summarization_tokenizer.encode(text, return_tensors='pt', max_length=1024, truncation=True).to(device)
        summary_ids = summarization_model.generate(input_ids, max_length=300, min_length=50, length_penalty=2.0, num_beams=4, early_stopping=True).to(device)
        summary = summarization_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return jsonify({'summary': summary})
    
@app.route('/generate_headline', methods=['POST'])
def generate_headline():
    if request.method == 'POST':
        text = request.form['text']
        input_ids = headline_tokenizer.encode(text, return_tensors='pt', max_length=1024, truncation=True).to(device)
        headline_ids = headline_model.generate(input_ids, max_length=150, num_beams=4, early_stopping=True).to(device)  
        headline = headline_tokenizer.decode(headline_ids[0], skip_special_tokens=True)
        return jsonify({'headline': headline})

@app.route('/generate_questions', methods=['POST'])
def generate_questions():
    if request.method == 'POST':
        text = request.form['text']
        input_ids = question_generation_tokenizer.encode(text, return_tensors='pt', max_length=1024, truncation=True).to(device)
        questions_ids = question_generation_model.generate(input_ids, max_length=150, num_beams=4, early_stopping=True).to(device)
        questions = question_generation_tokenizer.decode(questions_ids[0], skip_special_tokens=True).split('<sep>')
        return jsonify({'questions': questions[:-1]})

@app.route('/question_answering', methods=['POST'])
def question_answering():
    if request.method == 'POST':
        context = request.form['context']
        questions = request.form['questions'].split('\n')
        answers = []
        for question in questions:
            input_text = f"{question.strip()} [SEP] {context.strip()}"
            input_ids = question_answering_tokenizer.encode(input_text, return_tensors='pt', max_length=512, truncation = True).to(device)
            with torch.no_grad():
                output = question_answering_model(**{'input_ids': input_ids})
            answer_start = torch.argmax(output.start_logits)
            answer_end = torch.argmax(output.end_logits) + 1
            answer = question_answering_tokenizer.decode(input_ids[0, answer_start:answer_end], skip_special_tokens=True)
            answers.append({'question': question.strip(), 'answer': answer.strip()})
        return jsonify({'questionsAndAnswers': answers}) 

@app.route('/grammar_check', methods=['POST'])
def grammar_check():
    if request.method == 'POST':
        text_to_check = request.form['text']
        influent_sentences = text_to_check.split('. ')
        corrected_sentences = []
        for influent_sentence in influent_sentences:
            influent_sentence_ids = grammar_check_tokenizer.encode("gec:" + influent_sentence.lower(), return_tensors='pt').to(device)
            corrected_pred_ids = grammar_check_model.generate(influent_sentence_ids, do_sample=False, max_length=128, num_beams=7, early_stopping=True, num_return_sequences=1).to(device)
            corrected = set()
            for pred in corrected_pred_ids:
                corrected.add(grammar_check_tokenizer.decode(pred, skip_special_tokens=True).strip())               
            corrected_sentence = '. '.join(corrected)
            corrected_sentences.append(corrected_sentence.capitalize())
        corrected_text = ' '.join(corrected_sentences)
        return jsonify({'corrected_text': corrected_text})

if __name__ == '__main__':
    app.run(debug=True)

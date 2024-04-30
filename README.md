# NLP Web App

This is a Flask web application that utilizes various Natural Language Processing (NLP) models for tasks such as summarization, headline generation, question generation, question answering, and grammar checking.

## Getting Started

To get started with the application, follow these instructions:

### Prerequisites

- Python 3.x
- Flask
- PyTorch
- Transformers library from Hugging Face

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nlp-web-app.git
cd nlp-web-app
```

2. Install the required packages:

```bash
pip install -r requirements.txt
```

3. Run the Flask app:

```bash
python app.py
```

The app should now be running locally on http://127.0.0.1:5000/.

## Usage

Once the app is running, you can access it through your web browser. The following endpoints are available:

- `/summarize`: Summarizes input text.
- `/generate_headline`: Generates a headline based on input text.
- `/generate_questions`: Generates questions based on input text.
- `/question_answering`: Answers questions based on provided context.
- `/grammar_check`: Checks and corrects grammar errors in input text.

## Models Used

The app utilizes the following pretrained NLP models:

- BART for summarization (`facebook/bart-large-cnn`)
- T5 for headline generation (`Michau/t5-base-en-generate-headline`)
- T5 for question generation (`valhalla/t5-base-e2e-qg`)
- RoBERTa for question answering (`deepset/roberta-base-squad2`)
- Sequence-to-Sequence model for grammar checking (`prithivida/grammar_error_correcter_v1`)

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.


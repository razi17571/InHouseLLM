function summarizeText() {
    var userInput = document.getElementById('userInput').value;
    var resultArea = document.getElementById('resultArea');
    var loading = document.getElementById('loading');

    resultArea.innerHTML = '';
    loading.style.display = 'block';

    fetch('/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams({ 'text': userInput }).toString()
    })
    .then(response => response.json())
    .then(data => {
        loading.style.display = 'none';
        resultArea.innerHTML = '<p><strong>Summary:</strong></p><p>' + data.summary + '</p>';
    })
    .catch(error => {
        loading.style.display = 'none';
        resultArea.innerHTML = '<p>An error occurred while summarizing the text.</p>';
    });
}

function generateHeadline() {
    var userInput = document.getElementById('userInput').value;
    var resultArea = document.getElementById('resultArea');
    var loading = document.getElementById('loading');

    resultArea.innerHTML = '';
    loading.style.display = 'block';

    fetch('/generate_headline', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams({ 'text': userInput }).toString()
    })
    .then(response => response.json())
    .then(data => {
        loading.style.display = 'none';
        resultArea.innerHTML = '<p><strong>Generated Headline:</strong></p><p>' + data.headline + '</p>';
    })
    .catch(error => {
        loading.style.display = 'none';
        resultArea.innerHTML = '<p>An error occurred while generating the headline.</p>';
    });
}

function generateQuestions() {
    var userInput = document.getElementById('userInput').value;
    var resultArea = document.getElementById('resultArea');
    var loading = document.getElementById('loading');

    resultArea.innerHTML = '';
    loading.style.display = 'block';

    fetch('/generate_questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams({ 'text': userInput }).toString()
    })
    .then(response => response.json())
    .then(data => {
        loading.style.display = 'none';
        resultArea.innerHTML = '<p><strong>Generated Questions:</strong></p><ul>' + data.questions.map(q => '<li>' + q).join('') + '</ul>';
    })
    .catch(error => {
        loading.style.display = 'none';
        resultArea.innerHTML = '<p>An error occurred while generating questions.</p>';
    });
}

function questionAnswering() {
    var userInput = document.getElementById('userInput').value;
    var question = prompt("Please enter a question related to the input text:");
    if (question) {
        var resultArea = document.getElementById('resultArea');
        var loading = document.getElementById('loading');

        resultArea.innerHTML = '';
        loading.style.display = 'block';

        fetch('/question_answering', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: new URLSearchParams({ 'question': question, 'context': userInput }).toString()
        })
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            resultArea.innerHTML = '<p><strong>Answer:</strong></p><p>' + data.answer + '</p>';
        })
        .catch(error => {
            loading.style.display = 'none';
            resultArea.innerHTML = '<p>An error occurred while answering the question.</p>';
        });
    }
}

function grammarCheck() {
    var userInput = document.getElementById('userInput').value;
    var resultArea = document.getElementById('resultArea');
    var loading = document.getElementById('loading');

    resultArea.innerHTML = '';
    loading.style.display = 'block';

    fetch('/grammar_check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams({ 'text': userInput }).toString()
    })
    .then(response => response.json())
    .then(data => {
        loading.style.display = 'none';
        resultArea.innerHTML = '<p><strong>Grammar Check Result:</strong></p><p>' + data.result + '</p>';
    })
    .catch(error => {
        loading.style.display = 'none';
        resultArea.innerHTML = '<p>An error occurred while checking grammar.</p>';
    });
}

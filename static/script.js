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

// Modify the questionAnswering function
function prepareForQuestionAnswering() {
    // Show the textarea for entering questions
    document.getElementById('userQuestions').style.display = 'block';

    // Disable the button to avoid multiple clicks
    document.getElementById('questionAnsweringButton').disabled = true;

    // Change the onclick event to call the actual questionAnswering function
    document.getElementById('questionAnsweringButton').onclick = function () {
        questionAnswering();
    };
}

function toggleQuestionAnswering() {
    var questionAnsweringSection = document.getElementById('questionAnsweringSection');
    questionAnsweringSection.style.display = (questionAnsweringSection.style.display === 'none') ? 'block' : 'none';
}

function submitQuestions() {
    toggleQuestionAnswering()
    var userInput = document.getElementById('userInput').value;
    var questionInput = document.getElementById('questionInput').value;
    var resultArea = document.getElementById('resultArea');
    var loading = document.getElementById('loading');

    resultArea.innerHTML = '';
    loading.style.display = 'block';

    fetch('/question_answering_batch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams({ 'questions': questionInput, 'context': userInput }).toString()
    })
    .then(response => response.json())
    .then(data => {
        loading.style.display = 'none';
        resultArea.innerHTML = '<p><strong>Questions and Answers:</strong></p>' + formatQA(data.questionsAndAnswers);
    })
    .catch(error => {
        loading.style.display = 'none';
        resultArea.innerHTML = '<p>An error occurred while answering the questions.</p>';
    });
}

function formatQA(questionsAndAnswers) {
    return questionsAndAnswers.map(qa => '<p><strong>Question:</strong> ' + qa.question + '</p><p><strong>Answer:</strong> ' + qa.answer + '</p>').join('');
}

// Function to format questions and answers for display
function formatQuestionsAndAnswers(questionsAndAnswers) {
    var formattedHTML = '<ul>';
    questionsAndAnswers.forEach(qa => {
        formattedHTML += '<li><strong>Question:</strong> ' + qa.question + '<br><strong>Answer:</strong> ' + qa.answer + '</li>';
    });
    formattedHTML += '</ul>';
    return formattedHTML;
}


// function grammarCheck() {
//     var userInput = document.getElementById('userInput').value;
//     var resultArea = document.getElementById('resultArea');
//     var loading = document.getElementById('loading');

//     resultArea.innerHTML = '';
//     loading.style.display = 'block';

//     fetch('/grammar_check', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//         },
//         body: new URLSearchParams({ 'text': userInput }).toString()
//     })
//     .then(response => response.json())
//     .then(data => {
//         loading.style.display = 'none';
//         resultArea.innerHTML = '<p><strong>Grammar Check Result:</strong></p><p>' + data.result + '</p>';
//     })
//     .catch(error => {
//         loading.style.display = 'none';
//         resultArea.innerHTML = '<p>An error occurred while checking grammar.</p>';
//     });
// }

// Modify the handleFileUpload function in your script.js
function handleFileUpload() {
    var fileInput = document.getElementById('fileInput');
    var userInput = document.getElementById('userInput');

    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        userInput.value = e.target.result;

        // Reset the value of the file input to allow selecting the same file again
        fileInput.value = '';
    };

    if (file) {
        reader.readAsText(file);
    } else {
        // If no file is selected, clear the textarea
        userInput.value = '';
    }
}
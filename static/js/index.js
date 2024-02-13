var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var diagnosticPara = document.querySelector('.output');

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

let promptList = 0;
let stopSpeak = false;

function sendSpeech() {
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.continious = true;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function (event) {
        var speechResult = event.results[0][0].transcript.toLowerCase();

        // 중간에 말하기를 멈추기 위한 커맨드
        if (speechResult === '여기까지') {
            stopSpeak = true;
        } else {
            $('#sttContent').text($('#sttContent').text() + speechResult + '\n');
            promptList++;
        }
    }

    recognition.onend = function (event) {
        // 한문장이 끝난 뒤 종료 되기에 다음 문장을 받기 위해 이어서 시작해준다.
        if (!stopSpeak && promptList < 10) {
            recognition.start();
        }
    }
}

$('#speachIdea').on('click', function () {
    // 음성 인식 시작
    sendSpeech();

    // 버튼 전환
    $('#speachIdea').hide();
    $('#resetPage').show();
    $('#createImage').show();
});

$('#resetPage').on('click', function () {
    // 새로고침
    location.reload();
});

$('#createImage').on('click', function () {
    $('#createImage').hide();
    $('#sttContainer').hide();
    $('#loadingContainer').show();

    let promptString = '';
    $('#sttContent').val().split('\n').forEach((string) => {
        promptString += (string + ' ');
    });

    const data = {
        prompt: promptString
    };

    $.ajax({
        type: 'post',
        url: '/textToImage',
        data: data,
        dataType: 'json',
        success: function (result) {
            $('#dallEImage').attr("src", result.imageUrl);
            $('#loadingContainer').hide();
            $('#dallEResponseContainer').show();
        }
    });
});
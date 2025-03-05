const quizData = [
  {
    question: 'How old is Shah?',
    a: '18',
    b: '17',
    c: '19',
    d: '110',
    correct: 'c'
  },
  {
    question: 'What is the most used programing language?',
    a: 'Java',
    b: 'C',
    c: 'Pythan',
    d: 'JaveScript',
    correct: 'd'
  },
  {
    question: 'Who is the Paresident of US?',
    a: 'Shah Craeter',
    b: 'Donald Trump',
    c: 'Kurlus Usman',
    d: 'Kogar',
    correct: 'b'
  },
  {
    question: 'what does HTML stand for?',
    a: 'Hypertext Makup Language',
    b: 'Cascading Style Sheet',
    c: 'Json Object Notation',
    d: 'Helicopters Terminals Motorboats Lamborginis',
    correct: 'a'
  },
  {
    question: 'what year was JavaScript lanuched?',
    a: '1996',
    b: '1995',
    c: '1994',
    d: 'none of the above',
    correct: 'b'
  },
];

const quiz = document.getElementById('quiz');
const questionEl = document.getElementById('question');
const answerEls = document.querySelectorAll('.answer');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');


let currentQuiz = 0;
let score = 0;

loadQuiz();

function loadQuiz() {
  deselectAnswers();

  const currentQuizData = quizData[currentQuiz];

  questionEl.innerText = currentQuizData.question;
  a_text.innerText = currentQuizData.a;
  b_text.innerText = currentQuizData.b;
  c_text.innerText = currentQuizData.c;
  d_text.innerText = currentQuizData.d;
}

function getSelected() {
  let answer = undefined;
  
  answerEls.forEach((answerEl) => {
    if (answerEl.checked) {
      answer = answerEl.id;
    }
  });
  return answer;
}

function deselectAnswers() {
  answerEls.forEach((answerEl) => {
    answerEl.checked = false;
  });
}

submitBtn.addEventListener('click', () => {
  // check to see the answer
  const answer = getSelected();
  console.log(answer);

  if (answer) {
      
    if (answer === quizData[currentQuiz].correct) {
      score++;
    }

    currentQuiz++;
    
    if (currentQuiz < quizData.length) {
      loadQuiz();
    } else {
      // alert('You finished!');
      quiz.innerHTML = `
        <h2>You answerd correcty at ${score}/${quizData.length} question.</h2>

        <button onclick="location.reload()">Reload</button>
      `;
    }
  }
});
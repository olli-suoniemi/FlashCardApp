import * as quizService from "../../services/quizService.js";
import * as wordService from "../../services/wordService.js";

const getRandomWord = async ({ render }) => {
    const res = await quizService.getRandomQuestion();
    let answer = await quizService.getCorrectAnswers(res.id);
    
    if (answer.length > 1) {
        const random_number = Math.floor(Math.random() * answer.length);
        answer = {
            word: answer[random_number].answer,
            id: answer[random_number].word_id
        };
    } else {
        answer = {
            word: answer[0].answer,
            id: answer[0].word_id
        };
    };

    let options = ""
    if (res) {
        options = await quizService.getOptions(res.word.toLowerCase(), res.answer.toLowerCase(), res.lang);
    };
    options.push(answer)
    options.sort( () => Math.random() - 0.5);
    options.sort( () => Math.random() - 0.5);
    
    render(
        "quiz.eta", {
            word: res,
            options: options
        }
    );
};

const checkAnswer = async ({ params, render }) => {
    const correct_answer = await quizService.getCorrectAnswers(params.id);
    const user_answer  = await wordService.getAnswerInfo(params.answerId);
    let check = false;
    let feedback_answer = correct_answer[0].answer;
    let list_of_answers = [];
    
    if (correct_answer.length > 1) {
        for(var i = 0; i < correct_answer.length; i++) {
            let ele = " " + correct_answer[i].answer;
            list_of_answers.push(ele);
            if (correct_answer[i].answer === user_answer[0].answer) {
                check = true;
                break;
            };
        };
        feedback_answer = list_of_answers;
    } else {
        if (correct_answer[0].answer === user_answer[0].answer) {
            check = true;
        };
    };
    
    render("feedback.eta", {
        check: check,
        correct_answer: feedback_answer
    });
};

export {
    getRandomWord,
    checkAnswer
};
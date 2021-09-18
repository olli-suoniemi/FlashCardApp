import * as wordService from "../../services/wordService.js";
import { validasaur } from "../../deps.js";

const wordValidationRules = {
    word: [validasaur.required, validasaur.minLength(1)],
};

const answerValidationRules = {
    answer: [validasaur.required, validasaur.minLength(1)],
};

const cyrillicPattern = /^[\u0400-\u04FF]+$/;

const latinPattern = (/[a-z]/i);

const getWordData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    return {
        word: params.get("word"),
        answer: params.get("answer"),
        category: params.get("chapter")
    };
};

const getAnswerData = async (request) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    return {
        answer: params.get("answer"),
    };
};

const capitalizeFirstLetter = async (word) => {
    let capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    return capitalizedWord;
};

        /* ----------  ---------- */

const addWord = async ({ request, response, render, user }) => {    // post /words
    const wordData = await getWordData(request);
    
    let [passes, errors] = await validasaur.validate(
        wordData,
        wordValidationRules
    );

    if(!passes) {
        wordData.validationErrors = errors;
        render("words.eta", { 
            wordData: wordData,
            words: await wordService.getAllWords() });
    } else {
        user.check = wordData.category
        if (await wordService.checkIfWordExists(wordData.word.toLowerCase())) {
            // if word already exists, add only answer to this word
            if (wordData.answer) {  // (only if answer was submitted)
                const res_word = await wordService.getWordByWord(wordData.word.toLowerCase());
                
                const res_answers = await wordService.getAnswers(res_word.id);
                
                var found = false;
                // check if the word already contains this answer
                for(var i = 0; i < res_answers.length; i++) {
                    if (res_answers[i].answer.toLowerCase() === `${wordData.answer}`.toLowerCase()) {
                        found = true;
                        break;
                    };
                };
                if (!found) {
                    // the word doesn't contain this answer, add it
                    wordData.answer = await capitalizeFirstLetter(wordData.answer);
                    wordData.word = await capitalizeFirstLetter(wordData.word);
                    if (!latinPattern.test(wordData.answer)) {
                        await wordService.addAnswer(res_word.id, wordData.answer, 'rus');
                        // add the answer also as a word
                        await wordService.addWord(wordData.answer, 'rus', wordData.category);
                        // get the id of this just added word(answer)
                        const res_word_ans = await wordService.getWordByWord(wordData.answer.toLowerCase());
                        // add the answer to this word(answer)
                        await wordService.addAnswer(res_word_ans.id, wordData.word, 'fin');
                    } else {
                        await wordService.addAnswer(res_word.id, wordData.answer, 'fin');
                        // add the answer also as a word
                        await wordService.addWord(wordData.answer, 'fin', wordData.category);
                        // get the id of this just added word(answer)
                        const res_word_ans = await wordService.getWordByWord(wordData.answer.toLowerCase());
                        // add the answer to this word(answer)
                        await wordService.addAnswer(res_word_ans.id, wordData.word, 'rus');
                    };
                } else {    // the word contains this answer, redirect to /words
                    response.redirect("/words");
                };
            };
        }   // else, add the word first, then check the situation of answers
        else {    
            wordData.word = await capitalizeFirstLetter(wordData.word);
            if (!latinPattern.test(wordData.word)) {
                await wordService.addWord(wordData.word, "rus", wordData.category);
                if (wordData.answer) {  // (if answer was submitted),
                    const res_word = await wordService.getWordByWord(wordData.word.toLowerCase());
                    wordData.answer = await capitalizeFirstLetter(wordData.answer);
                    await wordService.addAnswer(res_word.id, wordData.answer, 'fin');
                    // add the answer also as a word if the answer doesn't exist
                    if (!await wordService.getWordByWord(wordData.answer)) {
                        await wordService.addWord(wordData.answer, 'fin', wordData.category);
                        // get the id of this just added word(answer)
                        const res_word_ans = await wordService.getWordByWord(wordData.answer.toLowerCase());
                        // add the answer to this word(answer)
                        await wordService.addAnswer(res_word_ans.id, wordData.word, 'rus');
                    } else {
                        // get the id of this word(answer)
                        const res_word_ans = await wordService.getWordByWord(wordData.answer.toLowerCase());
                        // add the answer to this word(answer)
                        await wordService.addAnswer(res_word_ans.id, wordData.word, 'rus');
                    }
                };
            } else {
                await wordService.addWord(wordData.word, "fin", wordData.category);
                if (wordData.answer) {  // (if answer was submitted),
                    const res_word = await wordService.getWordByWord(wordData.word.toLowerCase());
                    wordData.answer = await capitalizeFirstLetter(wordData.answer);
                    await wordService.addAnswer(res_word.id, wordData.answer, 'rus');
                    // add the answer also as a word if the answer doesn't exist
                    if (!await wordService.getWordByWord(wordData.answer)) {
                        await wordService.addWord(wordData.answer, 'rus', wordData.category);
                        // get the id of this just added word(answer)
                        const res_word_ans = await wordService.getWordByWord(wordData.answer.toLowerCase());
                        // add the answer to this word(answer)
                        await wordService.addAnswer(res_word_ans.id, wordData.word, 'fin');
                    } else {
                        // get the id of this word(answer)
                        const res_word_ans = await wordService.getWordByWord(wordData.answer.toLowerCase());
                        // add the answer to this word(answer)
                        await wordService.addAnswer(res_word_ans.id, wordData.word, 'fin');
                    }
                };
            };
        };

        response.redirect("/words");
    };
};

const getWords = async ({ render, user }) => {    // get /words
    console.log(user);
    render("words.eta", { 
        words: await wordService.getAllWords(),
        user: user 
    });
};

const getWord = async ({ params, render }) => {     // get /words/:id
    const word_id = params.id
    const res = await wordService.getWordById(word_id);
    const answers = await wordService.getAnswers(word_id);
    const correct_answers =  await wordService.getAnswers(word_id);
    let list_of_answers = []
    
    answers.forEach(element => {
        element.answer = " " + element.answer
        list_of_answers.push(element.answer)
    });
    
    if (res.lang === 'fin') {
        render("word.eta", { 
            word: await wordService.getWordById(word_id),
            words: await wordService.getRussianOptions(res.word.toLowerCase()),
            list_of_answers: list_of_answers,
            categories: await wordService.getCategories(),
            correct_answers: correct_answers
        });
    } else {
        render("word.eta", { 
            word: await wordService.getWordById(word_id),
            words: await wordService.getFinnishOptions(res.word.toLowerCase()),
            list_of_answers: list_of_answers,
            categories: await wordService.getCategories(),
            correct_answers: correct_answers
        });
    };
};

const deleteWord = async ({ params, response }) => {    // post /words/:id/delete
    const word_id = params.id;
    const word = await wordService.getWordById(word_id);
    await wordService.deleteWord(word.word.toLowerCase(), word_id);
    response.redirect("/words");
};

const addAnswer = async ({ params, response, request, render }) => {     // post /words/:id/addAnswer
    const answerData = await getAnswerData(request);
    const wordData = await wordService.getWordById(params.id);

    let [passes, errors] = await validasaur.validate(
        answerData,
        answerValidationRules
    );
    
    let answ_lang = ""
    if (wordData.lang === 'fin') {
        answ_lang = 'rus'
    } else {
        answ_lang = 'fin'
    };

    const res_answers = await wordService.getAnswers(params.id);
    // check if the word already contains this answer
    for(var i = 0; i < res_answers.length; i++) {
        if ((res_answers[i].answer).toLowerCase() === (`${answerData.answer}`).toLowerCase()) {
            passes = false;
            const answer = { reserved: "this answer already exists" };
            errors.answer = answer
            break;
        };
    };
    
    if (!passes) {
        let list_of_answers = []
        res_answers.forEach(element => {
            element.answer = " " + element.answer
            list_of_answers.push(element.answer)
        });
        answerData.validationErrors = errors;

        if (wordData.lang === 'fin') {
            render("word.eta", { 
                word: wordData,
                words: await wordService.getRussianOptions(wordData.word.toLowerCase()),
                list_of_answers: list_of_answers,
                answerData: answerData
            });
        } else {
            render("word.eta", { 
                word: wordData,
                words: await wordService.getFinnishOptions(wordData.word.toLowerCase()),
                list_of_answers: list_of_answers,
                answerData: answerData
            });
        };
    } else {

        answerData.answer = await capitalizeFirstLetter(answerData.answer);
        wordData.word = await capitalizeFirstLetter(wordData.word);

        const word_id = params.id;

        if(!await wordService.checkIfWordExists(answerData.answer.toLowerCase())) {
            await wordService.addWord(answerData.answer, answ_lang, wordData.category);
            const ansData = await wordService.getWordByWord(answerData.answer.toLowerCase());
            await wordService.addAnswer(ansData.id, wordData.word, wordData.lang)
            await wordService.addAnswer(word_id, answerData.answer, answ_lang);
        } else {
            const ansData = await wordService.getWordByWord(answerData.answer.toLowerCase());
            await wordService.addAnswer(ansData.id, wordData.word, wordData.lang)
            await wordService.addAnswer(word_id, answerData.answer, answ_lang);
        };

        response.redirect(`/words/${word_id}`);
    };
};

const changeCategory = async ({ response, request, params }) => {   // post /words/:id/changeCategory
    const body = request.body({ type: "form" });
    const form_params = await body.value;
    const category = form_params.get("category");
    if (category) {
        wordService.changeCategory(params.id, category);
    } 
    response.redirect(`/words/${params.id}`);
};

const editWord = async ({ response, request, params }) => {     // post /words/:id/editWord
    const body = request.body({ type: "form" });
    const form_params = await body.value;
    let new_word = form_params.get("word");
    if (new_word) {
        let old_word = await wordService.getWordById(params.id);
        new_word = await capitalizeFirstLetter(new_word);
        old_word = await capitalizeFirstLetter(old_word.word);
        await wordService.editAnswer(new_word, old_word);
        await wordService.editWord(params.id, new_word);
    };
    response.redirect(`/words/${params.id}`);
};

export { 
    addWord, 
    getWords, 
    getWord,
    deleteWord,
    addAnswer,
    changeCategory,
    editWord,
};

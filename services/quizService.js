import { executeQuery } from "../database/database.js";

const getRandomQuestion = async() => {
    const result = await executeQuery(
        `SELECT words.id, words.word, words.lang, answers.word_id, answers.answer FROM words INNER JOIN answers ON (words.id = answers.word_id)
        ORDER BY RANDOM() 
        LIMIT 1`
    );
    if (result) {
        return result.rows[0];
    } else {
        return false
    }
};

const getOptions = async(word, answer, lang) => {
    const result = await executeQuery(
        `select distinct word, id
        from
        (SELECT DISTINCT ON (answer) answers.answer, words.id, answers.word_id, words.word 
        FROM words INNER JOIN answers ON (words.id = answers.word_id) 
        WHERE LOWER(answer) != $1 AND LOWER(word) != $1 AND LOWER(word) != $2 AND answers.lang = $3
        LIMIT 3) t`,
        word, answer, lang
    );

    if(result) {
        return result.rows
    };
};

const getCorrectAnswers = async(id) => {
    const result = await executeQuery(
        "SELECT * FROM answers WHERE word_id = $1",
            id
    );

    if (result) {
        return result.rows;
    };
};

export {
    getRandomQuestion,
    getOptions,
    getCorrectAnswers
};
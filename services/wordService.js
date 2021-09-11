import { executeQuery } from "../database/database.js";

const addWord = async (word, lang, ctg) => {
  await executeQuery(
    `INSERT INTO words
      (word, lang, category)
        VALUES ($1, $2, $3)`,
    word, lang, ctg
  );
};

const getAllWords = async () => {
  const finRes = await getFinnishWords();
  const rusRes = await getRussianWords();

  const data = {
    finnish_words: finRes,
    russian_words: rusRes
  };

  return data;
};

const getRussianOptions = async(word) => {
  const res = await executeQuery(
    `SELECT * FROM words 
      WHERE lang = 'rus' 
        AND WORD NOT IN(
          SELECT answer 
            FROM words 
              INNER JOIN answers ON (words.id = answers.word_id) 
                WHERE LOWER(word) = $1)`,
                word
  );

  return res.rows
};

const getFinnishOptions = async(word) => {
  const res = await executeQuery(
    `SELECT * FROM words 
      WHERE lang = 'fin' 
        AND WORD NOT IN(
          SELECT answer 
            FROM words 
              INNER JOIN answers ON (words.id = answers.word_id) 
                WHERE LOWER(word) = $1)`,
                word
  );

  return res.rows
};

const getFinnishWords = async () => {
  const res = await executeQuery(
      "SELECT * FROM words WHERE lang = 'fin' ORDER BY word;"
  );

  return res.rows;
};

const getRussianWords = async () => {
  const res = await executeQuery(
      "SELECT * FROM words WHERE lang = 'rus' ORDER BY word;"
  );

  return res.rows;
};

const checkIfWordExists = async (word) => {
  const res = await executeQuery(
      "SELECT EXISTS(SELECT 1 FROM words WHERE LOWER(word) = $1)",
        word
  );
  
  return res.rows[0].exists;
};

const getWordById = async ( word_id ) => {
  const res = await executeQuery(
      "SELECT * FROM words WHERE id = $1",
      word_id
  );
  
  if (res) {
    return res.rows[0];
  } else {
    return false
  };
};

const getWordByWord = async ( word ) => {
  const res = await executeQuery(
      "SELECT * FROM words WHERE LOWER(word) = $1",
      word
  );
  
  if (res) {
    return res.rows[0];
  } else {
    return false
  };
};

const deleteWord = async (word, word_id) => {
  await executeQuery(
    "DELETE FROM answers WHERE word_id = $1;",
      word_id
  );
  await executeQuery(
    "DELETE FROM answers WHERE LOWER(answer) = $1;",
      word
  );
  await executeQuery(
    "DELETE FROM words WHERE id = $1;",
      word_id
  );
};

const getLang = async (word_id) => {
  const res = await executeQuery(
    "SELECT * FROM words WHERE id = $1;",
      word_id
  );

  return res.rows[0];
};

const addAnswer = async (word_id, answer, lang) => {
  await executeQuery(
    "INSERT INTO answers (word_id, answer, lang) VALUES ($1, $2, $3) ;",
      word_id, answer, lang
  );
};

const getAnswers = async (word_id) => {
  const res = await executeQuery(
    `SELECT answer FROM words INNER JOIN answers ON (words.id = answers.word_id)
      WHERE word_id = $1`,
        word_id
  );
  
  if (res) {
    return res.rows;
  } else {
    return false
  };
};

const getCategories = async () => {
  const res = await executeQuery(
    "SELECT DISTINCT category FROM words"
  );

  if(res) {
    return res.rows;
  };
  
};

const changeCategory = async(id, category) => {
  await executeQuery(
    `UPDATE words
    SET category = $1
    WHERE id = $2;`,
      category, id
  );

  await executeQuery(
    `UPDATE words
    SET category = $1
    FROM answers
    WHERE words.word = answers.answer AND answers.word_id = $2;`,
      category, id
  );
};

const getAnswerInfo = async (word_id) => {
  const res = await executeQuery(
    `SELECT * FROM words INNER JOIN answers ON (words.id = answers.word_id)
      WHERE word_id = $1`,
        word_id
  );
  
  if (res) {
    return res.rows;
  } else {
    return false
  };
};


export { 
  addWord,
  getAllWords,
  getFinnishWords,
  getRussianWords,
  checkIfWordExists,
  getWordById,
  getWordByWord,
  deleteWord,
  getLang,
  addAnswer,
  getRussianOptions,
  getFinnishOptions,
  getAnswers,
  getCategories,
  changeCategory,
  getAnswerInfo
};
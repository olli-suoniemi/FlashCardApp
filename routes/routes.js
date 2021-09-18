import { Router } from "https://deno.land/x/oak@v7.7.0/mod.ts";
import * as mainController from "./controllers/mainController.js";
import * as wordController from "./controllers/wordController.js";
import * as quizController from "./controllers/quizController.js"
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as logoutController from "./controllers/logoutController.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/words", wordController.getWords);
router.post("/words", wordController.addWord);

router.get("/words/:id", wordController.getWord);
router.post("/words/:id/delete", wordController.deleteWord);

router.post("/words/:id/addAnswer", wordController.addAnswer);
router.post("/words/:id/changeCategory", wordController.changeCategory);
router.post("/words/:id/editWord", wordController.editWord);

router.get("/quiz", quizController.getRandomWord);
router.post("/quiz/:id/answer/:answerId", quizController.checkAnswer);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

router.get("/auth/logout", logoutController.logout);
export { router };
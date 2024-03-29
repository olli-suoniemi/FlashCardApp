import { Application, HttpServerStd, OakSession } from "./deps.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import renderMiddleware from "./middlewares/renderMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";
import { router } from "./routes/routes.js";

const app = new Application({
  serverConstructor: HttpServerStd,
});
new OakSession(app);

app.use(errorMiddleware);
app.use(authMiddleware);
app.use(serveStaticMiddleware);
app.use(renderMiddleware);
app.use(router.routes());

if (import.meta.main) {
  const port = Deno.env.get("PORT") || 7777;
  console.log(`Starting server on port ${port}`);
  await app.listen({ port: Number(port) });
}

export { app };
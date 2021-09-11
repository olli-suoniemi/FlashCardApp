const restrictedPaths = ["/quiz", "/words"];
const adminPaths = ["/words"]

const authMiddleware = async (context, next) => {
  const user = await context.state.session.get("user");

  if (user) {
    context.user = user;
  }

  if (!user && restrictedPaths.some((path) =>
      context.request.url.pathname.startsWith(path))) {
        context.response.redirect("/");
  } if (user && adminPaths.some((path) => context.request.url.pathname.startsWith(path))) {
      if(user.roles.some(e => e.name === 'ADMIN')) {
        await next();
      } else {
        context.response.redirect("/");
      }
  } else {
    await next();
  }
};

export { authMiddleware };
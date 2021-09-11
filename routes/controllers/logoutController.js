const logout = async ({response, state}) => {
    await state.session.set("user", null);
    response.redirect("/");
};
  
export {
    logout
}
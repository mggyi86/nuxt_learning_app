export default context => {
  // if (process.client) {
    context.store.dispatch('initAuth', context.req);
  // }
}

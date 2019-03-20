export default context => {
  if (!context.store.getters.isAuthenticated) {
    context.redirect('/admin/auth');
  }
}
// export default function(context) {
//   console.log('test')
// }


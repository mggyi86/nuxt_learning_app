<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost"  @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import AdminPostForm from '@/components/Admin/AdminPostForm'
export default {
  layout: 'admin',
  middleware: [ 'check-auth', 'auth' ],
  components: {
    AdminPostForm
  },
  data() {
    return {
      // loadedPost: {
      //   author: 'Maximilian',
      //   title: 'My awesome Post',
      //   content: 'Super amazing, thanks for that!',
      //   thumbnailLink: 'https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg'
      // }
    }
  },
  asyncData(context) {
    // return context.$axios.get(
    //   process.env.baseUrl + '/posts/' + context.params.postId + '.json'
    //   )
    return context.app.$axios.get(
      '/posts/' + context.params.postId + '.json'
      )
      .then(res => {
        return {
          loadedPost: { ...res.data, id: context.params.postId }
        }
      })
      .catch(e => context.error(e));
  },
  methods: {
    onSubmitted(editedPost) {
      // this.$axios.put(
      //   'https://nuxt-blog-979c8.firebaseio.com/posts/' + this.$route.params.postId + '.json', editedPost
      // )
      // .then(res => {
      //   this.$router.push('/admin');
      // })
      // .catch(e => context.error(e))
      this.$store.dispatch('editPost', editedPost)
        .then(() => {
          this.$router.push('/admin');
        })
    }
  }
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>



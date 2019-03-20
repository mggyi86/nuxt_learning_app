<template>
  <div class="admin-new-post-page">
    <section class="new-post-form">
      <AdminPostForm  @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import AdminPostForm from '@/components/Admin/AdminPostForm'

export default {
  layout: 'admin',
  middleware: ['auth'],
  components: {
    AdminPostForm
  },
  methods: {
    onSubmitted(postData) {
    //   this.$axios.post('https://nuxt-blog-979c8.firebaseio.com/posts.json', {
    //       ...postData,
    //       updatedDate: new Date()
    //     })
    //     .then(result => {
    //       this.$router.push('/admin');
    //     })
    //     .catch(e => console.log(e));
      this.$store.dispatch('addPost', postData)
        .then(() => {
          this.$router.push('/admin')
        });
    }
  }
}
</script>

<style scoped>
.new-post-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .new-post-form {
    width: 500px;
  }
}
</style>



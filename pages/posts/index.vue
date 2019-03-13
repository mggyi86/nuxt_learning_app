<template>
  <div class="posts-page">
    <PostList :posts="loadedPosts" />
  </div>
</template>

<script>
import PostList from '@/components/Posts/PostList'

export default {
  components: {
    PostList
  },
  computed: {
    loadedPosts() {
      return this.$store.getters.loadedPosts
    }
  }
  // fetch(context) {
  //   if (context.store.state.loadedPosts > 0) {
  //     return null;
  //   }
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve({
  //         loadedPosts: [
  //           {
  //             id: '1',
  //             title: 'First Post',
  //             previewText: 'This is our first post!',
  //             thumbnail: 'https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg'
  //           },
  //           {
  //             id: '2',
  //             title: 'Second Post',
  //             previewText: 'This is our second post!',
  //             thumbnail: 'https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg'
  //           },
  //         ]
  //       });
  //     }, 1500)
  //   })
  //   .then(data => {
  //     // return data
  //     context.store.commit('setPosts', data.loadedPosts)
  //   }).catch(e => {
  //     context.error(new Error())
  //   });
  // },
  // created() {
    // this.$store.dispatch('setPosts', this.loadedPosts);
    // console.log(this.$store.getters.loadedPosts);
  // }
}
</script>

<style scoped>
.posts-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>


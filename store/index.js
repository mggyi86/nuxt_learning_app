import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      },
      addPost(state, post) {
        state.loadedPosts.push(post);
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        );
        state.loadedPosts[postIndex] = editedPost;
      }
    },
    actions: {
      nuxtServerInit(vuexConText, context) {
        return context.$axios.get('https://nuxt-blog-979c8.firebaseio.com/posts.json')
          .then(res => {
            const postArray = []
            for (const key in res.data) {
              postArray.push({ ...res.data[key], id: key })
            }
            vuexConText.commit('setPosts', postArray)
          })
          .catch(e => context.error(e));
        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     vuexConText.commit('setPosts', [
        //       {
        //         id: '1',
        //         title: 'First Post',
        //         previewText: 'This is our first post!',
        //         thumbnail: 'https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg'
        //       },
        //       {
        //         id: '2',
        //         title: 'Second Post',
        //         previewText: 'This is our second post!',
        //         thumbnail: 'https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg'
        //       },
        //     ])
        //     resolve();
        //   }, 1500);
        // })
      },
      setPosts(vuexConText, posts) {
        vuexConText.commit('setPosts', posts)
      },
      addPost(vuexConText, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };

        return this.$axios.post('https://nuxt-blog-979c8.firebaseio.com/posts.json', createdPost)
          .then(result => {
            vuexConText.commit('addPost', { ...createdPost, id: result.data.name })
          })
          .catch(e => console.log(e));
      },
      editPost(vuexConText, editedPost) {
        return this.$axios.put(
            'https://nuxt-blog-979c8.firebaseio.com/posts/' + editedPost.id + '.json', editedPost
          )
          .then(res => {
            // console.log(res);
            vuexConText.commit('editPost', editedPost)
          })
          .catch(e => console.log(e));
      },
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      }
    }
  })
}

export default createStore;


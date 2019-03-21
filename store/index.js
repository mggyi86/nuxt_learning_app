import Vuex from 'vuex'
import Cookie from 'js-cookie'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
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
      },
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null
      }
    },
    actions: {
      nuxtServerInit(vuexConText, context) {
        // return context.$axios.get(process.env.baseUrl + '/posts.json')
        return context.app.$axios.get('/posts.json')
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
      authenticateUser(vuexConText, authData) {
        let authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
          process.env.fbAPIKey
        if (!authData.isLogin) {
          authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
            process.env.fbAPIKey
        }
        return this.$axios.post(authUrl, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        })
        .then(result => {
          vuexConText.commit('setToken', result.data.idToken);
          localStorage.setItem('token', result.data.idToken);
          localStorage.setItem(
            'tokenExpiration',
            new Date().getTime() + (Number.parseInt(result.data.expiresIn) * 1000)
          );
          Cookie.set('jwt', result.data.idToken);
          Cookie.set(
            'expirationDate',
            new Date().getTime() + (Number.parseInt(result.data.expiresIn) * 1000)
          );
          // this.$axios
          // .post('http://localhost:3000/api/track-data', {data: 'Authenticated!'});
          return this.$axios.post('http://localhost:3000/api/track-data', {data: 'Authenticated!'})
          // vuexConText.dispatch('setLogoutTimer', result.data.expiresIn * 1000);
        })
        .catch(e => {
          console.log(e);
        });
      },
      // setLogoutTimer(vuexConText, duration) {
      //   setTimeout(() => {
      //     vuexConText.commit('clearToken')
      //   }, duration)
      // },
      initAuth(vuexConText, req) {
        let token;
        let expirationDate;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('jwt='));
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split('=')[1];
          expirationDate = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('expirationDate='))
            .split('=')[1];
        } else {
          token = localStorage.getItem('token');
          expirationDate = localStorage.getItem('tokenExpiration');
        }
        if (new Date().getTime() > +expirationDate || !token) {
          // vuexConText.commit('clearToken')
          vuexConText.dispatch('logout');
          return;
        }
        // vuexConText.dispatch('setLogoutTimer', +expirationDate - new Date().getTime());
        vuexConText.commit('setToken', token);
      },
      logout(vuexConText) {
        vuexConText.commit('clearToken');
        Cookie.remove('jwt');
        Cookie.remove('expirationDate');
        if (process.client) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
        }
      },
      addPost(vuexConText, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };

        return this.$axios.post('https://nuxt-blog-979c8.firebaseio.com/posts.json?auth=' + vuexConText.state.token,
          createdPost)
        // return this.$axios.post('/posts.json', createdPost)
          .then(result => {
            vuexConText.commit('addPost', { ...createdPost, id: result.data.name })
          })
          .catch(e => console.log(e));
      },
      editPost(vuexConText, editedPost) {
        return this.$axios.put(
            'https://nuxt-blog-979c8.firebaseio.com/posts/' + editedPost.id + '.json?auth=' + vuexConText.state.token,
            editedPost
          )
        // return this.$axios.put(
        //     '/posts/' + editedPost.id + '.json', editedPost
        //   )
          .then(res => {
            // console.log(res);
            vuexConText.commit('editPost', editedPost)
          })
          .catch(e => console.log(e));
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return state.token != null;
      }
    }
  })
}

export default createStore;


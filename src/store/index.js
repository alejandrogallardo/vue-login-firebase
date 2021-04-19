import { createStore } from 'vuex'
import router from '../router'

export default createStore({
  state: {
    tareas: [],
    tarea: {
      id: '',
      nombre: '',
      categorias: [],
      estado: '',
      numero: 0
    },
    user: null
  },
  mutations: { // las mutaciones son para modificar el state
    setUser(state, payload){
      state.user = payload
    },
    cargar(state, payload) {
      state.tareas = payload
    },
    set(state, payload) {
      state.tareas.push(payload)
    },
    eliminar(state, payload) {
      state.tareas = state.tareas.filter(item => item.id !== payload)
    },
    tarea(state, payload) {
      if (!state.tareas.find(item => item.id === payload)) {
        router.push('/')
        return
      }
      state.tarea = state.tareas.find(item => item.id === payload)
    },
    update(state, payload) {
      state.tareas = state.tareas.map(item => item.id === payload.id ? payload : item)
      router.push('/')
    }
  },
  actions: { // esto se captura desde la vista
    cerrarSesion({commit}) {
      commit('setUser', null)
      router.push('/ingreso')
      localStorage.removeItem('uservue')
    },
    async ingresoUsuario({commit}, usuario) {
      console.log(usuario);
      try {
        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCl8ArskZuXQ-OwinGkj8uyKJqz9S5G7dk', {
          method: 'POST',
          body: JSON.stringify({
            email: usuario.email,
            password: usuario.password,
            returnSecureToken: true
          })
        })  
        const userDB = await res.json()
        console.log('Login --> ', userDB);
        if (userDB.error) {
          console.log(userDB.error);
          return
        }
        commit('setUser', userDB)
        router.push('/');
        localStorage.setItem('uservue', JSON.stringify(userDB))
      } catch (error) {
        console.log(error);
      }
    },
    async registrarUsuario({commit}, usuario) {
      try {
        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' , {
          method: 'POST',
          body: JSON.stringify({
            email: usuario.email,
            password: usuario.password,
            returnSecureToken: true
          })
        })
        const userDB = await res.json()
        console.log(userDB);
        if (userDB.error) {
          console.log(userDB.error);
          return
        }
        commit('setUser', userDB)
        router.push('/')
        localStorage.setItem('uservue', JSON.stringify(userDB))
      } catch (error) {
        commit('setUser', null);
      }
      console.log(usuario);
    },
    async cargarLocalStorage({ commit, state }) {
      if(localStorage.getItem('uservue')){
        commit('setUser', JSON.parse(localStorage.getItem('uservue')))
      }else{
        return 
      }
      try {
        const res = await fetch(`https://vue-crude-uno-default-rtdb.firebaseio.com/tareas/${state.user.localId}.json?auth=${state.user.idToken}`)
        const dataDB = await res.json()
        const arrayTareas = []
        for (let id in dataDB){
          arrayTareas.push(dataDB[id])
        }
        commit('cargar', arrayTareas)

      } catch (error) {
        console.log(error)
      }
    },
    async setTareas({ commit, state }, tarea) {
      try {
        const res = await fetch(`https://vue-crude-uno-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tarea)
        })

        const dataDB = await res.json()
        console.log(dataDB)

      } catch (error) {
        console.log(error)
      }
      commit('set', tarea)
    },
    async deleteTareas({ commit, state }, id) {
      try {
        await fetch(`https://vue-crude-uno-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${id}.json?auth=${state.user.idToken}`, {
          method: 'DELETE',
        })
        commit('eliminar', id)
      } catch (error) {
        console.log(error)
      }
    },
    setTarea({ commit }, id) {
      commit('tarea', id)
    },
    async updateTarea({ commit, state }, tarea) {
      try {
        const res = await fetch(`https://vue-crude-uno-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`, {
          method: 'PATCH',
          body: JSON.stringify(tarea)
        })
        const dataDB = await res.json()
        commit('update', dataDB)
      } catch (error) {
        console.log(error)
      }
    }
  },
  getters: {
    usuarioAutenticado(state) { // !! si existe regresa true sino false
      return !!state.user
    }
  },
  modules: {
  }
})

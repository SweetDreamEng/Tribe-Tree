import Vuex from 'vuex'

import Vue from 'vue'
Vue.use(Vuex)


export default ()=>{
    return new Vuex.Store({
        state: {
            authUser: null,
            dashboard: null
        },
        mutations: {
            SET_USER(state, user){
                state.authUser = user
            },
            SET_DASHBOARD_DATA(state, data){
                state.dashboard = data
            }
        },
        getters: {
    
        },
        actions: {
            nuxtServerInit(vuexContext, content){ //Set user on init
                if (content.req.session && content.req.session.authUser){
                    vuexContext.commit('SET_USER', content.req.session.authUser)
                }
            },
            //Auth actions:
            async login ({commit}, {username, password}){
                const response = await this.$axios.$post('/api', {call: 'logIn', payload: {username: username, password: password}})
                if(response.success){
                    commit('SET_USER', response.authUser)
                }else{
                    commit('SET_USER', null)
                }
            },
            async logout ({ commit }) {
                const response = await this.$axios.$post('/api', {call: 'logOut'})
                commit('SET_USER', null)
                this.$router.push('/')
            },
            async signup({commit}, {username, password}){
                const result = await this.$axios.$post('/api', {call: 'signUp', payload: {username: username, password: password}})
            },
            getDashboardData({commit}){

            }
            
        }
    })
} 
    // 
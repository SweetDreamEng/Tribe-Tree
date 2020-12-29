<template>
    <div class="reset">
        <form @submit.prevent="submit">
            <input type="text" placeholder="New Password" v-model="password">
            <input type="submit">
        </form>
    </div>
</template>

<script>
export default {
    layout: 'home',
    data(){
        return{
            password: ''
        }
    },
    methods: {
        submit(){
            this.$axios.post('/api', {call: 'resetPassword', payload: {token: this.$route.query.t, password: this.password}}).then((response)=>{
                console.log(response)
            }).catch((err)=>{
                console.log(err)
            })
        }
    }
}
</script>

<style>

</style>

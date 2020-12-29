<template>
    <div class="reset">
        <form @submit.prevent="submit" v-if="!submitted">
            <input type="email" placeholder="email" v-model="email" required>
            <input type="submit">
        </form>
        <div v-else>
            If an account with the email {{email}} exists than a reset link will have been sent
        </div>
    </div>
</template>

<script>
export default {
    layout: 'home',
    data(){
        return{
            submitted: false,
            email: ''
        }
    },
    methods: {
        submit(){
            this.$axios.post('/api', {call: 'lostPassword', payload: {email: this.email}}).then((response)=>{
                console.log(response)
                this.submitted = true
            }).catch((err)=>{
                console.log(err)
            })
        }
    }
}
</script>

<style>

</style>

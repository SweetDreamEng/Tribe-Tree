<template>
    <div class="in flex flex-col justify-center w-full content-center l">
        <h1 class="page-title">{{$t('signin')}}</h1>
        <form @submit.prevent="submit" class="flex flex-col max-w-md w-full mx-auto">
            <input class="inp text-2xl bg-grey" type="text" :placeholder="$t('username')" v-model="username">
            <input class="inp text-2xl bg-grey" type="password" :placeholder="$t('password')" v-model="password">
            <input class="btn submit" type="submit" :value="$t('submit')">
            <nuxt-link to="signin/up" class="text-theme underline font-semibold">{{$t('signupLink')}}</nuxt-link>
        </form>
    </div>
</template>

<i18n lang="yaml">
{
  "en": {
    username: 'Username',
    password: 'Password',
    signin: 'Sign In',
    submit: 'Submit',
    signupLink: 'Dont have an account?    Sign up'
  },
  "ar": {
    username: 'اسم المستخدم',
    password: 'كلمه السر',
    signin: 'تسجيل الدخول',
    submit: 'إرسال',
    signupLink: 'ليس لديك حساب؟ سجل',
  },
  "ur": {
   username: 'صارف نام',
    password: 'پاس ورڈ',
    signin: 'سائن ان',
    submit: 'جمع کرائیں',
    signupLink: 'کیا آپ کا اکاؤنٹ نہیں ہے؟ سائن اپ'
  }
}
</i18n>

<script>
export default {
    layout: 'home',
    data(){
        return{
            username: '',
            password: ''
        }
    },
    methods: {
        submit(){
            this.$store.dispatch('login', {username: this.username, password: this.password}).then((res)=>{
                if(this.$store.state.authUser){
                    if(this.$store.state.authUser.type == 'Admin'){
                        this.$router.push('/admin/tribes')
                    }else{
                        this.$router.push('/dashboard')
                    }
                }
            })
        }
    }
}
</script>

<style>
</style>

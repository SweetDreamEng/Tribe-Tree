<template>
    <div class="up flex flex-col justify-center w-full content-center l">
        <h1 class="page-title">{{$t('signup')}}</h1>
        <form @submit.prevent="submit" class="flex flex-col max-w-md w-full mx-auto">
            <input class="inp text-2xl bg-grey" type="text" :placeholder="$t('username')" v-model="username">
            <input class="inp text-2xl bg-grey" type="password" :placeholder="$t('password')" v-model="password">
            <input class="inp text-2xl bg-grey" type="password" :placeholder="$t('confirmPassword')" v-model="password2">
            <input type="submit" class="btn submit" :value="$t('submit')">
            <nuxt-link class="text-theme underline font-semibold" to="/signin">{{$t('signin')}}</nuxt-link>
        </form>
    </div>
</template>

<i18n lang="yaml">
{
  "en": {
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm password',
    signin: 'Sign In',
    submit: 'Submit',
    signup: 'Sign Up'
  },
  "ar": {
    username: 'اسم المستخدم',
    password: 'كلمه السر',
    confirmPassword: 'تأكيد كلمة المرور',
    signin: 'تسجيل الدخول',
    submit: 'إرسال',
    signup: 'سجل'
  },
  "ur": {
   username: 'صارف نام',
    password: 'پاس ورڈ',
    confirmPassword: 'پاس ورڈ کی تصدیق کریں',
    signin: 'سائن ان',
    submit: 'جمع کرائیں',
    signup: 'سائن اپ'
  }
}
</i18n>

<script>
export default {
    layout: 'home',
    data(){
        return{
            username: '',
            password: '',
            password2: ''
        }
    },
    methods: {
        submit(){
            this.$store.dispatch('signup', {username: this.username, password: this.password}).then(()=>{
                this.$router.push('/signin')
            })
        }
    }
}
</script>

<style>

</style>

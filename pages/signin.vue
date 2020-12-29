<template>
    <div class="signIn h-screen text-center flex justify-center content-center">
        <!-- In/Up Nav here -->

        <nuxt-child/>
    </div>
</template>

<script>
export default {
    layout: 'home'
}
</script>

<style>
    .signIn{
        background: url('../assets/img/bg3-min.jpg');
        background-size: cover;
        background-position: 50% 50%;
    }
    .page-title{
        margin-bottom: 50px;
    }
    .btn.submit{
        margin: 50px 0;
    }
    input{
        margin: 20px 0;
    }
</style>

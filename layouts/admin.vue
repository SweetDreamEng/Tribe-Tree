<template>
    <div class="admin h-screen w-screen">
        <div class="adminNav font-normal text-2xl text-theme hover:text-theme2">
            <nuxt-link to="/admin/tribes">Tribes</nuxt-link>
            <!-- <nuxt-link to="/admin/users">Users</nuxt-link> -->
            <nuxt-link to="/admin/tree">Tree</nuxt-link>
            <nuxt-link to="/admin/library">Library</nuxt-link>
            <nuxt-link to="/admin/blog">Blog</nuxt-link>
            <!-- <nuxt-link to="/admin/settings">Settings</nuxt-link> -->
            <hr>
        </div>
        <a class="logout font-semibold text-theme cursor-pointer" @click="logout">Log Out</a>
        <nuxt/>
    </div>
</template>
<script>
export default {
    middleware: 'routeValidation',
    methods: {
        logout(){
            this.$store.dispatch('logout').then(()=>{
                this.$router.push('/')
            })
        }
    }
}
</script>

<style lang="scss">
body{ font-family: 'Open Sans', sans-serif;}
  .t1 table {
    width: 100%;
    text-align: center;
 }
  .t1 table th, .t1 table td {
    padding: 15px;
 }
  .t1 table th {
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
 }
  .t1 table tr {
    @apply cursor-pointer;
 }
  .t1 table tr:hover {
    @apply bg-lgrey;
 }
    .adminNav{
        margin: 0 50px;
        margin-top: 42px;
        a{
            margin-right: 20px;
        }
        .nuxt-link-active{
            @apply font-semibold cursor-default
        }
        hr{
            margin-top: 10px;
            @apply opacity-25
        }
    }
    .logout{
        position: fixed;
        right: 50px;
        top: 50px;
    }
</style>




<template>
    <!-- Class used for displaying a different font when using arabic -->
    <div class="home h-full w-full" :class="($i18n.locale == 'ar' || $i18n.locale == 'ur') ? 'text-ar' : ''">
        <LangSwitch :r="routeClass"></LangSwitch>
        <SideNav v-if="$route.name!='index'" :r="routeClass"></SideNav>
        
        <nuxt/>
    </div>
</template>
<script>
import SideNav from '@/components/SideNav.vue'
import LangSwitch from '@/components/LangSwitch.vue'
export default {
    components: {
        SideNav,
        LangSwitch
    },
    middleware: 'routeValidation',
    computed: {
        routeClass(){
            return `h-${this.$route.name}`
        }
    }
}
</script>
<style>
 body{
     font-family: 'Open Sans', sans-serif;
 }
</style>

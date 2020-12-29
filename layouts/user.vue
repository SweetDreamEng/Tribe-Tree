<template>
    <!-- user dashboard - not used -->
    <div class="user h-screen w-screen" :class="($i18n.locale == 'ar') ? '.text-ar' : ''">
        <h3>//User nav</h3>
        <nuxt/>
    </div>
</template>
<script>
export default {
    middleware: 'routeValidation'
}
</script>


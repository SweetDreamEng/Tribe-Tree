<template>
    <div class="user">
        <h1>User dashboard</h1>
        <button @click="$store.dispatch('logout')">Log Out</button>
    </div>
</template>

<script>
export default {
    layout: 'user'
}
</script>
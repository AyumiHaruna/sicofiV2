<template>
    <div class="container-fluid">
        <Menu />
        <nuxt />
    </div>
</template>

<script>
import Menu from '../components/general/Menu.vue';

export default {
    components: {
        Menu
    },
    head: {
        script: [
            {
                hid: 'stripe', 
                src: 'https://kit.fontawesome.com/035f9caf7c.js', 
                defer: true
            }
        ]
    }

}
</script>

<style>
</style>
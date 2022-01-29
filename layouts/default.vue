<template>
    <div class="container-fluid p-0">
        
        <Menu />

        <SubNav />

        <nuxt />
    </div>
</template>

<script>
import Menu from '@/components/general/Menu.vue';
import SubNav from '@/components/general/SubNav.vue';


export default {
    components: {Menu, SubNav },
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
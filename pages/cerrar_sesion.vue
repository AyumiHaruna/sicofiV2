<template>
    <div>
        <h2>Cerrando Sessión</h2>
        <Loader v-if="$store.state.isLoading" />
    </div>  
</template>

<script>
import Loader from '../components/general/Loader.vue';

export default {
    name: 'cerrar_sesion',
    components: {
        Loader
    },
    created() {
        this.$store.dispatch('setIsLoading', true);           

        setTimeout( ()=>{
            this.$store.dispatch('setIsLoading', false);    
            if(process.client){
                localStorage.clear();
            }            
            this.$router.push('/');        
            // window.location.href = "/";
        }, 1500);        
    }
}
</script>

<style>

</style>
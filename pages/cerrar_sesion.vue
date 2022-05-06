<template>
    <div class="row">
        <div class="col-12">

        </div>
    </div>
</template>

<script>
import Loader from '../components/general/Loader.vue';
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'cerrar_sesion',
    components: { Loader },
    mixins: [ GlobalFunctions ],
    mounted() {
        
        this.showLoader('Cerrando sesión');

        setTimeout( ()=>{
            if(process.client){
                localStorage.clear();
            }            
            this.hideLoader();
            this.$router.push('/');        
        }, 2000);        
    }
}
</script>

<style>

</style>
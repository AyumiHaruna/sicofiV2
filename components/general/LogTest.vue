<template>
    <div></div>
</template>

<script>
export default {
    name: 'LogTest',
    methods: {
        // test if user has session
        hasSesion() {
            console.log('logtest');
            if( !localStorage.getItem('user') ){
                alert( 'No se encontró una sesión activa!, se te redireccionará al Inicio');
                window.location.href = "/";
            }
        },
        // test if user has required level
        hasLevel( reqLvl ) {
            if( localStorage.getItem('level') > reqLvl ){
                alert( 'No tienes permiso de entrar a esta sección, se te redireccionará al Inicio');
                window.location.href = "/";
            }
        }
    }
}
</script>

<style>

</style>
<template>
    <div class="row">
        <div class="col-12 p-0 menu">
            <b-navbar toggleable="lg" type="dark">
                <b-navbar-brand href="#">
                    <img src="~/assets/inah-logo.png" class="logo d-inline-block align-top" alt="logo del inah">
                    CNCPC - Sicofi
                </b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>

                    <!-- Right aligned nav items -->
                    <b-navbar-nav v-if="isLoged">
                        <b-nav-item-dropdown text="Proyectos" right>
                            <b-dropdown-item href="/proyectos/list">Lista de proyectos</b-dropdown-item>
                            <b-dropdown-item href="/proyectos/form">Alta de proyectos</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                    
                    <b-navbar-nav class="ml-auto" v-if="isLoged">
                        <b-nav-item href="/cerrar_sesion">Cerrar Sesión</b-nav-item>
                    </b-navbar-nav>                    
                </b-collapse>
            </b-navbar>      
        </div>
    </div>      
</template>

<script>
export default {
    name: 'Menu',
    data() {
        return {
            isLoged: false
        }
    },
    mounted() {
        if(process.client){
            if( localStorage.getItem('user') ){
                this.isLoged = true;
            }
        }            
    }
}
</script>

<style scoped>
    .menu {
        background-color: #0f143c;
        color: #f0f7ff;
    }
    .logo{
        width: 40px;
        height: 40px;
    }
</style>
<template>
    <div class="row">
        <div class="col-12 menu">
            <b-navbar toggleable="lg" type="dark">
                <b-navbar-brand>
                    <nuxt-link to="/">
                        <img src="~/assets/inah-logo-w.png" class="logo d-inline-block align-top" alt="logo del inah">
                        <span>
                            CNCPC - Sicofi
                        </span>
                    </nuxt-link>
                </b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <!-- Right aligned nav items -->
                    <b-navbar-nav v-if="isLoged">
                        <b-nav-item-dropdown text="Reportes" right v-if="level <= 3">                    
                            <b-dropdown-item><nuxt-link to="/proyectos/reporte"> Lista de proyectos </nuxt-link></b-dropdown-item>
                            <b-dropdown-item> <hr> </b-dropdown-item>
                            <b-dropdown-item><nuxt-link to="/ingresos/reporte_ing"> Ingresos desglozados </nuxt-link></b-dropdown-item>
                        </b-nav-item-dropdown>

                        <b-nav-item-dropdown text="Formularios" right v-if="level <= 2"> 
                            <b-dropdown-item><nuxt-link to="/proyectos"> Proyectos </nuxt-link></b-dropdown-item>
                            <b-dropdown-item><nuxt-link to="/ingresos"> Ingresos </nuxt-link></b-dropdown-item>
                            <b-dropdown-item><nuxt-link to="/egresos"> Egresos </nuxt-link></b-dropdown-item>
                        </b-nav-item-dropdown>

                        <b-nav-item-dropdown text="Administrador" right v-if="level <= 1"> 
                            <b-dropdown-item><nuxt-link to="/usuarios"> Usuarios </nuxt-link></b-dropdown-item>
                            <b-dropdown-item><nuxt-link to="/nombres"> Nombres </nuxt-link></b-dropdown-item>
                            <b-dropdown-item><nuxt-link to="/other"> Otros </nuxt-link></b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>

                    <b-navbar-nav class="ml-auto" v-if="isLoged">
                        <nuxt-link to="/cerrar_sesion" class="closeSesion"> Cerrar Sesión </nuxt-link>
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
            isLoged: false,
            level: 4
        }
    },
    mounted() {
        if(process.client){
            if( localStorage.getItem('user') ){
                this.isLoged = true;
                this.level = localStorage.getItem('level');
            }
        }            
    },
}
</script>

<style scoped>
    .menu {
        background-color: #7c3371;
        color: #f0f7ff;
    }
    .navbar-brand a{
        color: #fff;
        text-decoration: none;
    }
    .navbar-brand span{
        position: relative;
        top: 6px;        
    }
    .logo{
        width: 40px;
        height: 40px;
    }

    .navbar-nav{
        margin: 0 1em;
    }
    .navbar-nav li{
        margin: 0 0.5em;
    }
    .navbar-nav li a{
        color: #e6ac00;
    }
    ::v-deep .navbar-dark .navbar-nav .nav-link{
      color: #e6ac00;
    }

    ::v-deep .dropdown-menu { 
        background-color: #7c3371;
    }   
    ::v-deep .dropdown-item:hover {
        background-color: #4d2c48 !important;
        text-decoration: none;
    }


    .closeSesion{
        color: #e6ac00;
        font-weight: bold;
    }
</style>
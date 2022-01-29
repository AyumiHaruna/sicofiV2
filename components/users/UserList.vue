<template>
    <div class="row userList block">
        <div class="col-12 panel">
            
            <div class="row">
                <div class="col-12 sectionTitle">
                    LISTA DE USUARIOS
                </div>

                <div class="col-12">
                    <table class="secondLvl">
                        <tr>
                            <th>NOMBRE</th>
                            <th>USUARIO</th>
                            <th>NIVEL</th>
                            <th>CORREO</th>
                            <th>PROYECTOS</th>
                            <th>STATUS</th>
                            <th>MODIFICAR</th>
                        </tr>
                        <tr v-for="(user,index) in $parent.users" :key="user.id">
                            <td>{{user.name}}</td>
                            <td>{{user.user}}</td>
                            <td>{{user.level}}</td>
                            <td>{{user.mail}}</td>
                                <td v-if="user.fullAccess">
                                    Acceso Total
                                </td>
                                <td v-else>
                                    <div class="projectDiv" v-for="proj in user.projectList" :key="proj.id">
                                        {{ proj }} /
                                    </div>
                                </td>
                            <td>
                                <i class="fas fa-lightbulb activeStatus yellow" v-if="user.active" v-b-tooltip.hover title="Usuario activo" alt="Usuario activo"></i>
                                <i class="far fa-lightbulb activeStatus white" v-else v-b-tooltip.hover title="Usuario inactivo" alt="Usuario inactivo"></i>
                            </td>
                            <td>
                                <button class="miniBtn saveBtn" v-b-tooltip.hover title="Modificar usuario" alt="Modificar usuario" @click="$parent.openForm( index )">
                                    <i class="fas fa-pen"></i>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'UserList'
}
</script>

<style>
    .userList .activeStatus{
        font-size: 2em;
    }
    .userList .projectDiv{
        display: inline;
    }
    .userList .secondLvl td{
        font-size: 0.8em;
    }
</style>
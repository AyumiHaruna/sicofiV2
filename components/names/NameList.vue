<template>
    <div class="row nameList block">
        <div class="col-12 panel">

            <div class="row">
                <div class="col-12 sectionTitle">
                    LISTA DE NOMBRES
                </div>

                <div class="col-6 offset-3">
                    <table class="secondLvl">
                        <tr>
                            <th>ID</th>
                            <th>NOMBRE</th>
                            <th>EDITAR</th>
                            <th>ACTIVO</th>
                        </tr>
                        <tr v-for="(name, index) in $parent.people" :key="name.id">
                            <td>
                                {{name.id}}
                            </td>
                            <td class="nameTd" :class="(name.vip)?'vip':''">
                                <i class="fas fa-crown" v-if="name.vip"></i>
                                {{name.name}}
                            </td>
                            <td>
                                <button class="miniBtn saveBtn" v-b-tooltip.hover title="Modificar nombre" alt="Modificar nombre" @click="$parent.openForm( index )">
                                    <i class="fas fa-pen"></i>
                                </button>
                            </td>
                            <td class="statusTd">
                                <i class="fas fa-lightbulb activeStatus yellow" v-if="name.active" v-b-tooltip.hover title="Usuario activo" alt="Usuario activo"></i>
                                <i class="far fa-lightbulb activeStatus white" v-else v-b-tooltip.hover title="Usuario inactivo" alt="Usuario inactivo"></i>
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
    name: 'NameList'
}
</script>

<style>
.nameList .activeStatus{
    font-size: 2em;
}
.nameList .projectDiv{
    display: inline;
}
.nameList .secondLvl td{
    font-size: 0.8em;
}
.nameList .secondLvl td.vip{
    color: #ffa500;
}
.nameList .secondLvl .nameTd{
    width: 70%;
}
.nameList .secondLvl .statusTd{
    width: 10%;
}
.nameList .miniBtn{
    margin: 0;
}
</style>
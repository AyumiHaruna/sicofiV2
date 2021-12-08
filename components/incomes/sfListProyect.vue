<template>
    <div class="row block">
        <div class="col-12 headBtn" v-for="(project, index) in $parent.projectList" :key="project.projectNumber">
            <div
                class="projContainer"
                :class="visible[index] ? null : 'collapsed'"
                :aria-expanded="visible[index] ? 'true' : 'false'"
                :aria-controls="`pro-${index}`"
                @click="togglePanel(index)"
            >
                <table class="projInfo">
                    <thead>
                        <tr>
                            <th>No. Proyecto</th>
                            <th>Nombre del Proyecto</th>
                            <th>Autorizado</th>
                            <th>Solicitado</th>
                            <th>Validado</th>
                            <th>Comprobado</th>
                            <!-- <th>Por comprobar</th>
                            <th>% de Comprobación</th> -->
                            <th>Lista de S.F.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{project.projectNumber}}</td>
                            <td>{{project.projectName}}</td>
                            <td>${{moneyFormat(project.totalAuth)}}</td>
                            <td>${{moneyFormat(project.requested)}}</td>
                            <td>${{moneyFormat(project.ministered)}}</td>
                            <td>${{moneyFormat(project.checked)}}</td>
                            <!-- <td>${{moneyFormat( project.ministered - project.checked )}}</td>
                            <td>{{ (project.ministered != 0)? ((project.checked * 100) / project.ministered) : 100 }}%</td> -->
                            <td class="text-center">
                                <button class="togglerBtn actionBtn infoBtn">
                                    <i class="far fa-caret-square-down" v-if="!visible[index]"></i> 
                                    <i class="far fa-caret-square-up" v-if="visible[index]"></i> 
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <b-collapse :id="`pro-${index}`" v-model="visible[index]" class="mt-2">
                <sfListIncomes account="1" :sfList="project.sfList"></sfListIncomes>
                <sfListIncomes account="2" :sfList="project.sfList"></sfListIncomes>
            </b-collapse>
        </div>
    </div>
</template>

<script>
import sfListIncomes from '@/components/incomes/sfListIncomes.vue'

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'sfListProyect.vue',
    components: { sfListIncomes },
    mixins: [ GlobalFunctions ],
    data() {
        return  {
            visible: [],
        }
    },
    methods: {
        togglePanel( index ){
            this.$set(this.visible, index, !this.visible[index])
        }
    }
}
</script>

<style>
    .headBtn{
        border: none;
        border-radius: 10px;
        background: #0f143c;
        font-family: 'Montserrat', sans-serif;
        color: #b3e6ff;
        padding: 1.5em 2em 0.5em 2em;
        margin-bottom: 1em;
    }
    .projContainer{
        cursor: pointer;
    }

    table.projInfo {
        border: 0px solid #170655;
        background-color: #261441;
        width: 100%;
        text-align: center;
        border-collapse: collapse;
    }
    table.projInfo th {
        border: 1px solid #555555;
        padding: 0.5em 1em;
    }
    table.projInfo tbody td {
        font-size: 0.9em;
        color: #FFFFFF;
        padding: 0em 0em;
    }
    table.projInfo td:nth-child(even) {
        background: #4D396A;
    }
    table.projInfo thead {
        background: #685584;
        border-bottom: 2px solid #6E02BA;
    }
    table.projInfo thead th {
        font-weight: bold;
        color: #F6F6F6;
        text-align: center;
        border-left: 2px solid #433755;
        font-size: 0.9em;
    }
    table.projInfo thead th:first-child {
        border-left: none;
    }

    .togglerBtn{
        cursor: pointer;
        margin: 1em 0 1em 2em;
        border-radius: 0.25rem;
        padding: 0.5em 1em;
    }
    .togglerBtn i{
        font-size: 1.5em;
        margin-right: 0;
    }
    .togglerBtn{
        background-color: #16b8b8 !important;
        border: none !important;
    }
    .togglerBtn:hover{
        opacity: 0.7;
    }
</style>
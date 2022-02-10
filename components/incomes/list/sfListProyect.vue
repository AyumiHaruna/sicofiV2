<template>
    <div>
        <div class="row sfListProject block" v-for="(project, index) in $parent.projectList" :key="project.projectNumber">
            <div class="col-12 headBtn" v-if="value === '' || value === project.projectNumber">
                <div
                    class="projContainer"
                    :class="visible[index] ? null : 'collapsed'"
                    :aria-expanded="visible[index] ? 'true' : 'false'"
                    :aria-controls="`pro-${index}`"
                    @click="togglePanel(index)"
                >
                    <table class="firstLvl">
                        <tr>
                            <th>No. Proyecto</th>
                            <th class="wide">Nombre del Proyecto</th>
                            <th>Autorizado</th>
                            <th>Solicitado</th>
                            <th>Validado</th>
                            <th>Comprobado</th>
                            <!-- <th>Por comprobar</th>
                            <th>% de Comprobación</th> -->
                            <th>Lista de S.F.</th>
                        </tr>
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
                                <button class="miniBtn infoBtn">
                                    <i class="far fa-caret-square-down" v-if="!visible[index]"></i> 
                                    <i class="far fa-caret-square-up" v-if="visible[index]"></i> 
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <b-collapse :id="`pro-${index}`" v-model="visible[index]" class="mt-2">
                    <sfListIncomes account="1" :sfList="project.sfList"></sfListIncomes>
                    <sfListIncomes account="2" :sfList="project.sfList"></sfListIncomes>
                </b-collapse>
            </div> 
        </div>
    </div>
</template>

<script>
import sfListIncomes from '@/components/incomes/list/sfListIncomes.vue'

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'sfListProyect.vue',
    components: { sfListIncomes },
    props: [ 'value' ],
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
    .sfListProject .headBtn{
        border: none;
        border-radius: 5px;
        background: #293039;
        color: whitesmoke;
        padding: 0.5em 1em 1em 1em;
        margin-bottom: 1em;
    }
    .sfListProject .wide {
        width: 40%;
    }
</style>
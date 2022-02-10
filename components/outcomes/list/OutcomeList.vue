<template>
    <div>
        <div class="row block outcomeList" v-for="(project, index) in $parent.projectList" :key="project.projectNumber">
            <div class="col-12 headBtn" v-if="value === '' || value === project.projectNumber">
                <div
                    class="projContainer"
                    :class="visible[index] ? null : 'collapsed'"
                    :aria-expanded="visible[index] ? 'true' : 'false'"
                    :aria-controls="`pro-${index}`"
                    @click="togglePanel(index)"
                >
                    <table class="firstLvl">
                        <thead>
                            <tr>
                                <th>No. Proyecto</th>
                                <th>Nombre del proyecto</th>
                                <th>Autorizado</th>
                                <th>Validado</th>
                                <th>Ejercido</th>
                                <th>Lista de Egresos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{project.projectNumber}}</td>
                                <td>{{project.projectName}}</td>
                                <td>${{moneyFormat(project.totalAuth)}}</td>
                                <td>${{moneyFormat(project.ministered)}}</td>
                                <td>${{moneyFormat(project.spends)}}</td>
                                <td class="text-center">
                                    <button class="miniBtn infoBtn">
                                        <i class="far fa-caret-square-down" v-if="!visible[index]"></i> 
                                        <i class="far fa-caret-square-up" v-if="visible[index]"></i> 
                                    </button>
                                </td>
                            </tr>                    
                        </tbody>
                    </table>
                </div>

                <b-collapse :id="`pro-${index}`" v-model="visible[index]" class="mt-2">
                    <AccOutcomes :outList="project.accounts[index2]" v-for="(account, index2) in project.accounts" :key="index2"></AccOutcomes>
                </b-collapse>

            </div>
        </div>
    </div>
</template>

<script>
import AccOutcomes from '@/components/outcomes/list/AccOutcomes.vue'

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'OutcomeList',
    components: { AccOutcomes },
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
        },
    }
}
</script>

<style>
.outcomeList .headBtn{
    border: none;
    border-radius: 5px;
    background: #293039;
    color: whitesmoke;
    padding: 0.5em 1em 1em 1em;
    margin-bottom: 1em;
}
</style>
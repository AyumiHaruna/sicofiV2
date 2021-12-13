<template>
    <div>
        <div class="row block" v-for="(project, index) in projectData" :key="index">
            <div class="col-12 panel" v-if="value === '' || value === project.projectNumber">
                <div class="row header_content">
                    <div class="col-4">
                        <div class="row">
                            <div class="col-5 labelType text-right">Total Autorizado:</div>
                            <div class="col-7 highlight"> $ {{ moneyFormat(project.totalAuth) }} </div>                      
                        </div>

                        <div>
                            <div class="col-12 p-0 actionBtnContainer">
                                <button
                                    class="togglerBtn actionBtn infoBtn"
                                    :class="active[index] ? null : 'collapsed'"
                                    :aria-expanded="active[index] ? 'true' : 'false'"
                                    :aria-controls="`collapse-${index}`"
                                    @click="togglePanel(index)"
                                    v-b-tooltip.hover title="+ Info"
                                > 
                                    <i class="far fa-caret-square-down" v-if="!active[index]"></i> 
                                    <i class="far fa-caret-square-up" v-if="active[index]"></i> 
                                </button>
                                <NuxtLink :to="`/proyectos/formulario?code=${project.projectNumber}`">
                                    <button class="actionBtn saveBtn" v-b-tooltip.hover title="Modificar" v-if="actions" href="/"><i class="fas fa-pen"></i></button>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="row">
                            <div class="col-2 labelType text-right"> Proyecto: </div>
                            <div class="col-10 highlight"> {{project.projectNumber}} - {{project.projectName}} </div>

                            <div class="col-2 labelType text-right"> Encargad@: </div>
                            <div class="col-5 highlight"> {{project.degree}}. {{project.manager}} </div>
                            <div class="col-2 labelType text-right"> Tipo: </div>
                            <div class="col-3 highlight"> {{ projectTypes[ project.type ] }} </div>
                        </div>

                        <div class="row">
                            <div class="col-12 tableContainer">
                                <table class="headData">
                                    <thead>
                                        <th v-for="num in 5" :key="num">
                                            Capítulo {{num}}000
                                        </th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td v-for="num in 5" :key="num">
                                                ${{ moneyFormat( project[`cap${num}`] ) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <b-collapse :id="`collapse-${index}`" v-model="active[index]" role="tabpanel">
                        <div class="row" v-for="account in project.accounts" :key="account.id">
                            <div class="col-6 projectAccount"> Tipo de cuenta: <span>{{ $store.state.accountType[ account.accountType - 1 ] }}</span></div>
                            <div class="col-6 text-right">
                                <div class="row">
                                    <div class="col-8 labelType text-right">Total {{ $store.state.accountType[ account.accountType - 1 ] }}:</div>
                                    <div class="col-4 highlight"> $ {{ (account.accountType === 1) ? moneyFormat(project.coordAuth) : moneyFormat(project.instAuth) }} </div> 
                                </div>
                            </div>

                            <div class="col-12">
                                <table class="projectInfo">
                                    <thead>
                                        <th>Capítulos</th>
                                        <th v-for="month in $store.state.monthList" :key="month">
                                            {{ month.substring(0,3) }}
                                        </th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="chap in account.chapters" :key="chap.id">
                                            <th> Cap. {{chap.chapter}}000 </th>
                                            <td v-for="index in 12" :key="index"> 
                                                ${{ moneyFormat(chap[`month${index}`]) }} 
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>                    
                    </b-collapse>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'ProjectCard',
    mixins: [ GlobalFunctions ],
    props: [ 'projectData', 'value' ],
    data() {
        return {
            projectTypes: {
                pro: 'Proyecto',
                gb: 'Gasto Básico',
                nom: 'Nómina'
            },
            active: [],
            actions: false,
        }
    },
    methods: {
        togglePanel(index){
            this.$set( this.active, index, !this.active[index] );
        }
    },
    created() {
         if(process.client){
            if( localStorage.getItem('level') == 1){
                this.actions = true;
            }
        }   
    }
}
</script>

<style>

    .block {
        margin-bottom: 0;
    }
    .panel {
        padding: 1.5em 3em !important;
        margin-bottom: 1em;
        font-size:0.9em;
    }

    .header_content{
        border-bottom: solid 1px #6f63e7;
    }

    .totalInfo {
        display: inline-block;
        width: 100%;
    }
    .labelType{
        margin-top: 0.5em;
        padding: 0.5em 2em;
    }
    .highlight {
        margin-top: 0.5em;
        border-radius: 5px;
        padding: 0.5em 2em;
        background: #282a57;
        color: #e6e6e6;
    }    

    .actionBtnContainer{
        text-align: center;
        margin-top: 2em;
    }
    .actionBtnContainer button{
        cursor: pointer;
        margin: 1em 0 1em 2em;
        border-radius: 0.25rem;
        padding: 0;
        font-size: 1em;
        width: 3.5em;
        height: 3.5em;
    }
    .actionBtnContainer button i{
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

    .tableContainer{
        padding: 0 0 0 2em !important;
    }

    table.headData {
        border: 0px solid #170655;
        background-color: #261441;
        width: 100%;
        text-align: center;
        border-collapse: collapse;
        margin: 1em 0;
    }
    table.headData td, table.headData th {
        border: 1px solid #555555;
        padding: 0.5em 1em;
    }
    table.headData tbody td {
        font-weight: bold;
        color: #FFFFFF;
    }
    table.headData td:nth-child(even) {
        background: #4D396A;
    }
    table.headData thead {
        background: #685584;
        border-bottom: 2px solid #6E02BA;
    }
    table.headData thead th {
        font-weight: bold;
        color: #F6F6F6;
        text-align: center;
        border-left: 2px solid #433755;
    }
    table.headData thead th:first-child {
        border-left: none;
    }

    .projectAccount {
        text-align: center;
        padding: 1.5em;
        font-size: 1em;
    }
    .projectAccount span{
        font-size: 1.2em;
        font-weight: bold;
    }

    table.projectInfo {
        border: 0px solid #555555;
        background-color: #555555;
        width: 100%;
        text-align: center;
        border-collapse: collapse;
    }
    table.projectInfo td, table.projectInfo th {
        border: 1px solid #555555;
        padding: 0.5em 0.5em;
    }
    table.projectInfo tbody td {
        font-size: 0.7em;
        font-weight: bold;
        color: #FFFFFF;
        letter-spacing: 1.1px;
    }
    table.projectInfo tr:nth-child(even) {
        background: #1C7C80;
    }
    table.projectInfo thead {
        background: #16B8B8;
        border-bottom: 10px solid #1C7C80;
    }
    table.projectInfo th {
        font-size: 0.9em;
        font-weight: bold;
        color: #FFFDD5;
    }
    table.projectInfo thead th {
        font-weight: bold;
        color: #333333;
        text-align: center;
        border-left: 2px solid #1C7C80;
    }
    table.projectInfo thead th:first-child {
        border-left: none;
    }
</style>
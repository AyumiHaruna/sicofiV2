<template>
    <div class="projectCard">
        <div class="row block" v-for="(project, index) in projectData" :key="index">
            <div class="col-12 panel" v-if="value === '' || value === project.projectNumber">
                <div class="row header_content">
                    <div class="col-4">
                        <div class="row">
                            <div class="col-5 labelType text-right">TOTAL AUTORIZADO:</div>
                            <div class="col-7 highlight"> $ {{ moneyFormat(project.totalAuth) }} </div>                      
                        </div>

                        <div>
                            <div class="col-12 p-0 actionBtnContainer">
                                <button
                                    class="togglerBtn miniBtn infoBtn"
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
                                    <button class="miniBtn saveBtn" v-b-tooltip.hover title="Modificar" v-if="actions" href="/"><i class="fas fa-pen"></i></button>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="row">
                            <div class="col-2 labelType text-right"> PROYECTO: </div>
                            <div class="col-10 highlight"> {{project.projectNumber}} - {{project.projectName}} </div>

                            <div class="col-2 labelType text-right"> ENCARGAD@: </div>
                            <div class="col-5 highlight"> {{project.degree}}. {{project.manager}} </div>
                            <div class="col-2 labelType text-right"> TIPO: </div>
                            <div class="col-3 highlight"> {{ projectTypes[ project.type ] }} </div>
                        </div>

                        <div class="row">
                            <div class="col-12 p-0">
                                <table class="firstLvl">
                                    <tr>
                                        <th v-for="num in 5" :key="num">
                                            CAPÍTULO {{num}}000
                                        </th>
                                    <tr/>
                                    <tr>
                                        <td v-for="num in 5" :key="num">
                                            ${{ moneyFormat( project[`cap${num}`] ) }}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <b-collapse :id="`collapse-${index}`" v-model="active[index]" role="tabpanel">
                        <div class="row accounts" v-for="account in project.accounts" :key="account.id">
                            <div class="col-6 accountTitle"> Tipo de cuenta: <span>{{ $store.state.accountType[ account.accountType - 1 ] }}</span></div>
                            <div class="col-6 text-right">
                                <div class="row">
                                    <div class="col-8 labelType text-right">Total {{ $store.state.accountType[ account.accountType - 1 ] }}:</div>
                                    <div class="col-4 highlight"> $ {{ (account.accountType === 1) ? moneyFormat(project.coordAuth) : moneyFormat(project.instAuth) }} </div> 
                                </div>
                            </div>

                            <div class="col-12">
                                <table class="secondLvl">
                                    <thead>
                                        <th>CAPÍTULOS</th>
                                        <th v-for="month in $store.state.monthList" :key="month">
                                            {{ (month.substring(0,3)).toUpperCase() }}
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
    
    .projectCard .labelType{
        margin-top: 0.5em;
        padding: 0.5em 2em;
        font-size: 0.8em;
        font-weight: bold;
        letter-spacing: 1.5px;
    }    
    .projectCard .highlight {
        margin: 0.3em 0;
        border-radius: 5px;
        padding: 0.5em 2em;
        background: #4d2c48;
        color: #ffffcc;
        font-size: 0.9em;
    }
    .projectCard .actionBtnContainer{
        text-align: center;
        margin-top: 2em;
    }

    .projectCard .accounts{
        margin-top: 0.5em;
    }
    .projectCard .accountTitle {
        text-align: center;
        padding: 0.5em;
        font-size: 1em;
        color: #c7656c;
        font-weight: bold;
    }
</style>
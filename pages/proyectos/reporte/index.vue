<template>
    <div class="row projectReport">
        <div class="col-12">

            <div class="row">
                <div class="col-6 pageTitle">
                    Reporte de proyectos
                </div>

                <div class="col-4 offset-2">
                    <ProjectFilter></ProjectFilter>
                </div>
            </div>

            <div class="row block">
                <div class="col-12 panel">

                    <div class="row" v-for="project in projectData" :key="project.projectNumber">
                        <div class="col-12 elmContainer" v-if="selectedProject === '' || selectedProject === project.projectNumber">
                            <table class="secondLvl">
                                <tr>
                                    <th>PROYECTO</th>
                                    <th>ENCARGAD@</th>
                                    <th>TIPO</th>
                                </tr>
                                <tr>                                    
                                    <td>{{project.projectNumber}} - {{project.projectName}}</td>                                    
                                    <td>{{project.degree}}. {{project.manager}}</td>                                    
                                    <td>{{  (projectTypes[ project.type ]).toUpperCase() }}</td>
                                </tr>
                            </table>
                            <table class="secondLvl"> 
                                <tr>                                    
                                    <th v-for="num in 5" :key="num">CAP{{num}}</th>
                                    <th>TOTAL AUTORIZADO</th>
                                </tr>
                                <tr>
                                    <td v-for="num in 5" :key="num"> ${{ moneyFormat( project[`cap${num}`] ) }} </td>
                                    <td>$ {{ moneyFormat(project.totalAuth) }}</td>                                    
                                </tr>
                            </table>     
                            <table class="secondLvl" v-for="account in project.accounts" :key="account.id">
                                <tr>
                                    <th colspan="10">
                                        {{ ($store.state.accountType[ account.accountType - 1 ]).toUpperCase() }}
                                    </th>
                                    <th colspan="2">TOTAL DE LA CUENTA</th>
                                    <td colspan="2"> ${{ (account.accountType === 1) ? moneyFormat(project.coordAuth) : moneyFormat(project.instAuth) }}</td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th v-for="month in $store.state.monthList" :key="month">
                                        {{ (month.substring(0,3)).toUpperCase() }}
                                    </th>
                                    <th> TOTAL CAP. </th>
                                </tr>
                                <tr v-for="chap in account.chapters" :key="chap.id">
                                    <th> CAP. {{chap.chapter}}000 </th>
                                    <td v-for="index in 12" :key="index"> 
                                        ${{ moneyFormat(chap[`month${index}`]) }} 
                                    </td>
                                    <th>
                                        ${{ moneyFormat( sumaCaps( chap ) ) }}
                                    </th>
                                </tr>
                            </table>                       
                        </div>
                    </div>

                </div>
            </div>
            

            <Toast ref="toast"></Toast>        
            <LogTest ref="logTest" /> 

        </div>
    </div>
</template>

<script>
import ProjectFilter from '@/components/general/ProjectFilter.vue';

import LogTest from '@/components/general/LogTest.vue';
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'ReporteProyectos',
    components: {  ProjectFilter, Toast, LogTest   },
    mixins: [ GlobalFunctions ],
    data() {
        return {
            projectData: [],
            dataObject: {
                year: '',
                id: '',
                fullAccess: 0,
                projectList: []
            },
            projectTypes: {
                pro: 'Proyecto',
                gb: 'Gasto Básico',
                nom: 'Nómina'
            },
            selectedProject: ''
        }
    },
    mounted() {
        // get working year and number
        if(process.client){
            this.dataObject.year = localStorage.getItem('year');
            this.dataObject.id = localStorage.getItem('id');
            this.dataObject.fullAccess = localStorage.getItem('fullAccess');
            if(this.dataObject.fullAccess == 0){
                this.dataObject.projectList = localStorage.getItem('projectList');
            }
        }

        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 3 );

        this.getAllProjects();
    },
    methods: {
        async getAllProjects() {            
            const res = await fetch(`${process.env.apiUrl}/projects/list`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(this.dataObject)
            });

            if( await res.status === 200){
                //convert response to json
                const resData = await res.json();
                this.projectData = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
        },

        sumaCaps( account ){
            let total = 0;

            for (let i = 1; i <= 12; i++) {
                total += parseFloat( account[`month${i}`] );     
            }

            return total;
        }
    }
}
</script>

<style>
    .projectReport .elmContainer{
        padding: 0.5em;
        margin: 0.7em 0;
        border-radius: 10px;
        background-color: #000;
    }
    .projectReport .secondLvl{
        margin: 0;
    }
</style>
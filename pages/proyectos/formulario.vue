<template>
    <div class="row projectForm">        
        <div class="col-12">

            <div class="row">
                <div class="col-6 pageTitle">
                    Formulario de proyectos
                </div>
            </div>

            <ProjectForm v-model="projectData" :blocked="blocked"/>

            <ProjectAccounts :accounts="projectData.accounts" />
           
            <transition name="fade">
                <PartForm v-model="partListData"  v-if="partFormShown" />
            </transition>

                       

            <Toast ref="toast"></Toast>         
            <LogTest ref="logTest" /> 
        </div>
         
    </div>
</template>

<script>
import ProjectForm from '@/components/projects/ProjectForm.vue';
import ProjectAccounts from '@/components/projects/ProjectAccounts.vue';
import PartForm from '@/components/projects/PartForm.vue';

import LogTest from '@/components/general/LogTest.vue'
import Toast from '@/components/general/Toast.vue';

export default {
    name: 'project-form',
    components: { ProjectForm, ProjectAccounts, PartForm, Toast, LogTest },
    data() {
        return {
            projectData: {
                type: '',
                projectNumber: '',
                projectName: '',
                degree: '',
                manager: '',
                year: '',
                totalAuth: 0,
                coordAuth: 0,
                instAuth: 0,
                cap1: 0,
                cap2: 0,
                cap3: 0,
                cap4: 0,
                cap5: 0,
                accounts: []
            },

            partListData: {
                selectedId: '',
                selectedAccount: '',
                selectedChapter: '',
                selectedPart: '',
                selectedProject: '',
                months: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                formType: '',
                year: ''
            },

            partFormShown: false,
            blocked: false
        }
    },
    mounted() {
        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 2 )

        // set current working year 
        if(process.client){
            this.projectData.year = localStorage.getItem('year');
            this.partListData.year = localStorage.getItem('year');
        }

        // if has project code / block projectNumber / get projectFullData
        if( this.$nuxt.$route.query.code ){
            let code = this.$nuxt.$route.query.code;
            this.getProjectData( code );
        }
    },
    methods: {
        //get all project data
        async getProjectData( proj ) {
            //make fetch to api 
            const res = await fetch(`${process.env.apiUrl}/projects/projectData/${this.projectData.year}/${proj}`);

             // if api response is ok 
            if( res.status === 200 ){
                const resData = await res.json();
                if( resData.status === 200) {   //if data response is ok
                    // assign resData to component data
                    this.blocked = true;
                    this.projectData = resData.data[0];
                } else {    //if data has error
                    this.$refs.toast.makeToast('error', `Error al buscar el Poryecto (${id}), intenta nuevamente`);
                }                            
            } else {
                this.$refs.toast.makeToast('error', `Ocurrió un problema, intenta nuevamente`);
            }
        },

        showPartForm( accountType, project, type, partObj = null, ){
            this.partListData.selectedAccount = accountType;      
            this.partListData.selectedProject = project;
            this.partListData.formType = type;

            if( partObj === null ){     //clear data
                this.partListData.selectedId = '';
                this.partListData.selectedChapter = '';
                this.partListData.selectedPart = '';                

                for (let i = 0; i < 12; i++) {
                    this.partListData.months[i] = 0;
                }                
            } else {        // set data
                this.partListData.selectedId = partObj.id;
                this.partListData.selectedChapter = partObj.chapter;
                this.partListData.selectedPart = partObj.partNumber;                

                for (let i = 0; i < 12; i++) {
                    this.partListData.months[i] = partObj[`month${i + 1}`];
                }   
            }

            this.partFormShown = true;
        },

        closePartForm() {
            this.partFormShown = false;
        }
    }
}
</script>

<style>
    
</style>
<template>
    <div class="row projectForm">        
        <div class="col-12">

            <div class="row">
                <div class="col-12 m-4 text-center">
                    <h3>Formulario de proyectos</h3>
                </div>
            </div>

            <ProjectForm v-model="projectData" />
    
            <ProjectAccounts :accounts="projectData.accounts" />
       
            <transition name="fade">
                <PartForm v-model="partListData"  v-if="partFormShown" />
            </transition>

                       

            <Toast ref="toast"></Toast>         
            
        </div>
         
    </div>
</template>

<script>
import ProjectForm from '../../components/projects/ProjectForm.vue';
import ProjectAccounts from '../../components/projects/ProjectAccounts.vue';
import PartForm from '../../components/projects/PartForm.vue';

import Toast from '../../components/general/Toast.vue';

export default {
    name: 'project-form',
    components: { ProjectForm, ProjectAccounts, PartForm, Toast },
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

            partFormShown: false
        }
    },
    created() {
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
            // console.log('getting project data ', proj);
            //make fetch to api 
            const res = await fetch(`${process.env.apiUrl}/projects/projectData/${this.projectData.year}/${proj}`);

             // if api response is ok 
            if( res.status === 200 ){
                const resData = await res.json();
                if( resData.status === 200) {   //if data response is ok
                    // assign resData to component data
                    this.projectData = resData.data[0];
                } else {    //if data has error
                    this.$refs.toast.makeToast('error', `${resData.message} / redireccionando...`);
                    setTimeout( ()=>{
                        this.$router.push('/proyectos/lista');        
                    }, 4000);        
                }                            
            } else {
                this.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
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
.fade-enter-active, .fade-leave-active {
  transition: all .3s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
<template>
  <div class="row projectList">
        <div class="col-12">
            
            <div class="row">
                <div class="col-4 pageTitle">
                   Proyectos
                </div>

                <div class="col-4 text-center">
                    <nuxt-link to="/proyectos/formulario">
                        <button class="actionBtn saveBtn" v-b-tooltip.hover title="Nuevo proyecto" alt="Nuevo proyecto">
                            <i class="fas fa-folder-plus"></i>
                            NUEVO PROYECTO
                        </button>
                    </nuxt-link>                    
                </div>
                
                <div class="col-4 proyForm">
                    <ProjectFilter></ProjectFilter>
                </div>
            </div>

            <ProjectCard :projectData="projectData" v-model="selectedProject"/>

            <Toast ref="toast"></Toast>        
            <LogTest ref="logTest" /> 
        </div>
    </div>
</template>

<script>
import ProjectFilter from '@/components/general/ProjectFilter.vue';
import ProjectCard from '@/components/projects/ProjectCard.vue';

import LogTest from '@/components/general/LogTest.vue';
import Toast from '@/components/general/Toast.vue';

export default {
    name: 'projectList',
    components: {  ProjectFilter, ProjectCard, Toast, LogTest   },
    data() {
        return {
            projectData: [],
            dataObject: {
                year: '',
                id: '',
                fullAccess: 0,
                projectList: []
            },
            selectedProject: ''
        }
    },
    created() {
        // get working year and number
        if(process.client){
            this.dataObject.year = localStorage.getItem('year');
            this.dataObject.id = localStorage.getItem('id');
            this.dataObject.fullAccess = localStorage.getItem('fullAccess');
            if(this.dataObject.fullAccess == 0){
                this.dataObject.projectList = localStorage.getItem('projectList');
            }
        }

        this.getAllProjects();
    },
    mounted() {
        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 2 );
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
        }
    },
}
</script>

<style scoped>
    
    /* .top_header{
        padding: 2em;
    }

    input, select {
        background-color:#0f143c !important;
        font-size: 1em;
    } */
</style>
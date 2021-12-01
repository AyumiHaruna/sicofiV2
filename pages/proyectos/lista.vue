<template>
  <div class="row projectList">
        <div class="col-12">
            
            <div class="row">
                <div class="col-8 top_header">
                    <h3>Lista de Proyectos</h3>
                </div>
                <div class="col-4 top_header">
                    <b-form-select ref="project" name="project" v-model="selectedProject" >
                        <b-form-select-option value="">-- Todos los proyectos -- </b-form-select-option>
                        <b-form-select-option :value="elm.projectNumber" v-for="(elm,index) in projectData" :key="index">    
                            {{elm.projectNumber}} - {{elm.projectName}}
                        </b-form-select-option>
                    </b-form-select>
                    <label for="project">FILTRAR PROYECTOS</label>
                </div>
            </div>

            <ProjectCard :projectData="projectData" v-model="selectedProject"/>

            <Toast ref="toast"></Toast>         
        </div>
    </div>
</template>

<script>
import ProjectCard from '../../components/projects/ProjectCard.vue';

import Toast from '../../components/general/Toast.vue';

export default {
    name: 'projectList',
    components: {   ProjectCard, Toast   },
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
    .top_header{
        padding: 2em;
    }

    input, select {
        background-color:#0f143c !important;
        font-size: 1em;
    }
</style>
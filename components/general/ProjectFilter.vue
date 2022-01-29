<template>
    <div>
        <select ref="project" name="project" v-model="$parent.selectedProject" >
            <option value="">-- Todos los proyectos -- </option>
            <option :value="proj.projectNumber" v-for="(proj,index) in projectList" :key="index">    
                {{proj.projectNumber}} - {{proj.projectName}}
            </option>
        </select>
        <label for="project">FILTRAR PROYECTOS</label>
    </div>
</template>

<script>
export default {
    name: 'ProjectFilter',
    data() {
        return {
            projectList: [],
            dataObject: {
                year: '',
                id: '',
                fullAccess: 0,
                projectList: []
            },
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

        this.getProjectList();
    },
    methods: {
        async getProjectList() {            
            const res = await fetch(`${process.env.apiUrl}/projects/simple_list`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(this.dataObject)
            });

            if( await res.status === 200){
                //convert response to json
                const resData = await res.json();
                this.projectList = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `No se encontró la lista de proyectos, intente nuevamente`);
            }
        }
    }
}
</script>

<style>

</style>
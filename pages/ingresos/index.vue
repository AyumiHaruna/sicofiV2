<template>
    <div class="row incomeList">
        <div class="col-12">

            <div class="row">
                <div class="col-4 pageTitle">
                    Lista de S.F.
                </div>

                <div class="col-4 text-center">
                    <nuxt-link to="/ingresos/sf_formulario">
                        <button class="actionBtn saveBtn" v-b-tooltip.hover title="Nueva solicitud de fondos" alt="Nueva solicitud de fondos">
                            <i class="fas fa-folder-plus"></i>
                            NUEVA S.F.
                        </button>
                    </nuxt-link>                    
                </div>

                <div class="col-4 proyForm">
                    <ProjectFilter></ProjectFilter>
                </div>
            </div>

            <sfListProyect v-model="selectedProject" v-show="projectList != ''"></sfListProyect>

            <Toast ref="toast"></Toast>     
            <LogTest ref="logTest" />     
        </div>
    </div>
</template>

<script>
import ProjectFilter from '@/components/general/ProjectFilter.vue';
import sfListProyect from '@/components/incomes/list/sfListProyect.vue'

import LogTest from '@/components/general/LogTest.vue'
import Toast from '@/components/general/Toast.vue';

export default {
    name: 'sf_list',
    components: {  ProjectFilter, sfListProyect, Toast, LogTest   },
    data() {
        return {
            projectList: '',
            selectedProject: '',
        }
    },
    mounted() {
        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 2 )
        
        this.getProjectsSF();
    },
    methods: {
        async getProjectsSF() {
            const res = await fetch(`${process.env.apiUrl}/incomes/sf_proy_list/${localStorage.getItem('year')}`);
            if( await res.status === 200){
                //convert response to json
                const resData = await res.json();
                this.projectList = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
        }
    }
    
}
</script>

<style>

</style>
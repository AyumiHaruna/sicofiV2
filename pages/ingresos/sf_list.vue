<template>
    <div class="row inccomeList">
        <div class="col-12">

            <div class="row">
                <div class="col-12">
                    <h1>Lista de S.F.</h1>
                </div>
            </div>

            <sfListProyect></sfListProyect>

            <Toast ref="toast"></Toast>         
        </div>
    </div>
</template>

<script>
import sfListProyect from '@/components/incomes/sfListProyect.vue'

import Toast from '@/components/general/Toast.vue';

export default {
    name: 'sf_list',
    components: {  sfListProyect, Toast   },
    data() {
        return {
            projectList: {},
            selectedProject: '',
        }
    },
    mounted() {
        this.getProjectsSF();
    },
    methods: {
        async getProjectsSF() {
            const res = await fetch(`${process.env.apiUrl}/incomes/sf_proy_list/${localStorage.getItem('year')}`)
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
<template>
    <div class="row AuthAdmin block">
        <div class="col-12 panel">
            <div class="row">
                <div class="col-12 bordered">
                    <div class="row">

                        <div class="col-12 sectionTitle">
                            ADMINISTRADOR DE AUTORIDADES
                        </div>

                        <div class="col-12">
                            <input type="text" name="coord" v-model.trim="authObj.coord" @input="toUpper('coord')">
                            <label for="coord">COORDINADOR@</label>
                        </div>
                        <div class="col-12">
                            <input type="text" name="admin" v-model.trim="authObj.admin" @input="toUpper('admin')">
                            <label for="admin">SUBDIRECTOR@</label>
                        </div>
                        <div class="col-12">
                            <input type="text" name="auth" v-model.trim="authObj.auth" @input="toUpper('auth')">
                            <label for="">REVISA</label>
                        </div>
                        <div class="col-12">
                            <input type="text" name="elab" v-model.trim="authObj.elab" @input="toUpper('elab')">
                            <label for="elab">ELABORA</label>
                        </div>

                        <div class="col-12">
                            <button class="actionBtn saveBtn" v-b-tooltip.hover title="Guardar nombres" alt="Guardar nombres" @click="testNames()">
                                <i class="far fa-save"></i>
                                GUARDAR NOMBRES
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'AuthAdmin.vue',
    mixins: [ GlobalFunctions ],
    data() {
        return {
            authObj: {
                coord: '',
                admin: '',
                auth: '',
                check: '',
            }
        }
    },
    mounted() {
        this.getAuthorities();
    },
    methods: {
        async getAuthorities(){
            const res = await fetch( `${process.env.apiUrl}/auth/list` );

            const resData = await res.json();

            // if is a success data
            if(resData.status === 200) {
                this.authObj = resData.results;
            } else {    //show error message
                this.$refs.toast.makeToast('error', `No se pudo cargar la lista de autoridades, intenta nuevamente`);
            }   
        },

        async saveNames() {
            const res = await fetch( `${process.env.apiUrl}/auth/save` ,  
            {
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(this.authObj)
            });

            //get response & change isLoading
            this.showLoader('Guardando nombres');
                const resData = await res.json();
            this.hideLoader();

            // if is a success data
            if(resData.status === 200) {
                this.$parent.$refs.toast.makeToast('success', `Nombres guardados exitosamente`);
                this.getAuthorities();
            } else {    //show error message
                this.$parent.$refs.toast.makeToast('error', `No se puidieron guardar los nombres, intenta nuevamente`);
            } 
        },

        testNames(){
            // test coord
            if( this.authObj.coord == '' ) {   this.$parent.$refs.toast.makeToast('error', `Favor de capturar el nombre de el/la/le "Coordinador@"`);  return;  }
            // test admin
            if( this.authObj.admin == '' ) {   this.$parent.$refs.toast.makeToast('error', `Favor de capturar el nombre de el/la/le "Administrador@"`);  return;  }
            // test auth
            if( this.authObj.auth == '' ) {   this.$parent.$refs.toast.makeToast('error', `Favor de capturar el nombre de quien "Revisa"`);  return;  }
            // test check
            if( this.authObj.check == '' ) {   this.$parent.$refs.toast.makeToast('error', `Favor de capturar el nombre de quien "Elabora@"`);  return;  }

            this.saveNames();
        },

        toUpper( elm ){
            this.authObj[ elm ] = (this.authObj[elm]).toUpperCase();
        }
    }
}
</script>

<style>

</style>
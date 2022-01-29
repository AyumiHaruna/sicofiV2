<template>
    <div class="row users">
        <div class="col-12">

            <div class="row">
                <div class="col-6 pageTitle">
                    Lista de Usuarios
                </div>

                <div class="col-6 text-center">
                    <button class="actionBtn saveBtn" v-b-tooltip.hover title="Nuevo usuario" alt="Nuevo usuario" @click="openForm()">
                        <i class="fas fa-user-plus"></i>
                        NUEVO USUARIO
                    </button>
                </div>
            </div>

            <UserList />
            <UserForm v-show="showForm" />

            <Toast ref="toast"></Toast>     
            <LogTest ref="logTest" />   
        </div>
    </div>
</template>

<script>
import UserList from '@/components/users/UserList.vue';
import UserForm from '@/components/users/UserForm.vue';

import LogTest from '@/components/general/LogTest.vue';
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'usuarios',
    mixins: [ GlobalFunctions ],
    components: { UserList, UserForm, Toast, LogTest  },
    data() {
        return {
            users: [],
            userForm: {
                id: '',
                user: '',
                password: '',
                name: '',
                level: '',
                mail: '',
                fullAccess: false,
                projectList: [],
                active: true
            },
            projectList: [],
            showForm: false
        }   
    },
    mounted() {
        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 1 )
        
        // get full user list
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const res = await fetch(`${process.env.apiUrl}/users/list`);
            if( await res.status === 200){
                //convert response to json
                const resData = await res.json();
                this.users = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `No pude cargar la lista de usuarios, intente nuevamente`);
            }
        },

        openForm( id = null ) {
            if( id == null ){
                this.userForm = {
                    id: '',
                    user: '',
                    password: '',
                    name: '',
                    level: '',
                    mail: '',
                    fullAccess: false,
                    projectList: [],
                    active: true
                };
            } else {
                console.log(id);
                this.userForm = {
                    id: this.users[id]['id'],
                    user: this.users[id]['user'],
                    password: this.users[id]['password'],
                    name: this.users[id]['name'],
                    level: this.users[id]['level'],
                    mail: this.users[id]['mail'],
                    fullAccess: this.users[id]['fullAccess'],
                    projectList: this.users[id]['projectList'],
                    active: this.users[id]['active']
                };
            }

            this.showForm = true
        },

        async saveUser() {
            let fetchUrl = '';
            if( this.userForm.id == ''){  //is a create
                fetchUrl = `${process.env.apiUrl}/users/create`;
            } else {     //is an update
                fetchUrl = `${process.env.apiUrl}/users/update`;
            }

            const res = await fetch( fetchUrl , {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(this.userForm)
            });

            this.showLoader('Guardando S.F.');
            await res;                
            this.hideLoader();

            if( await res.status === 200){
                // //convert response to json
                const resData = await res.json();
               
                if( resData.results == 'exists'){
                    this.$refs.toast.makeToast('error', `El usuario capturado ya existe, intente con otro`);
                }

                if( resData.results == 'ok'){
                    this.$refs.toast.makeToast('success', `Usuario guardado exitosamente`);
                    // close form 
                    this.showForm = false;
                    // update user list
                    this.getUserList();
                }
            } else {
                this.$refs.toast.makeToast('error', `No se pudo guardar, intente nuevamente`);
            }
        }
    }
}
</script>

<style>

</style>
<template>
    <form>
        <div class="row smoke">
            <div class="col-10 offset-1">
                <div class="row userForm panel">
                    <div class="col-12 bordered">
                        <div class="row">

                            <div class="col-12 sectionTitle">
                                Formulario de Usuario
                            </div>

                            <div class="col-5">
                                <input type="text" name="user" v-model="$parent.userForm.user" >
                                <label for="user">USUARIO</label>
                            </div>
                            <div class="col-5">
                                <input type="password" name="password" v-model="$parent.userForm.password">
                                <label for="password">CONTRASEÑA</label>
                            </div>
                            <div class="col-2">
                                <select name="level" v-model="$parent.userForm.level">
                                    <option value="3">3</option>
                                    <option value="2">2</option>
                                    <option value="1">1</option>
                                </select>
                                <label for="level">NIVEL</label>
                            </div>

                            <div class="col-4">
                                <input type="text" name="name" v-model="$parent.userForm.name" @input="changeToUpper()">
                                <label for="name">NOMBRE</label>
                            </div>
                            <div class="col-4">
                                <input type="mail" name="mail" v-model="$parent.userForm.mail">
                                <label for="mail">CORREO</label>
                            </div>
                            <div class="col-2">
                                <input type="checkbox" name="fullAccess" v-model="$parent.userForm.fullAccess">
                                <label for="fullAccess">ACCESO TOTAL</label>
                            </div>
                            <div class="col-2 text-center">
                                <input type="checkbox" name="active" v-model="$parent.userForm.active">
                                <label for="active">ACTIVO</label>
                            </div>

                            <div class="col-12" v-if="!$parent.userForm.fullAccess">
                                <div class="row">
                                    <div class="col-4">
                                        <select name="projectList" v-model="selectedProject">
                                            <option :value="project.projectNumber" v-for="project in $parent.projectList" :key="project.projectNumber">
                                                {{project.projectNumber}} - {{project.projectName}}
                                            </option>
                                        </select>
                                        <label for="projectList">LISTA DE PROYECTOS</label>
                                    </div>
                                    <div class="col-2">
                                        <button class="miniBtn infoBtn" @click.prevent="addProjectToList()" v-b-tooltip.hover title="Añadir proyecto" alt="Añadir proyecto">                                            
                                            <i class="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <span v-for="(project, index) in $parent.userForm.projectList" :key="index" class="projectElm" @click="erraseProject(index)" v-b-tooltip.hover title="Quitar proyecto" alt="Quitar proyecto">
                                            {{ project }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 text-right">
                                <button class="actionBtn closeBtn" @click.prevent="$parent.showForm = false">
                                    <i class="far fa-save"></i>
                                    CANCELAR
                                </button>
                                <button class="actionBtn saveBtn" @click.prevent="validateForm()">
                                    <i class="far fa-save"></i>
                                    GUARDAR USUARIO
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
export default {
    name: 'UserForm',
    data() {
        return {
            dataObject: {
                year: '',
                id: '',
                fullAccess: 0,
                projectList: []
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
                this.$parent.projectList = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `No se encontró la lista de proyectos, intente nuevamente`);
            }
        },

        addProjectToList() {
            if( !(this.$parent.userForm.projectList).includes( this.selectedProject ) ) {
                this.$parent.userForm.projectList.push( this.selectedProject )
            } else {
                this.$parent.$refs.toast.makeToast('error', `El proyecto elegido ya está en la lista`);
            }
        },

        erraseProject( index ){
            (this.$parent.userForm.projectList).splice( index, 1 );
        },

        validateForm(){
            //test user
            if( this.$parent.userForm.user == '' ){ this.$parent.$refs.toast.makeToast('warning', `Favor de capturar el usuario"`); return  }
            //test password
            if( this.$parent.userForm.password == '' ){ this.$parent.$refs.toast.makeToast('warning', `Favor de capturar la contraseña"`); return  }
            //test level
            if( this.$parent.userForm.level == '' ){ this.$parent.$refs.toast.makeToast('warning', `Favor de elegir un nivel"`); return  }
            //test name
            if( this.$parent.userForm.name == '' ){ this.$parent.$refs.toast.makeToast('warning', `Favor de capturar un nombre"`); return  }
            //test mail
            if( this.$parent.userForm.mail == '' ){ this.$parent.$refs.toast.makeToast('warning', `Favor de capturar un correo"`); return  }
            
            // if( !this.$parent.userForm.fullAccess ){
            //     //test name
            //     if( (this.$parent.userForm.projectList).length == 0 ){ this.$parent.$refs.toast.makeToast('warning', `Favor de añadir proyectos o acceso total"`); return  }
            // }

            this.$parent.saveUser();
        },

        changeToUpper() {
            this.$parent.userForm.name = (this.$parent.userForm.name).toUpperCase();
        }
    }
}
</script>

<style>
    .userForm{
        margin-top: 10vw;
    }
    .userForm .projectElm {
        border: solid 2px #009eb7;
        border-radius: 5px;
        margin: 0.2em 5px;
        padding: 0.2em 0.3em;
        color: #009eb7;
        cursor: pointer;
        display: inline-block;
    }
</style>
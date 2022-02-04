<template>
  <form>
      <div class="row smoke">
          <div class="col-10 offset-1">
              <div class="row nameForm panel">
                  <div class="col-12 boredered">
                      <div class="row">

                            <div class="col-12 sectionTitle">
                                Formulario de Nombres
                            </div>

                            <div class="col-4">
                                <input type="text" name="name" v-model="$parent.nameForm.name"  @input="changeToUpper()">
                                <label for="name">NOMBRE</label>
                            </div>
                            <div class="col-2 text-center">
                                <input type="checkbox" name="active" v-model="$parent.nameForm.active">
                                <label for="active">ACTIVO</label>
                            </div>
                            <div class="col-6 text-right">
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
    name: 'NameForm.vue',
    methods: {
        validateForm(){
            //test name
            if( this.$parent.nameForm.name == '' ){ this.$parent.$refs.toast.makeToast('warning', `Favor de capturar el nombre"`); return  }

            this.$parent.saveName();
        },
        changeToUpper() {
            this.$parent.nameForm.name = (this.$parent.nameForm.name).toUpperCase();
        },
    }
}
</script>

<style>

</style>
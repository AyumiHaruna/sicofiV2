<template>
  <form>
    <div class="row smoke">
      <div class="col-8 offset-2">
          <div class="row partForm">
            <div class="col-12 panel">
              <div class="row">
                <div class="col-12 bordered">
                  <div class="row">
                    <div class="col-4">
                      <select v-model="$parent.partForm.partNumber" @change="setPartName()" ref="partNumber" name="partNumber">
                        <option v-for="part in partList" :key="part.id" :value="part.partNumber">{{part.partNumber}} - {{part.partName}}</option>
                      </select>
                      <label for="partNumber">PARTIDA</label>
                    </div>
                    <div class="col-4">
                      <input type="number" min="0" max="99" v-model="$parent.partForm.notes" @keypress="isNumber($event)" ref="notes" name="notes">
                      <label for="notes">NO. DE NOTAS</label>
                    </div>
                    <div class="col-4">
                      <input type="number" @keypress="isNumber($event)" v-model="$parent.partForm.total" ref="total" name="total">
                      <label for="total">MONTO ($)</label>
                    </div>
                    <div class="col-12 text-right">
                      <button class="actionBtn closeBtn" @click.prevent="$parent.hideForm()">
                          <i class="fas fa-times"></i>
                          CANCELAR
                      </button>
                      <button class="actionBtn infoBtn" @click.prevent="validateForm()"> 
                          <i class="fas fa-puzzle-piece"></i>
                          AÑADIR PARTIDA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </form>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
  name: 'SFCompPartForm',
  mixins: [ GlobalFunctions ],
  data() {
    return {
      partList: {}
    }
  },
  mounted() {
    this.getPartsList();
  },
  methods: {
    //get authorized parts info
    async getPartsList() {
        const res = await fetch(`${process.env.apiUrl}/parts/list`);
          // if api response is ok 
        if( res.status === 200 ){
            const resData = await res.json();                
            // assign resData to partList
            this.partList = resData.results;                 
        } else {
            this.$parent.$refs.toast.makeToast('error', `No se pudo obtener la lista de partidas, intenta nuevamente`);
        }
    },

    setPartName(){
      this.partList.forEach(elm => {
        if( elm.partNumber == this.$parent.partForm['partNumber'] ){
            this.$parent.partForm['partName'] = elm.partName;
        }
      });
    },

    validateForm(){
      //test part 
      if( !this.$parent.partForm['partNumber'] ){ this.$refs.partNumber.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de elegir una "Partida"`); return  }
      //test notes 
      if( !this.$parent.partForm['notes'] ){ this.$refs.notes.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de captura el "No. de Notas"`); return  }
      //test total 
      if( !this.$parent.partForm['total'] || this.$parent.partForm['total'] <= 0 ){ this.$refs.total.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de capturar el "Monto"`); return  }
      //add data
      (this.$parent.compPartList).push(this.$parent.partForm);
      //hide form
      this.$parent.hideForm();
    }
  }
}
</script>

<style>
  .partForm{
    position: absolute; 
    top: 10vw;
  }
</style>
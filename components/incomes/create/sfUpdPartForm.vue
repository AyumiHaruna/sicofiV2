<template>
  <form>
      <div class="row smoke">
          <div class="col-8 offset-2">
              <div class="row partForm panel borderedPanel">
                  <div class="col-8">
                        <b-form-select ref="part" v-model="$parent.partForm['partNumber']" @change="getPartName">
                            <b-form-select-option value="">- Elige una partida -</b-form-select-option>
                            <b-form-select-option :value="part.partNumber" v-for="(part, index) in partList" :key="index">
                                {{part.partNumber}} - {{part.partName}}
                            </b-form-select-option>
                        </b-form-select>
                        <label for="selectedChapter">PARTIDA</label>
                  </div>
                  <div class="col-4">
                        <input type="text" ref="amount" v-model="$parent.partForm['amount']" />
                        <label for="total">MONTO ($)</label>
                  </div>
                  <div class="col-12 text-right">
                        <button class="actionBtn closeBtn" @click.prevent="$parent.hidePartForm()">
                            <i class="fas fa-times"></i>
                            CANCELAR
                        </button>
                        <button class="actionBtn infoBtn" @click.prevent="validateForm()"> 
                            <i class="fas fa-puzzle-piece"></i>
                            {{ ($parent.partForm['type'] === 'create') ? 'AÑADIR' : 'EDITAR' }} PARTIDA
                        </button>
                  </div>
              </div>
          </div>
      </div>
  </form>
</template>

<script>
export default {
    name: 'sfUpdPartForm',
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

        validateForm() {
            //test part 
            if( !this.$parent.partForm['partNumber'] ){ this.$refs.part.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de elegir una "Partida"`); return  }
            //test amount 
            if( !this.$parent.partForm['amount'] || this.$parent.partForm['amount'] <= 0 ){ this.$refs.amount.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de capturar el "Monto"`); return  }

            this.$parent.movePartToSF({
                amount: this.$parent.partForm['amount'],
                partNumber: this.$parent.partForm['partNumber'],
                partName: this.$parent.partForm['partName']
            }, this.$parent.partForm['index'], this.$parent.partForm['type'], );
        },

        getPartName() {
            this.partList.forEach(elm => {
                if( elm.partNumber == this.$parent.partForm['partNumber'] ){
                    this.$parent.partForm['partName'] = elm.partName;
                }
            });
        },
    }
}
</script>

<style>
    .smoke {
        background-color: rgba(0,0,0,0.5);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 2;
    }

    .partForm {
        margin-top: 15em;
        padding: 2em;
    }

    .title{
        margin-bottom: 1.5em;
    }
</style>
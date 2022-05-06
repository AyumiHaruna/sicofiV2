<template>
  
  <div class="row block">
    <div class="col-12 panel">
      <div class="row">
        <div class="col-12 bordered">
          <div class="col-12 sectionTitle">
            DATOS GENERALES
          </div>

          <div class="col-12 formBody">
            <div class="row">
              <div class="col-12">
                <label>
                  ÚLTIMO FOLIO DE <span>"{{($parent.outcome.payType).toUpperCase()}}"</span> REGISTRADO: <span>{{$parent.lastCheckNumber}}</span>
                </label>
              </div>

              <div class="col-3">
                <select name="payType" v-model="$parent.outcome.payType" @change="getLastId()"
                  :class="($parent.type=='Edición')? 'blockedField' : ''" :disabled="$parent.type=='Edición'"
                >
                  <option value="Cheque">Cheque</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Diario">Diario</option>
                </select>
                <label for="payType">TIPO DE PAGO</label>
              </div>
              <div class="col-3">
                <input type="text" name="checkNumber" v-model="$parent.outcome.checkNumber" @input="autoFillFoil()"
                  :class="($parent.type=='Edición')? 'blockedField' : ''" :readonly="$parent.type=='Edición'"
                >
                <label for="checkNumber">NÚMERO DE CHEQUE</label>
              </div>
              <div class="col-3">
                <input type="text" name="foil" v-model="$parent.outcome.foil">
                <label for="foil">FOLIO</label>
              </div>
              <div class="col-3">
                <input type="date" name="elabDate" v-model="$parent.outcome.elabDate">
                <label for="elabDate">FECHA DE ELABORACIÓN</label>
              </div>
              
              <div class="col-3">
                <select name="projectNumber" v-model="$parent.outcome.projectNumber" @change="getAvalibleAmounts()">
                  <option value="">-Elige un proyecto-</option>
                  <option v-for="proj in projectsList" :key="proj.projectNumber" :value="proj.projectNumber">
                    {{proj.projectNumber}} - {{proj.projectName}}
                  </option>
                </select>
                <label for="projectNumber">PROYECTO</label>
              </div>
              <div class="col-3">
                <select name="account" v-model="$parent.outcome.account" @change="getAvalibleAmounts()">
                  <option value="">-Elige el tipo de cuenta-</option>
                  <option v-for="(account, index) in $store.state.accountType" :key="index" :value="index+1">
                    {{account}}
                  </option>
                </select>
                <label for="account">CUENTA</label>
              </div>

              <div class="col-6">  
                <input type="text" list="suggestions" v-model="$parent.outcome.sign" @input="changeToUpper()">
                    <datalist id="suggestions">
                        <option v-for="(suggest, index) in suggestions" :key="index">{{suggest.name}}</option>
                    </datalist>
                <label>A FAVOR DE: </label>
              </div>

              <div class="col-6">
                <textarea name="concept" v-model="$parent.outcome.concept"></textarea>
                <label for="concept">CONCEPTO</label>
              </div>
              <div class="col-6">
                <textarea name="obs"></textarea>
                <label for="obs">OBSERVACIONES</label>
              </div>

              <div class="col-4 text-center">
                <b-form-checkbox v-model="$parent.outcome.viatics" name="viatics" value="1"></b-form-checkbox>
                <label for="viatics">VIÁTICOS</label>
              </div>
              <div class="col-4">
                <input type="date" name="valStart" v-model="$parent.outcome.valStart">
                <label for="valStart">INICIO DE VIGENCIA</label>
              </div>
              <div class="col-4">
                <input type="date" name="valEnd" v-model="$parent.outcome.valEnd">
                <label for="valEnd">FIN DE VIGENCIA</label>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'OutMainForm',
  props: [ 'year' ],
  data() {
    return {
      projectsList: [],
      suggestions: [],
      dataObject: {
        year: '',
        id: '',
        fullAccess: 0,
        projectList: []
      },
    }
  },
  mounted() {

    if(process.client){
      this.dataObject.year = localStorage.getItem('year');
      this.dataObject.id = localStorage.getItem('id');
      this.dataObject.fullAccess = localStorage.getItem('fullAccess');
      if(this.dataObject.fullAccess == 0){
          this.dataObject.projectList = localStorage.getItem('projectList');
      }
    }
    
    this.getProjectsList( this.year );
    this.getPeopleList();

    if( this.$parent.type == 'Edición'){      
      this.$parent.getOutcomeData( this.$parent.outcomeId );
      setTimeout(()=>{
        this.getAvalibleAmounts()
      }, 1500);
    }
  },
  methods: {
    async getProjectsList( year ) {
      // // get projects list
      // const res = await fetch(`${process.env.apiUrl}/projects/simple_list/${year}`);
      
      // if( res.status === 200 ){
      //     const resData = await res.json();
      //     if( resData.status === 200 ){
      //         this.projectsList = resData.results;
      //     }
      // } else {
      //     this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
      // }
      const res = await fetch(`${process.env.apiUrl}/projects/simple_list`, {
          method: 'post',
          headers: {
              'content-type': 'application/json'
          },
          body: JSON.stringify(this.dataObject)
      });
      if( res.status === 200 ){
          const resData = await res.json();
          if( resData.status === 200 ){
              this.projectsList = resData.results;
          }
      } else {
          this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
      }
    },

    async getAvalibleAmounts(){
      if( this.$parent.outcome.projectNumber == '' || this.$parent.outcome.account == '' ){
        return;
      }

      const res = await fetch (`${process.env.apiUrl}/outcomes/avalible`, {
        method: 'POST',
        header: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          projectNumber: this.$parent.outcome.projectNumber,
          account: this.$parent.outcome.account,
          year: this.year,
          outcomeId: this.$parent.outcomeId
        })
      });


      if( await res.status === 200 ){
        const resData = await res.json();
        this.$parent.avalibleAmounts = resData.results;
      } else {
        this.$parent.$refs.toast.makeToast('error', `Error al buscar los montos disponibles, intenta nuevamente`);
      }
    },

    async getLastId(){
      if(this.$parent.outcome.payType == ''){
        return;
      }

      const res = await fetch(`${process.env.apiUrl}/outcomes/lastId`, {
        method: 'POST',
        header: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          payType: this.$parent.outcome.payType,
          year: this.year,
        })
      });

      if( await res.status === 200 ){
          const resData = await res.json();
          this.$parent.lastId = resData.results.id;
          this.$parent.lastCheckNumber = resData.results.checkNumber;
      } else {
          this.$refs.toast.makeToast('error', `Error al buscar el último número de cheque capturado, intenta nuevamente`);
      }
    },

    async getPeopleList(){
        // get projects list
        const res = await fetch(`${process.env.apiUrl}/people/list`);
        
        if( res.status === 200 ){
            const resData = await res.json();
            if( resData.status === 200 ){
              this.suggestions = resData['results'];
            }
        } else {
            this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
        }
    },

    autoFillFoil() {
      this.$parent.outcome.foil = this.$parent.outcome.checkNumber
    },

    changeToUpper() {
        this.$parent.outcome['sign'] = (this.$parent.outcome['sign']).toUpperCase();
    },
  },
}
</script>

<style>

</style>
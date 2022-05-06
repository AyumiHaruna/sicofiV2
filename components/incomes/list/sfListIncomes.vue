<template>
  <div class="row">
    <div class="col-12 sfListIncomes sfBlock">
      <div class="row">
        <div class="col-12 sectionTitle">
          {{ (account == 1)? "CUENTA DE LA COORDINACIÓN" : "CUENTA DEL INSTITUTO" }} 
        </div>

        <div class="col-12">
          <table class="secondLvl" v-for="sf in accountList" :key="sf.sfId"> 
            <tr>
              <th>DB # / S.F. #</th>
              <th>S.F. ID</th>
              <th>CONCEPTO</th>
              <th>OPERACIÓN</th>
              <th>SOLICITADO</th>
              <th v-for="num1 in 5" :key="num1">CAP {{num1}}000</th>    
              <th>FECHA ELAB.</th>       

              <th rowspan="2" v-if="sf.type == 'ing'">
                IMPRIMIR S.F. <br><br>
                <a :href="`${getApiUrl}/print/income/${sf.id}`" target="_blank">
                  <button class="miniBtn warningBtn" v-b-tooltip.hover title="Imprimir S.F." alt="Imprimir S.F.">
                    <i class="fas fa-print"></i>
                  </button>
                </a>
              </th>   
              <th rowspan="2" v-else>
                ELIMINAR REINTEGRO 
                  <button class="miniBtn closeBtn" v-b-tooltip.hover title="Eliminar reintegro" alt="Eliminar reintegro" @click="askForDelete(sf.sfId)">
                    <i class="far fa-trash-alt"></i>
                  </button>
              </th>

            </tr>
            <tr>
              <td>{{sf.id}} / {{sf.sfNum}}</td>
              <td rowspan="3">{{sf.sfId}}</td>
              <td rowspan="3" class="conceptCell">{{sf.concept}}</td>
              <td :class="(sf.type=='ing')? 'green' : 'yellow'">{{ (sf.type == 'ing')? 'Ingreso' : 'Reintegro' }}</td>
              <td>${{moneyFormat(sf.requested)}}</td>
              <td v-for="num1 in 5" :key="num1">${{moneyFormat(sf.data[`cap${num1}`])}}</td>
              <td >{{sf.elabDate}}</td>
            </tr>  
            <tr>
              <th rowspan="2" v-if="sf.type == 'ing'">
                MODIFICAR <br>
                <nuxt-link :to="`/ingresos/sf_formulario?code=${sf.sfId}`">
                  <button class="miniBtn saveBtn" v-b-tooltip.hover title="Modificar S.F." alt="Modificar S.F.">
                    <i class="fas fa-pen"></i>
                  </button>
                </nuxt-link>
              </th> <th rowspan="2" v-else></th>

              <th rowspan="2" v-if="sf.type == 'ing'">
                VALIDACIONES <br>
                <nuxt-link :to="`/ingresos/sf_validacion?code=${sf.sfId}`">
                  <button class="miniBtn infoBtn" v-b-tooltip.hover title="Validaciones" alt="Validaciones">
                    <i class="fas fa-hand-holding-usd"></i>
                  </button>
                </nuxt-link>
              </th> <th rowspan="2" v-else></th>

              <th>VALIDADO</th>
              <th>POR VALIDAR</th>
              <th>% VALIDACIÓN</th>
              
              <th rowspan="2" v-if="sf.type == 'ing'">
                COMPROBACIONES <br>
                <nuxt-link :to="`/ingresos/sf_comprobaciones?code=${sf.sfId}`" v-if="sf.ministered != 0">
                  <button class="miniBtn infoBtn" v-b-tooltip.hover title="Comprobaciones" alt="Comprobaciones">
                    <i class="fas fa-clipboard-check"></i>
                  </button>
                </nuxt-link>
              </th> <th rowspan="2" v-else></th>
              
              <th>COMPROBADO</th>
              <th>POR COMPROBAR</th>
              <th>% COMPROBACIÓN</th>
              <th rowspan="2" v-if=" sf.type=='ing' && level == 1 ">
                ELIMINAR S.F <br>
                <button class="miniBtn closeBtn" v-b-tooltip.hover title="Eliminar Solicitud de Fondos" alt="Eliminar Solicitud de Fondos" @click="askForDelete(sf.sfId)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </th>
            </tr>
            <tr>
              <td>${{moneyFormat(sf.ministered)}}</td>
              <td>${{moneyFormat(sf.requested - sf.ministered)}}</td>
              <td>{{ ((sf.requested != 0)? ((sf.ministered * 100) / sf.requested) : 0).toFixed(2) }}%</td>

              <td>${{moneyFormat(sf.checked)}}</td>
              <td>${{moneyFormat(sf.ministered - sf.checked)}}</td>
              <td>{{ ((sf.ministered != 0)? ((sf.checked * 100) / sf.ministered) : 0).toFixed(2) }}%</td>
            </tr>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'sfListIncomes',
    mixins: [ GlobalFunctions ],
    props: [ 'account', 'sfList' ],

    data() {
      return {
        visible: [],
        level: 0
      }
    },
    mounted(){
      this.level = localStorage.getItem('level');
    },
    methods: {
      togglePanel( index ){
        this.$set(this.visible, index, !this.visible[index])
      },

      askForDelete( index ) {
        this.$swal.fire({
            title: 'Deseas eliminar ésta entrada!?',
            type: 'question',
            showCancelButton: true,
            showConfirmButton: true,                
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            reverseButtons: true
        }).then((result) => {
          if (result.value) {
            this.$parent.$parent.$parent.deleteRow( index );
          }
        });
      }
    },

    computed: {
      accountList: function(){
        return (this.sfList).filter( (elm) => {
          if(elm.account == this.account){
            return elm;
          }
        });
      },
    },
}
</script>

<style>
  .sfListIncomes.sfBlock{
    background: #363e4a;
    padding: 0.5em 1em;
  }
</style>
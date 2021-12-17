<template>
  <div class="row">
    <div class="col-12 sfBlock">
      <div class="row">
        <div class="col-12 accountTitle"><label> {{ (account == 1)? "CUENTA DE LA COORDINACIÓN" : "CUENTA DEL INSTITUTO" }} </label></div>

        <div class="col-12">
          <table class="sfTable" v-for="sf in accountList" :key="sf.sfId"> 
              <tr>
                <th>S.F. #</th>
                <th>S.F. ID</th>
                <th>CONCEPTO</th>
                <th>OPERACIÓN</th>
                <th>SOLICITADO</th>
                <th v-for="num1 in 5" :key="num1">CAP {{num1}}000</th>    
                <th>FECHA ELAB.</th>            
                <th rowspan="4">
                  IMPRIMIR S.F. <br><br>
                  <nuxt-link :to="`/ingresos/sf_impresion?code=${sf.sfId}`">
                    <button class="plusBtn saveBtn" v-b-tooltip.hover title="Imprimir S.F." alt="Imprimir S.F.">
                      <i class="fas fa-print"></i>
                    </button>
                  </nuxt-link>
                </th>
              </tr>
              <tr>
                <td>{{sf.sfNum}}</td>
                <td rowspan="3">{{sf.sfId}}</td>
                <td rowspan="3" class="conceptCell">{{sf.concept}}</td>
                <td>{{ (sf.type == 'ing')? 'Ingreso' : 'Reintegro' }}</td>
                <td>${{moneyFormat(sf.requested)}}</td>
                <td v-for="num1 in 5" :key="num1">${{moneyFormat(sf.data[0][`cap${num1}`])}}</td>
                <td >{{sf.elabDate}}</td>
              </tr>  
              <tr>
                <th rowspan="2">
                  MODIFICAR <br>
                  <nuxt-link :to="`/ingresos/sf_formulario?code=${sf.sfId}`">
                    <button class="plusBtn saveBtn" v-b-tooltip.hover title="Modificar S.F." alt="Modificar S.F.">
                      <i class="far fa-edit"></i> 
                    </button>
                  </nuxt-link>
                </th>
                <th rowspan="2">
                  VALIDACIONES <br>
                  <nuxt-link :to="`/ingresos/sf_validacion?code=${sf.sfId}`">
                    <button class="plusBtn infoBtn" v-b-tooltip.hover title="Validaciones" alt="Validaciones">
                      <i class="fas fa-hand-holding-usd"></i>
                    </button>
                  </nuxt-link>
                </th>
                <th>VALIDADO</th>
                <th>POR VALIDAR</th>
                <th>% VALIDACIÓN</th>
                
                <th rowspan="2">
                  COMPROBACIONES <br>
                  <nuxt-link :to="`/ingresos/sf_comprobaciones?code=${sf.sfId}`">
                    <button class="plusBtn warningBtn" v-b-tooltip.hover title="Comprobaciones" alt="Comprobaciones">
                      <i class="fas fa-clipboard-check"></i>
                    </button>
                  </nuxt-link>
                </th>
                <th>COMPROBADO</th>
                <th>POR COMPROBAR</th>
                <th>% COMPROBACIÓN</th>
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
        visible: []
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

    methods: {
      togglePanel( index ){
        this.$set(this.visible, index, !this.visible[index])
      },
    }
}
</script>

<style>
  .sfBlock{
    background: #192266;
    padding: 0.5em 1em;
  }

  .accountTitle{
    text-align: center;
    padding: 0.5em;
    font-weight: bold;
    font-size: 0.85em;
    letter-spacing: 1.5px;
    text-decoration: underline;
  }

  table.sfTable{
    table-layout: fixed;
    width: 100%;
    word-wrap: break-word; 
    margin-bottom: 0.5em;
    text-align: center;
    font-size: 0.9em;
  }
  table.sfTable th{
    padding: 0.5em 0.5em;
    background-color: #111;
    font-size: 0.7em;
    letter-spacing: 1.3px;
    border: solid 1px #000;
  }
  table.sfTable tr{
    background-color: #565656;
  }
  table.sfTable td{
    font-size: 0.8em;
    width: 7.14%;
    border: solid 1px #000;
    padding: 0.5em;
  }
  
  table.sfTable .conceptCell{
    font-size: 0.8em;
    width: 14.2%
  }

  .plusBtn{        
    border: solid 0px #fff;
    border-radius:5px;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-weight: bold;
    padding: 0.8em 1.1em;
    text-decoration:none;
    margin: 0.5em 1em;
    letter-spacing: 1.3px;
  }
  .plusBtn i{
    font-size: 1.8em !important;
  }
  .plusBtn:active {
    position:relative;
    top:1px;
  }

</style>
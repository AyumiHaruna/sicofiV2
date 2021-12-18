<template>
    <div class="row block">
        <div class="col-12 panel">

            <div class="row">
                <div class="col-12"> <label>LISTA DE COMPROBACIONES</label> </div>
                <div class="col-12">
                    <table class="compTable">
                        <thead>
                            <tr>
                                <th>CARATULA</th>
                                <th>FECHA COMPROBACIÓN</th>
                                <th>TRANSFERENCIA</th>
                                <th v-for="num in 5" :key="num">CAP{{num}}</th>
                                <th>TOTAL</th>
                                <th>IMPRIMIR</th>
                                <th>MODIFICAR</th>
                                <th>ELIMINAR</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="check in income.checkings" :key="check.id">  
                                <td>C - {{check.cover}}</td>
                                <td>{{check.elabDate}}</td>
                                <td>{{check.transfer}}</td>
                                <td v-for="num in 5" :key="num">
                                    ${{ moneyFormat(check[`cap${num}`]) }}
                                </td>
                                <td>${{ moneyFormat(check.checked) }}</td>
                                <td>
                                    <nuxt-link :to="`/ingresos/sf_comprobaciones/sf_comprobaciones_formulario?code=${income.sfId}`">
                                        <button class="plusBtn warningBtn" v-b-tooltip.hover title="Añadir Comprobación" alt="Añadir Comprobación">
                                            <i class="fas fa-clipboard-check"></i>
                                        </button>
                                    </nuxt-link>
                                </td>
                                <td>
                                    <nuxt-link :to="`/ingresos/sf_comprobaciones/sf_comprobaciones_formulario?code=${income.sfId}&id=${check.id}`">
                                        <button class="plusBtn warningBtn" v-b-tooltip.hover title="Añadir Comprobación" alt="Añadir Comprobación">
                                            <i class="fas fa-clipboard-check"></i>
                                        </button>
                                    </nuxt-link>
                                </td>
                                <td>
                                    <nuxt-link :to="`/ingresos/sf_comprobaciones/sf_comprobaciones_formulario?code=${income.sfId}`">
                                        <button class="plusBtn warningBtn" v-b-tooltip.hover title="Añadir Comprobación" alt="Añadir Comprobación">
                                            <i class="fas fa-clipboard-check"></i>
                                        </button>
                                    </nuxt-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'SFCompList',
    props: [ 'income' ],
    mixins: [ GlobalFunctions ],
}
</script>

<style>
table.compTable{
    table-layout: fixed;
    width: 100%;
    word-wrap: break-word; 
    margin-bottom: 0.5em;
    text-align: center;
    font-size: 0.9em;
  }
  table.compTable th{
    padding: 0.5em 0.5em;
    background-color: #111;
    font-size: 0.8em;
    letter-spacing: 1.3px;
    border: solid 1px #000;
  }
  table.compTable tr{
    background-color: #565656;
  }
  table.compTable td{
    font-size: 0.9em;
    width: 7.14%;
    border: solid 1px #000;
    padding: 1em !important;
  }
  
  table.compTable .conceptCell{
    font-size: 0.8em;
    width: 14.2%
  }
</style>
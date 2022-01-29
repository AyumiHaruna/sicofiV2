<template>
    <div class="row block">
        <div class="col-12 panel">

            <div class="row">
                <div class="col-6">
                    <a :href="`${getApiUrl}/print/SFgobal_comp/${income.id}`" target="_blank">
                        <button class="actionBtn warningBtn" v-b-tooltip.hover title="Imprimir Comprobación" alt="Imprimir Comprobación">
                            <i class="fas fa-print"></i> COMPROBACIÓN GLOBAL
                        </button>
                    </a>
                </div>
                <div class="col-6 sectionTitle">LISTA DE COMPROBACIONES</div>
                <div class="col-12">
                    <table class="secondLvl">
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
                                    <a :href="`${getApiUrl}/print/income_comp/${income.id}/${check.id}`" target="_blank">
                                        <button class="miniBtn warningBtn" v-b-tooltip.hover title="Imprimir Comprobación" alt="Imprimir Comprobación">
                                            <i class="fas fa-print"></i>
                                        </button>
                                    </a>
                                </td>
                                <td>
                                    <nuxt-link :to="`/ingresos/sf_comprobaciones/sf_comprobaciones_formulario?code=${income.sfId}&id=${check.id}`">
                                        <button class="miniBtn saveBtn" v-b-tooltip.hover title="Editar Comprobación" alt="Editar Comprobación">
                                            <i class="far fa-edit"></i>
                                        </button>
                                    </nuxt-link>
                                </td>
                                <td>
                                    <button class="miniBtn closeBtn" v-b-tooltip.hover title="Eliminar Comprobación" alt="Eliminar Comprobación" @click="$parent.askForDelete(check.id)">
                                        <i class="far fa-trash-alt"></i>
                                    </button>
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
</style>
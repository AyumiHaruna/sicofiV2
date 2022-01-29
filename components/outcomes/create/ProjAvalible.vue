<template>
    <div class="row block">
        <div class="col-12 panel">
            <div class="row">
                <div class="col-12 bordered">
                    <div class="row">
                        <div class="col-12">
                            <label>DISPONIBLE POR CAPÍTULO</label>
                        </div>
                        
                        <div class="col-12">
                            <table class="secondLvl">
                                <tr v-for="(amount, index) in 5" :key="index">
                                    <th>CAP. {{index+1}}000:</th>
                                    <td>
                                        ${{moneyFormat($parent.avalibleAmounts[`cap${index+1}`])}}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'ProjAvalible',
    mixins: [ GlobalFunctions ],
}
</script>

<style>

</style>
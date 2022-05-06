<template>
    
        <div class="row smoke">
            <div class="col-8 offset-2">
                <div class="row billForm">
                    <div class="col-12 panel">
                        <div class="row">
                            <div class="col-12 bordered">
                                <div class="row">
                                    <div class="col-12 p-2 text-center" v-if="$parent.billData.repeated">
                                        Este folio ya ha sido ocupado antes en el cheque {{$parent.duplicatedNumber}}
                                    </div>
                                    <div class="col-8">
                                        <input type="text" name="bill_foil" ref="bill_foil" v-model.trim="$parent.billData.foil" @change="testFoil()">
                                        <label for="bill-foil">FOLIO DE FACTURA</label>
                                    </div>
                                    <div class="col-4">
                                        <input type="text" name="bill_total" ref="bill_total" v-model="$parent.billData.total" @keypress="isNumber()">
                                        <label for="bill-total">TOTAL DE LA FACTURA</label>
                                    </div>

                                    <div class="col-4">
                                        <textarea name="bill-obs" cols="30" rows="2" v-model.trim="$parent.billData.obs"></textarea>
                                        <label for="bill-obs">OBSERVACIONES</label>
                                    </div>
                                    <div class="col-8 p-2 text-center">
                                        <button class="actionBtn closeBtn" @click="$parent.closeBill()">
                                            <i class="fas fa-times"></i>
                                            CANCELAR
                                        </button>
                                        <button class="actionBtn infoBtn" @click.prevent="validateBill($event)"> 
                                            <i class="fas fa-file-invoice-dollar"></i> AÑADIR FACTURA
                                        </button>
                                    </div>
                                </div>
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
    name: 'BillForm',
    mixins: [ GlobalFunctions ],
    methods: {
        async testFoil(e){
            if( this.$parent.billData.foil <= 0) {
                return;
            }
            // if is posible - auto fill total 
            let vTotal = null;
            let subFoil = null;
            let subId = null;
            // get subId and vTotal
            if( (this.$parent.billData.foil).indexOf('/tt¿') != -1 ){
                subFoil = (this.$parent.billData.foil).split( '/tt¿' );
                subId = (subFoil[0]).split('id¿');
                subId = (subId[1]).split('/');
                subId = subId[0];
                vTotal = parseFloat(subFoil[1]);
            } else if( (this.$parent.billData.foil).indexOf('/tt') != -1 ){
                subFoil = (this.$parent.billData.foil).split( '/tt' );
                subId = (subFoil[0]).split('id¿');
                subId = (subId[1]).split('/');
                subId = subId[0];
                vTotal = parseFloat(subFoil[1]);
            } else {
                subId = this.$parent.billData.foil;
            }

            // set vTotal 
            if(vTotal != null){
                this.$parent.billData.total = vTotal;
            }

            
            // Test if foil exists 
            const res = await fetch(`${process.env.apiUrl}/outcomes/comp/test`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    subId: subId,
                    year: this.$parent.outcome.year
                })
            });                        

            if( res.status === 200 ){                
                const resData = await res.json();  
                if( resData.results != null){   // if exists 
                    // ask if is OK
                    this.$swal.fire({
                        title: `Factura duplicada en el egreso ${resData.results}`,
                        type: 'question',
                        showConfirmButton: true,         
                        confirmButtonText: 'OK',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.value) {
                            this.$parent.billData.repeated = true,
                            this.$parent.billData.authorize = localStorage.getItem('id');
                            this.$parent.duplicatedNumber = resData.results; 
                        }
                    });
            
                } else {    // if not 
                    this.$parent.billData.repeated = false,
                    this.$parent.billData.authorize = '';
                }
            } else {
                this.$refs.toast.makeToast('error', `No se pudo consultar la existencia de la factura`);
            }
        },

        validateBill(e){
            // console.log(e);
            // e.preventDefault();
            //test compDate 
            if( !this.$parent.billData['foil'] ){ this.$refs.bill_foil.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de capturar el "Folio"`); return  }
            //test total
            if( !this.$parent.billData['total'] || this.$parent.billData['total'] == 0 ){ this.$refs.bill_total.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de capturar el "Total"`); return  }

            this.$parent.saveBill();
        }
    }
}
</script>

<style>
    .billForm {
        margin-top: 15em;
        padding: 2em;
    }
</style>
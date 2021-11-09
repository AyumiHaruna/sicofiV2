<template>
    <div class="row">
        <div class="col-12">
            <b-toast id="msg-toast" :variant="toastElm.variant" solid>
                <template #toast-title>
                    <div class="d-flex flex-grow-1 align-items-baseline">
                        <i class="fas fa-check" v-if="toastElm.variant === 'success'"></i>
                        <i class="fas fa-exclamation" v-if="toastElm.variant === 'warning'"></i>
                        <i class="fas fa-times" v-if="toastElm.variant === 'danger'"></i>
                    </div>
                </template>
                {{ toastElm.msg }}
            </b-toast>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Toast',
    data() {
        return {
            toastElm: {
                variant: '',
                msg: ''
            },
        }
    },
    methods: {
        makeToast( type, msg ){

            // this.toastElm.variant = type;
            // this.toastElm.msg = msg;
            // this.$bvToast.show('msg-toast')

            const Toast = this.$swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                type: type,
                title: msg
            })
        },
    }
}
</script>

<style>

</style>
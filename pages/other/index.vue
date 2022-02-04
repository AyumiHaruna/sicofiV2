<template>
    <div class="row other">
        <div class="col-12">

            <div class="row">
                <div class="col-6">
                    <YearAdmin />
                </div>
                <div class="col-6">
                    <AuthAdmin />
                </div>
            </div>

            <Toast ref="toast"></Toast>     
            <LogTest ref="logTest" />  

        </div>
    </div>
</template>

<script>
import YearAdmin from '@/components/other/YearAdmin.vue';
import AuthAdmin from '~/components/other/AuthAdmin.vue';

import Toast from '@/components/general/Toast.vue';
import LogTest from '@/components/general/LogTest.vue';

export default {
    name: 'Other',
    components: { YearAdmin, AuthAdmin, Toast, LogTest  },
    mounted() {
        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 1 );
    },
}
</script>

<style>

</style>
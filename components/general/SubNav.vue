    <template>
    <div class="col-12 subNav text-right">
        <ul class="crumb2">
            
            <NuxtLink to="/">
                <li style="border-radius: 50px 0 0 50px; padding-left: 15px;">
                    Inicio                
                </li>
            </NuxtLink>
        
            <NuxtLink :to="`/${page.currentUrl}`" v-for="(page, index) in urlCollection" :key="index" >
                <li :style="(index == urlCollection.length - 1 )? 'border-radius: 0 50px 50px 0; padding-right: 15px; font-weight:normal; color:#fff; background:orange; cursor:default;'  : ''"
                    :class="(page.urlName == '')? 'hidden' : ''"
                >
                    <!-- :style="(index == urlCollection.length )? 'border-radius: 0 50px 50px 0; padding-right: 15px; background:orange; cursor:default;'  : ''" -->
                    {{ ((page.urlName).split("?"))[0] }}
                </li>
            </NuxtLink>
            
        </ul>
    </div>
</template>

<script>
export default {
    name: "SubNav",
    data() {
        return {
            urlCollection: '',
        }
    },
    methods: {
        getUrl(){
            //reset url collection array
            this.urlCollection = [];

            //get array of pages
            let currentRoute = (this.$route.fullPath).split('/');
            currentRoute.shift();
            

            for (let i = 0; i < currentRoute.length; i++) {
                let url = '';
                for (let j = 0; j <= i; j++) {
                    url += currentRoute[j];
                    if( currentRoute[i] == 'sf_comprobaciones' && currentRoute[j] == 'sf_comprobaciones' ){
                        // let currentComp = ((localStorage.getItem('lastSF')).split('%2'))[0];
                        url += `?code=${localStorage.getItem('lastSF')}`;
                    }
                    if( j != currentRoute.length -1 ){
                        url += '/';
                    }
                }
                // if(i != currentRoute.length - 1){
                    this.urlCollection.push({urlName: currentRoute[i], currentUrl: url});
                // }
            }
        }
    },
    mounted() {
        this.getUrl();
    },
    watch: {
        '$route' () {
            this.getUrl();
        }
    },
}
</script>

<style>
    .subNav{
        margin: 1em 0;
        text-align: left;
    }
    .crumb2 li
    {
        display: inline-block;
        padding: 0.5em 1em;
        cursor: pointer;
        opacity: 1;
        border: solid 2px orange;
    }
    .crumb2 a{
        color: #A7D6F1;
        font-weight: bold;
        text-decoration: underline;
    }

    .crumb2 .hidden{
        display:none;
    }

    .crumb2 li:hover
    {
        background-color: rgba(255, 166, 0, 0.5);
        color: #fff;
    }
</style>
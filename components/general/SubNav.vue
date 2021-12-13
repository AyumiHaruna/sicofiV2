    <template>
    <div class="subNav">
        <ul class="crumb2">
            
            <NuxtLink to="/">
                <li style="border-radius: 50px 0 0 50px; padding-left: 15px;">
                    Inicio                
                </li>
            </NuxtLink>
        
            <NuxtLink :to="`/${page}`" v-for="(page, index) in urlCollection" :key="page" 
                :class="(index >= (urlCollection.length) - 1)? 'hidden' : '' "
            >
                <li>
                    {{page}}                
                </li>
            </NuxtLink>
            
            <li style="border-radius: 0 50px 50px 0; padding-right: 15px; background:orange;" 
                :class="(urlCollection[0] == '')? 'hidden' : ''">
                {{ urlCollection[ urlCollection.length -1] }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "SubNav",
    data() {
        return {
            urlCollection: [],
        }
    },
    methods: {
        getUrl(){
            this.urlCollection = [];
            let currentRoute = (this.$route.path).split('/');
            currentRoute.forEach( (elm, index) => {
                if( index != 0 ){
                    (this.urlCollection).push(elm);
                }
            });
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
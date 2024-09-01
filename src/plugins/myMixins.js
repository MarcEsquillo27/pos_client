import { mapState, mapMutations } from 'vuex';

const myPlugins = {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
                    apiUrl: process.env.VUE_APP_API_URL,
                    store_name:"",
                    address:"",
                    phone:"",
                    // printPaper: 10,
                    // name: this.$store.state.storedName.userdetails[0].name
                };
            },
            computed: {
                ...mapState([
                    'storedEmp',
                    'storedName',
                    'printPaper'
                ])
            },
            methods: {
                ...mapMutations([
                    'STORE_EMP',
                    'STORE_NAME',
                    'STORE_PAPER'
                ]),
                hasAccess(drawerLink, accessRight) {
                    const drawer = JSON.parse(this.$store.state.storedEmp.userdetails[0].access).find(item => item.drawerLink === drawerLink);
                    if (!drawer) {
                        return false; // Return false if the drawerLink is not found
                    }
                    // Check if the specified accessRight is true
                    return drawer.accessRights[accessRight] === true;
                },
     
               
                  
            },
            mounted() { 
                // this.getStore();
            },
        });
    }
};

export default myPlugins;

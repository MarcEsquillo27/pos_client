import { mapState, mapMutations } from 'vuex';
import axios from "axios";

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
                getStore() {
                    axios
                      .get(`${this.apiUrl}/storename/api/getStore`)
                      .then((res) => {
                        this.store_name = res.data[0].store_name;
                        this.address = res.data[0].address;
                        this.phone_number = res.data[0].phone_number;
                      });
                  },
                  
            },
            mounted() { 
                // this.getStore();
            },
        });
    }
};

export default myPlugins;

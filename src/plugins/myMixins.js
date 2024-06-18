import { mapState, mapMutations } from 'vuex';

const myPlugins = {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
                    access: JSON.parse(this.$store.state.storedEmp.userdetails[0].access),
                    apiUrl: process.env.VUE_APP_API_URL,
                    // name: this.$store.state.storedName.userdetails[0].name
                };
            },
            computed: {
                ...mapState([
                    'storedEmp',
                    'storedName'
                ])
            },
            methods: {
                ...mapMutations([
                    'STORE_EMP',
                    'STORE_NAME'
                ]),
                hasAccess(drawerLink, accessRight) {
                    const drawer = this.access.find(item => item.drawerLink === drawerLink);
                    if (!drawer) {
                        return false; // Return false if the drawerLink is not found
                    }
                    // Check if the specified accessRight is true
                    return drawer.accessRights[accessRight] === true;
                }
            }
        });
    }
};

export default myPlugins;

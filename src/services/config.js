export default {
    keys: {
        domain: process.env.VUE_APP_DOMAIN || '/',
        root_url: `${process.env.VUE_APP_ROOT_URL}` || 'https://zebest-api.herokuapp.com/',
        base_url: `${process.env.VUE_APP_ROOT_URL}/` || 'https://zebest-api.herokuapp.com/',
        front_url: `${process.env.VUE_APP_FRONT_SERVER}/` || `https://www.zebest.com/`,
        token: process.env.VUE_APP_TOKEN || 'zebest_token',
        user: process.env.VUE_APP_USER || 'zebest_user',
        aoi_version: process.env.VUE_APP_API_VERSION || 'api/v1',
        app_key: process.env.VUE_APP_KEY || 'base64:qfqr3qV0NU2R3/4VX11vwREaPpQbKfzyxxYbWKTFZFE=',
        stripe_key: process.env.VUE_APP_STRIPE_KEY || 'pk_test_51LTyiCAvIRwTcFP0XGOOe8m3WNPQe3pnuNoSddjzVS722ZKg5T1iueOl3Zla4RKoDMEj02nrLwWozmeFZD5jILfh00XsTj7Vdv',
        stripe_account: process.env.VUE_APP_STRIPE_ACCOUNT || 'acct_1LTyiCAvIRwTcFP0',
    },

    get(key) {
        return this.keys[key]
    },

    set(key, value) {
        this.keys[key] = value
    },
}

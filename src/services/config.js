export default {
    keys: {
        domain: process.env.VUE_APP_DOMAIN || 'https://zebest-api.herokuapp.com/',
        root_url: `${process.env.VUE_APP_ROOT_URL}` || 'https://zebest-api.herokuapp.com/',
        base_url: `${process.env.VUE_APP_ROOT_URL}/` || 'https://zebest-api.herokuapp.com/',
        front_url: `${process.env.VUE_APP_FRONT_SERVER}/` || `https://getzebest.com/`,
        token: process.env.VUE_APP_TOKEN || 'zebest_token',
        user: process.env.VUE_APP_USER || 'zebest_user',
        api_version: process.env.VUE_APP_API_VERSION || 'api/v1',
        app_key: process.env.VUE_APP_KEY || 'base64:qfqr3qV0NU2R3/4VX11vwREaPpQbKfzyxxYbWKTFZFE=',
        stripe_key: process.env.VUE_APP_STRIPE_KEY || 'pk_live_51LTyiCAvIRwTcFP0twHv98tHndjxIhxELkd6MAc4TtetTs83hj2KUS0a81LY5BLyxBcxoompV7MjPM06mECcmXKr00bDyYzOZN',
        stripe_account: process.env.VUE_APP_STRIPE_ACCOUNT || 'acct_1LTyiCAvIRwTcFP0',
        fixer_key: process.env.VUE_APP_FIXER_KEY || 'b0cd596ebb5d7e6a5e0a3aee12022b51',
    },

    get(key) {
        return this.keys[key]
    },

    set(key, value) {
        this.keys[key] = value
    },
}

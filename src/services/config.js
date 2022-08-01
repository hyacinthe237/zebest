export default {
    keys: {
        domain: process.env.VUE_APP_DOMAIN || '/',
        root_url: `${process.env.VUE_APP_ROOT_URL}` || 'https://zebest-api.herokuapp.com/',
        base_url: `${process.env.VUE_APP_ROOT_URL}/` || 'https://zebest-api.herokuapp.com/',
        front_url: `${process.env.VUE_APP_FRONT_SERVER}/` || `https://www.zebest.com/`,
        token: process.env.VUE_APP_TOKEN || 'zebest_token',
        user: process.env.VUE_APP_USER || 'zebest_user',
        app_key: process.env.VUE_APP_KEY || 'base64:qfqr3qV0NU2R3/4VX11vwREaPpQbKfzyxxYbWKTFZFE=',
    },

    get(key) {
        return this.keys[key]
    },

    set(key, value) {
        this.keys[key] = value
    },
}

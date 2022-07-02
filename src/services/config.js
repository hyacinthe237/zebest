export default {
    keys: {
        domain: process.env.VUE_APP_DOMAIN || '/',
        root_url: `${process.env.VUE_APP_ROOT_URL}` || 'http://api.archives.staging.izytechgroup.com:8000',
        base_url: `${process.env.VUE_APP_ROOT_URL}/services` || 'http://api.archives.staging.izytechgroup.com:8000/services',
        front_url: `${process.env.VUE_APP_FRONT_SERVER}/`,
        token: process.env.VUE_APP_TOKEN || 'izy_search_token',
        app_key: process.env.VUE_APP_KEY || 'base64:qfqr3qV0NU2R3/4VX11vwREaPpQbKfzyxxYbWKTFZFE=',
    },

    get(key) {
        return this.keys[key]
    },

    set(key, value) {
        this.keys[key] = value
    },
}

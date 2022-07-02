<template lang="html">
    <div id="sidebar-wrapper">
        <ul class="sidebar-nav">
            <li class="brand">
                <a @click.prevent="navigate({ name: 'home' })">
                    IzySearch
                </a>
            </li>

            <li class="location">
                {{ user.first_name }}
            </li>

            <li v-if="role==3">
                <router-link :to="{ name: 'user-logs' }">
                    <i class="feather icon-layers"></i>
                    {{ t('Queries') }}
                </router-link>
            </li>

            <li v-if="role==2 || role==1">
                <router-link :to="{ name: 'dashboard' }">
                    <i class="feather icon-layers"></i>
                    {{ t('Dashboard') }}
                </router-link>
            </li>

            <li v-if="role==2 || role==1">
                <router-link :to="{ name: 'files' }">
                    <i class="feather icon-paperclip"></i>
                    {{ t('Files') }}
                </router-link>
            </li>

            <li v-if="role==1">
                <router-link :to="{ name: 'organizations' }">
                    <i class="feather icon-briefcase"></i>
                    {{ t('Organizations') }}
                </router-link>
            </li>

            <li v-if="role==1">
                <router-link :to="{ name: 'subscriptions' }">
                    <i class="feather icon-bookmark"></i>
                    {{ t('Subscriptions') }}
                </router-link>
            </li>

            <li v-if="role==2 || role==1">
                <router-link :to="{ name: 'users' }">
                    <i class="feather icon-users"></i>
                    {{ t('Users') }}
                </router-link>
            </li>

            <li v-if="role==2 || role==1">
                <router-link :to="{ name: 'settings' }">
                    <i class="feather icon-settings"></i>
                    {{ t('Settings') }}
                </router-link>
            </li>

            <li>
                <router-link :to="{ name: 'profile' }">
                    <i class="feather icon-user"></i>
                    {{ t('My Account') }}
                </router-link>
            </li>

            <li>
                <a @click.prevent="signout()">
                    <i class="feather icon-log-out"></i>
                    {{ t('Sign out') }}
                </a>
            </li>
        </ul>

        <div class="sidebar-nav bottom">
            <div class="bottom-content">
                <div class="name">
                    <i class="feather icon-inbox"></i>
                    {{ t('Disk space') }}
                </div>

                <div class="range">
                    <div :class="`inner-range step-${sizecss}`"></div>
                </div>

                <div class="size">
                    {{ computeSize }} {{ t('used') }}
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import _ from 'lodash'

export default {
    props: {
        root: {
            type: Object,
            default: () => {}
        }
    },

    data: () => ({
        role: 1,
        sizecss: 0
    }),

    computed: {
        computeSize () {
            if (this.root && this.root.root) {
                let value = this.root.root.size
                let size = ''

                if (value >= 1000) {
                    let gb = value/1000
                    this.sizecss = parseInt(gb, 10)
                    size = gb.toFixed(2) + ' GB'
                } else { size = value.toFixed(2) + ' MB' }

                return size
            }
        },

        user () {
           return this.$store.state.users.user
        }
    },

    mounted () {
        this.role = localStorage.getItem('roleId')
    },

    methods: {
        signout () {
            this.$auth.logout()
            this.$store.commit('SET_TOGGLE_ICON', false)
        }
    }
}
</script>

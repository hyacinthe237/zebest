<template>
    <div class="_block-tabs">
        <div :class="['_block-tab', active == 'profile' ? 'active' : '' ]">
            <a :href="`/admin/users/managers/${user.code}`">
                <i class="feather icon-user"></i>
                <span>Profil</span>
            </a>
        </div>
        <div :class="['_block-tab', active == 'commerciaux' ? 'active' : '' ]">
            <a :href="`/admin/users/managers/${user.code}/commerciaux`">
                <i class="feather icon-users"></i>
                <span>Commerciaux</span>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Tabs',

    props: {
        active: { type: String, default: 'profile' },
    },

    computed: {
        user () {
            return this.$store.state.user
        },
    }
}
</script>

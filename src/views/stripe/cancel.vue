<template>
    <div>
        <section class="_header padding">
            <div class="block-h" id="navbar">
                <div class="logo pointer" @click="go('home')">zebest</div>
            </div>
        </section>

        <section class="home mt-20">
            <div class="block">
                <h2>donation annulée</h2>

                <div class="content-profile-photo mt-20">
                    <div class="photo">
                        <i class="feather icon-x"></i>
                    </div>
                </div>

                <div class="mt-20 text-center">
                    <button class="btn btn-primary br-100" @click="nouvelle()">
                        Faire une nouvelle donation
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script>

export default {

    methods: {
        nouvelle () {
            
        },
    },
}
</script>

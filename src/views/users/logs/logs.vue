<template lang="html">
    <div class="">
        <section class="_header" v-show="!isLoading">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-8">
                        <div class="search-container">
                            <form @submit.prevent class="_form">
                                <div class="form-group form-group-lg">
                                    <div class="inner-addon left-addon">
                                        <i class="glyphicon feather icon-search"></i>

                                        <input type="text"
                                            name="keywords"
                                            :placeholder="t('Query')"
                                            autocomplete="off"
                                            class="form-control form-control-lg"
                                            v-model="ghost.keywords"
                                        >
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="buttons text-right">
                            <button @click.prevent="goBack()" class="btn btn-dark">
                                <i class="feather icon-arrow-left"></i> {{ t('Back') }}
                            </button>

                            <button class="btn-secondary btn ml-2"
                                :disabled="isLoading"
                                @click="getQueries()"
                            >
                                Filtrer
                            </button>
                        </div>
                    </div>
                    <div class="col-sm-3 _form" v-if="isAdmin || isSuperAdmin">
                        <div class="form-group">
                            <select
                                name="user"
                                id="user"
                                v-model="ghost.user"
                                class="form-control form-control-lg"
                            >
                                <option value="" v-translate>Select user</option>
                                <option
                                    v-for="r in users"
                                    :key="r.uuid"
                                    :value="r.uuid"
                                >
                                    {{ r.first_name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="col-sm-3 _form" v-if="isAdmin || isSuperAdmin">
                        <div class="form-group">
                            <select
                                name="folder"
                                id="folder"
                                v-model="ghost.folder"
                                class="form-control form-control-lg"
                            >
                                <option value="" v-translate>Select folder</option>
                                <option
                                    v-for="f in folders"
                                    :key="f.uuid"
                                    :value="f.uuid"
                                >
                                    {{ f.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- <div class="col-sm-3 _form">
                        <div class="form-group">
                            <select
                                name="type"
                                id="type"
                                v-model="ghost.type"
                                class="form-control form-control-lg"
                            >
                                <option value="" v-translate>Select type</option>
                                <option
                                    v-for="t in types"
                                    :key="t.id"
                                    :value="t.id"
                                >
                                    {{ t.value }}
                                </option>
                            </select>
                        </div>
                    </div> -->

                    <div :class="isSuperAdmin ? 'col-sm-4 _form' : 'col-sm-3 _form'">
                        <div class="form-group">
                            <label for="start_date">Date début</label>
                            <input
                                type="date"
                                name="start_date"
                                v-model="ghost.start_date"
                                class="form-control form-control-lg"
                            >
                        </div>
                    </div>
                    <div :class="isSuperAdmin ? 'col-sm-4 _form' : 'col-sm-3 _form'">
                        <div class="form-group">
                            <label for="end_date">Date fin</label>
                            <input
                                type="date"
                                name="end_date"
                                v-model="ghost.end_date"
                                class="form-control form-control-lg"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard" v-show="!isLoading">
            <div class="container-fluid">
                <div v-if="queries.length == 0">
                    <div class="_empty">
                        <i class="feather icon-info"></i>
                        <p v-translate>No logs found</p>
                    </div>
                </div>

                <table class="table table-hover" v-else>
                    <thead>
                        <tr>
                            <th v-translate>Folder name</th>
                            <th v-translate>User</th>
                            <th v-translate>Organisation</th>
                            <th v-translate>Type</th>
                            <th v-translate>Query</th>
                            <th v-translate>At</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="f in filtered" :key="f.id"
                        >
                            <td>{{ f.folder.name }}</td>
                            <td>{{ f.user.first_name }}</td>
                            <td>{{ f.organisation.name }}</td>
                            <td>{{ f.type }}</td>
                            <td>{{ f.query }}</td>
                            <td>{{ f.date | datetime }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="mt-10 mb-20 ss-controls">
                    <button class="ss-controls-btn prev js-ss-prev" @click="prev()" v-if="page > 1">
                        <i class="feather icon-chevrons-left"></i> Previous
                    </button>
                    <button class="ss-controls-btn next js-ss-next" @click="next()"
                        v-if="queries.length >= size">
                    Next <i class="feather icon-chevrons-right"></i>
                    </button>
                </div>
            </div>
        </section>

        <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div>
    </div>
</template>

<script>
import logsMixins from './mixins'

export default {
    mixins: [logsMixins],
}
</script>

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

                            <button class="btn-danger btn ml-2"
                                :disabled="isLoading"
                                @click="confirmDeleteQueries()"
                                v-if="isSuperAdmin"
                            >
                                <i class="feather icon-trash-2"></i>
                            </button>

                            <button class="btn-secondary btn ml-2"
                                :disabled="isLoading"
                                @click="resetAll()"
                                v-if="isSuperAdmin"
                            >
                                <i class="feather icon-refresh-ccw"></i>
                            </button>

                            <button class="btn-secondary btn ml-2"
                                :disabled="isLoading"
                                @click="getQueries()"
                            >
                                Filtrer
                            </button>
                        </div>
                    </div>
                    <div :class="isSuperAdmin ? 'col-sm-4 _form' : 'col-sm-3 _form'">
                        <div class="form-group">
                            <label for="user" v-if="isAdmin">{{ t('Select user') }}</label>
                            <select
                                name="user"
                                id="user"
                                v-model="ghost.user"
                                class="form-control form-control-lg"
                            >
                                <option value="" v-translate>{{ t('Select user') }}</option>
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

                    <div :class="isSuperAdmin ? 'col-sm-4 _form' : 'col-sm-3 _form'">
                        <div class="form-group">
                            <label for="user" v-if="isAdmin">{{ t('Select folder') }}</label>
                            <select
                                name="folder"
                                id="folder"
                                v-model="ghost.folder"
                                class="form-control form-control-lg"
                            >
                                <option value="" v-translate>{{ t('Select folder') }}</option>
                                <option
                                    v-for="f in folders"
                                    :key="f.id"
                                    :value="f.id"
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
                                <option value="" v-translate>{{ t('Select type') }}</option>
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

                    <div class="col-sm-4 _form" v-if="isSuperAdmin">
                        <div class="form-group">
                            <select
                                name="org"
                                id="org"
                                v-model="ghost.org"
                                class="form-control form-control-lg"
                            >
                                <option value="" v-translate>{{ t('Select organization') }}</option>
                                <option
                                    v-for="o in orgs"
                                    :key="o.uuid"
                                    :value="o.uuid"
                                >
                                    {{ o.name }}
                                </option>
                            </select>
                        </div>
                    </div>

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

                <div v-else class="">
                    <nav aria-label="Page navigation example" class="btn-paginate">
                        <ul class="pagination">
                            <li :class="[{ noClick: paginateFreezeLeft }, 'page-item']">
                                <button type="button" class="page-link" @click="previousPage()">
                                   <i class="feather icon-chevron-left"></i>
                               </button>
                            </li>

                            <li class="page-item">
                                <button type="button" class="page-link pages-btns"
                                        v-for="pageNumber in pages.slice(page-1, page+5)"
                                        :key="pageNumber" @click="pageClicked(pageNumber)">
                                        {{ pageNumber }}
                                </button>
                            </li>

                            <li :class="[{ noClick: paginateFreezeRight }, 'page-item']">
                                <button type="button" @click="nextPage()" class="page-link">
                                    <i class="feather icon-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>

                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th v-translate>Folder name</th>
                                <th v-translate>User</th>
                                <th v-translate>Organisation</th>
                                <th v-translate>Type</th>
                                <th v-translate>Query</th>
                                <th v-translate>At</th>
                                <th v-if="isSuperAdmin">
                                    <div class="_select-all text-right pointer">
                                        <span v-translate>Select</span>
                                        <ItemCheckbox
                                            :types="'all'"
                                            :clicked="isClicked"
                                            @allselected="allselected"
                                        ></ItemCheckbox>
                                    </div>
                                </th>
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
                                <td v-if="isSuperAdmin">
                                    <ItemCheckbox
                                        id="meta_del_btn"
                                        :value="f.uuid"
                                        :selected="selected"
                                        @changed="QueriesChanged"
                                    >
                                    </ItemCheckbox>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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

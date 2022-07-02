<template lang="html">
    <div class="_side-modal modal animated fadeIn upload" id="userPreviewModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content" v-show="!isLoading">
                <div class="_modal-content bordered">
                    <button class="btn btn-grey" @click="closeAllModals()">
                        <i class="feather icon-x"></i>
                        {{ t('Close') }}
                    </button>
                </div>

                <!-- Uninstalling -->
                <div class="_modal-content">
                    <div class="secondary fs-18">
                        {{ name }}
                    </div>

                    <div class="row">
                      <div class="col-sm-8">
                        <div class="teal fs-15">
                            <ul class="list-unstyled">
                                <li>
                                    <span class="grey">{{ t('Username') }} :</span>
                                    {{ user.username }}
                                </li>
                                <li>
                                    <span class="grey">{{ t('Role') }} :</span>
                                    {{ t(role) }}
                                </li>
                                <li>
                                    <span class="grey">{{ t('Email') }} :</span>
                                    {{ user.email }}
                                </li>
                                <li>
                                    <span class="grey">{{ t('Status') }} :</span>
                                    {{ t('Active') }}
                                </li>
                                <li v-if="isSuperAdmin">
                                    <span class="grey">{{ t('Organisation') }} :</span>
                                    {{ t(user.organisation) }}
                                </li>
                                <li v-if="user.created_at">
                                    <span class="grey">{{ t('Added') }} :</span>
                                    {{ user.created_at | datetime }}
                                </li>
                                <li v-if="user.updated_at">
                                    <span class="grey">{{ t('Last modified') }} :</span>
                                    {{ user.updated_at | datetime }}
                                </li>
                            </ul>
                        </div>
                      </div>
                      <div class="col-sm-4">
                          <h5 v-translate>Groups</h5>
                          <ul class="teal fs-15 pl-20">
                              <li>Developers</li>
                              <li>Managers</li>
                          </ul>
                      </div>
                    </div>
                    <div class="buttons mt-20 mb-20">
                        <button class="btn-secondary btn mr-20" @click="editUser()">
                            <i class="feather icon-edit-2 mr-10"></i>
                            {{ t('Edit user') }}
                        </button>

                        <button class="btn-red btn mr-20" @click="confirmDeleteFiles()">
                            <i class="feather icon-trash mr-10"></i>
                            {{ t('Delete') }}
                        </button>
                    </div>
                </div>
            </div>
            <div v-show="isLoading" class="mt-40 pb-40 text-center">
                <izy-hollow-loading loading />
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import _ from 'lodash'

export default {
    data: () => ({
      page: 1
    }),

    props: {
        user: {
            type: Object,
            default: () => {}
        }
    },

    computed: {
        name () {
            return this.user.first_name + ' ' + this.user.last_name
        },

        role () {
            return this.user.role ? this.user.role.name : ''
        },

        isSuperAdmin () {
            return this.user.role === 1
        }
    },

    methods: {
        editUser () {
            window.$('.modal').modal('hide')
            this.openModal({ id: 'editUserModal' })
        },

        confirmDeleteFiles () {
            window.$('#userPreviewModal').modal('hide')

            Swal.fire({
                title: this.$translate.text('Delete user'),
                text: this.$translate.text("Are you sure you want to delete this user?"),
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$translate.text('Cancel'),
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: this.$translate.text('Yes, delete!')
            }).then((result) => {
                if (result.value) {
                    this.deleteUser()
                }
            })
        },

        async deleteUser () {
            this.startLoading()
            const res = await this.$api.delete('api/accounts/' + this.user.id + '/delete')
                .catch(error => {
                    console.log('error =>', error)
                    this.stopLoading()
                    this.$swal.error(this.$translate.text(error.response.data))
                })
                if (res) {
                    this.stopLoading()
                    this.closeAllModals()
                    this.$store.dispatch('users/getUsers')
                    this.$swal.success(this.$translate.text('User deleted successfully !'))
                }
        },
    }
}
</script>

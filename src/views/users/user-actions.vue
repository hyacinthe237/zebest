<template lang="html">
    <div class="">
        <section class="_header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="title">
                            {{ t('Users') }}
                            <i class="feather icon-users"></i>
                        </div>

                        <Breadcrumb :routes="breadcrumb"></Breadcrumb>
                    </div>

                    <div class="col-sm-8 text-right">
                        <div class="buttons">
                          <button
                              @click.prevent="goBack()"
                              class="btn btn-dark"
                              :disabled="isLoading"
                          >
                              <i class="feather icon-arrow-left"></i> {{ t('Back') }}
                          </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dashboard" v-show="!isLoading">
            <div class="container-fluid">
              <h5 class="bold">
                  Utilisateur : {{ user.first_name + ' ' + user.last_name }}
              </h5>
              <div class="row">
                <div class="col-sm-4">
                  <div class="bg-white pd-20 radius">
                      Email : {{ user.email }}
                      <br>Rôle : {{ role_name }}
                  </div>
                </div>
                <div class="col-sm-6" v-show="canClean">
                  <div class="buttons">
                      <button
                          class="btn-red btn"
                          @click="confirmDeleteActions()"
                          :disabled="user_actions.length == 0"
                      >
                          <i class="feather icon-trash mr-10"></i>
                          {{ t('Clean up') }}
                      </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-20" v-show="user_actions.length>0">
                <table class="table table-striped">
                    <thead>
                        <th>Date</th>
                        <th>Actions</th>
                    </thead>
                    <tr v-for="a in user_actions" :key="a.uuid">
                      <td>{{ a.created_at | datetime }}</td>
                      <td>{{ a.name }}</td>
                    </tr>
                </table>
            </div>
            <div class="mt-20" v-show="user_actions.length>0">
                <izyPaginate
                    @nextPage="getUserActions"
                    @previousPage="getUserActions"
                    @currentPage="getUserActions"
                    :canClickedNext="more_actions"
                ></izyPaginate>
            </div>
        </section>

        <div v-show="isLoading" class="mt-40 pb-40 text-center">
            <izy-hollow-loading loading />
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import _ from 'lodash'

export default {
    data: () => ({
        user_actions: [],
        more_actions: false,
    }),

    mounted () {
        this.getUserActions()
        this.getRoles()
        window.eventBus.$on('user', (result) => {
            if (!_.isEmpty(result)) {
                this.$store.dispatch('users/getUser', result.id)
            }
        })
    },

    computed: {
      auth () {
          return JSON.parse(localStorage.getItem('user'))
      },

      user_uuid () {
          return this.$router.history.current.params.id
      },

      user () {
         return this.$store.state.users.user
      },

      roles () {
         return this.$store.state.roles
      },

      role () {
         return !_.isEmpty(this.roles) && !_.isEmpty(this.user)
                ? this.roles.filter(r => r.uuid == this.sans_tirets(this.user.role))[0]
                : null
      },

      role_name () {
         return !_.isEmpty(this.role) ? this.role.name : ''
      },

      canClean () {
          return this.auth.account.role.id == 1
      },
    },

    methods: {
        async getUserActions (page = 1) {
            let user_uuid = this.$router.history.current.params.id
            let payload = { "user": user_uuid, "page": page }
            this.startLoading()
            const response = await this.$api.get(`/api/users/actions`, { params: payload })
                .catch(error => {
                    console.log('error =>', error)
                    this.stopLoading()
                    this.$swal.error(this.$translate.text(error.response.data))
                })
                if (response) {
                    this.user_actions = response.data.actions
                    this.more_actions = response.data.more
                    this.stopLoading()
                }
        },

        async getRoles () {
            const res = await this.$api.get('roles/list', {})
                .catch(error => {
                    console.log('error =>', error)
                })
                if (res) {
                    this.$store.commit('SET_ROLES', res.data)
                }
        },

        makeBreadcrumb () {
            this.breadcrumb = [
                { name: 'Home', route: 'home', active: false },
                { name: 'Users', route: 'users', active: false },
                { name: 'Actions', route: 'user-actions', active: true },
            ]
        },

        confirmDeleteActions () {
            Swal.fire({
                title: this.$translate.text('Clean up user actions'),
                text: this.$translate.text("Are you sure you want to clean up this user actions?"),
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: this.$translate.text('Cancel'),
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: this.$translate.text('Yes, clean up!')
            }).then((result) => {
                if (result.value) {
                    this.removeUserActions()
                }
            })
        },

        async removeUserActions () {
            this.startLoading()
            let user_uuid = localStorage.getItem('user_uuid')
            const res = await this.$api.post(`api/users/${user_uuid}/actions/cleanup`)
                .catch(error => {
                    console.log('error =>', error)
                    this.stopLoading()
                    this.$swal.error(this.$translate.text(error.response.data))
                })
                if (res) {
                    this.getUserActions()
                    this.$swal.success(this.$translate.text(res.data))
                    this.stopLoading()
                }
        }
    }
}
</script>

<script lang="ts" setup>
import { useDrawers } from '~/composables/useDrawers'

const { drawerLeft, toggleDrawerLeft } = useDrawers()
const leftRail = ref(false)
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="drawerLeft"
        :rail="leftRail"
        :persistent="false"
        permanent
        overlay="true"
        width="250"
        @click="leftRail = false"
      >
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="John Leider"
          nav
        >
          <template #append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="leftRail = !leftRail"
            />
          </template>
        </v-list-item>

        <v-divider />

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home-city" title="Home" value="home" />
          <v-list-item prepend-icon="mdi-account" title="My Account" value="account" />
          <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users" />
        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 250px" />
    </v-layout>
  </v-card>
</template>

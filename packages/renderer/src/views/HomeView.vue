<template>
<div class="column">
  <h1>Vampire Survivors</h1>
  <img src="../assets/GameLogo.png" />
  <button @click="initialize">Initialize</button>
  <p>state: {{ mainStore.state }}</p>
  <p v-if="mainStore.state == GameStates.start">Initializing...</p>
  <p v-if="mainStore.state == GameStates.error">
    <span class="error">Error:</span> {{ mainStore.error }}
  </p>
  <div v-if="mainStore.state == GameStates.needBackup">
    <h3>Backup Required</h3>
    <p>
      Your game directory has been found, the first step is to create
      a backup in your user data directory.   When we apply cheats it
      will use the backup file along with the cheats you select.
      We were unable to create a backup file.  Check that the paths exist:
    </p>
    <p><strong>Main bundle:</strong> {{ mainStore.mainSettings?.bundlePath }} </p>
    <p><strong>Backup:</strong> {{ mainStore.mainSettings?.backupPath }} </p>
  </div>
  <p v-if="mainStore.state == GameStates.initialized">
  </p>
</div>
</template>

<script lang="ts" setup>
import { useMainStore, GameStates } from '../store/main'

const mainStore = useMainStore();

const initialize = async () => {
  console.log('you clicked initialize!');
  const result = await mainStore.initialize();
  console.log('done with HomeView.initialize()');
  console.log('result:', result);
}
</script>
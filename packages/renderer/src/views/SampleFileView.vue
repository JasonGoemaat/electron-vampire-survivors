<template>
  <h1>Sample File</h1>
  <p>Path: {{ file.filePath }} </p>
  <p>Exists: {{ file.exists }} </p>
  <p>md5: {{ file.md5 }} </p>
  <p>Contents Length: {{ file.contents.length }}</p>
  <p>Objects Length: {{ objects.length }}</p>
  <button @click="doParseCharacters()">Parse Characters</button>
</template>

<script lang="ts" setup>
import { loadBundle, FileWithHash } from '../services/BundleService';
import { parseObjects, parseCharacters } from '../services/ParserService';

const file = loadBundle('D:\\games\\steam\\steamapps\\common\\Vampire Survivors\\resources\\app\\.webpack\\renderer\\main.bundle.js')
const objects = file.exists ? parseObjects(file.contents) : [];
const doParseCharacters = () => {
  (window as any).characters = parseCharacters(file.contents, objects);
}
</script>
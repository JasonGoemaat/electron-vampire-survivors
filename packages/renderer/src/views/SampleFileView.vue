<template>
  <h1>Sample File</h1>
  <p>Path: {{ file.filePath }} </p>
  <p>Exists: {{ file.exists }} </p>
  <p>md5: {{ file.md5 }} </p>
  <p>Contents Length: {{ file.contents.length }}</p>
  <p>Objects Length: {{ objects.length }}</p>
  <button @click="parseCharacters()">Parse Characters</button>
</template>

<script lang="ts" setup>
import SaveGameService, { FileWithHash} from '../services/FileService';
import ParserService from '../services/ParserService';

const file = SaveGameService.loadFile('D:\\games\\steam\\steamapps\\common\\Vampire Survivors\\resources\\app\\.webpack\\renderer\\main.bundle.js')
const objects = file.exists ? ParserService.parseFile(file.contents) : [];
const parseCharacters = () => {
  (window as any).characters = ParserService.parseCharacters(file.contents);
}
</script>
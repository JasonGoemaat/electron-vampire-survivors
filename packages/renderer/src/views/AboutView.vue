<template>
<div class="column">
  <h1>About</h1>
  <p>This will let you modify the stats of the various characters in
    Vampire Survivor.
  </p>

  <p>To use:
    <ol style="text-align: left">
      <li>Click on a character</li>
      <li>Make changes and click 'update'</li>
      <li>Click 'Apply Modifications'</li>
      <li>Restart the game if you have it open</li>
    </ol>
  </p>

  <p>
    The <strong>DEFAULT</strong> modifications are applied first, so
    modifications to individual characters will have priority.  Modifications
    to all characters are done when clicking 'Apply Modifications'.
  </p>
  
  <p>
    This app creates a backup of the game bundle the first time it is run
    and keeps track of the md5 hash of the file every time the app changes it.
    If you update the file manually or if the game updates and it is overwritten,
    you will be prompted to use the new version as the backup that modifications
    are applied to.  You can also click 'Use Backup' to use the last backed-up
    clean version of the game with no modifications. 
  </p>

  <p>
    The overrides are string values and directly replace the string values in
    the javascript bundle for the game renderer.  If you type in some characters
    it is then possible to make the game crash on loading because no check is
    done to make sure the values are compatable.
  </p>

  <p>
    Most values are listed as hex (i.e. "0xff"), but you can use any number
    representation that works in javascript.   Especially for things like
    'cooldown' which defaults to '0x1' which is 1.0, and lower numbers
    such as '0.5' will make it faster.  Even expressions like '1 * 0.5 + 1'
    should work here since it's Javascript and not JSON.
  </p>
</div>
</template>

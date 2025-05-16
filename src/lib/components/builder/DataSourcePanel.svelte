<script lang="ts">
  export let dataSources: string[] = [];
</script>

<div class="space-y-2">
  {#each dataSources as source}
    <div class="bg-white rounded p-2 shadow hover:bg-gray-100 cursor-pointer">{source}</div>
  {/each}
</div>
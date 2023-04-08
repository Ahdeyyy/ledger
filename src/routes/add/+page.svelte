<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import NewExpense from '$lib/components/NewExpense.svelte';
	import NewIncome from '$lib/components/NewIncome.svelte';

	let tabSet: number = 0;
</script>

<TabGroup>
	<Tab bind:group={tabSet} name="income" value={0}>Income</Tab>
	<Tab bind:group={tabSet} name="expense" value={1}>Expense</Tab>
	<svelte:fragment slot="panel" >
		{#if tabSet === 0}
			 <NewIncome/>
		{:else if  tabSet === 1}
			 <NewExpense/>
		{:else}
			 <p>how??????</p>
		{/if}
	</svelte:fragment>
</TabGroup>



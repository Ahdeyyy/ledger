<script lang="ts">
	import ExpenseRecord from '$lib/components/ExpenseRecord.svelte';
	import IncomeRecord from '$lib/components/IncomeRecord.svelte';
	import { recordTabSet } from '$lib/utils/store';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
</script>

<TabGroup justify="justify-center">
	<Tab bind:group={$recordTabSet} name="income" value={0}>Income</Tab>
	<Tab bind:group={$recordTabSet} name="expense" value={1}>Expense</Tab>
	<svelte:fragment slot="panel">
		{#if $recordTabSet === 0}
			<IncomeRecord />
		{:else if $recordTabSet === 1}
			<!-- else if content here -->
			<ExpenseRecord />
		{:else}
			<!-- else content here -->
		{/if}
	</svelte:fragment>
</TabGroup>

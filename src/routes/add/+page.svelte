<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import NewExpense from '$lib/components/NewExpense.svelte';
	import NewIncome from '$lib/components/NewIncome.svelte';
	import { StringToMap, accounts } from '$lib/utils/store';
	import type { Account } from '$lib/utils/types';

	let tabSet: number = 0;
	let entries = StringToMap($accounts).entries();
	let a_map: Map<string, Account> = new Map(entries);
</script>

<TabGroup justify="justify-center">
	<Tab bind:group={tabSet} name="income" value={0}>Income</Tab>
	<Tab bind:group={tabSet} name="expense" value={1}>Expense</Tab>
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			{#if a_map.size > 0}
				<NewIncome />
			{:else}
			<div class="grid place-content-center p-3" >
				<a class="btn variant-soft-primary" href="/">Create an account</a>

			</div>
			{/if}
		{:else if tabSet === 1}
			{#if a_map.size > 0}
				<NewExpense />
			{:else}
			<div class="grid place-content-center p-3" >
				<a class="btn variant-soft-primary" href="/">Create an account</a>

			</div>
			{/if}
		{:else}
			<p>how??????</p>
		{/if}
	</svelte:fragment>
</TabGroup>

<script lang="ts">
	import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import { accounts, StringToMap } from '$lib/utils/store';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import type { Account, Income } from '$lib/utils/types';

	let tableSource: TableSource;
	// income_list = income_list.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

	const entries = StringToMap($accounts).entries();
	const a_map: Map<string, Account> = new Map(entries);

	let account_id: string = a_map.keys().next().value;

	let incomes = a_map.get(account_id)?.incomes.sort((a, b) => Date.parse(a.date) - Date.parse(b.date)) as Array<Income>;
	

	$: {
		incomes = a_map.get(account_id)?.incomes.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) as Array<Income>;
	}

	tableSource = {
		head: ['Category', 'Amount', 'Date'],
		body: tableMapperValues(incomes, [ 'category', 'amount', 'date']),
		meta: tableMapperValues(incomes, ['id', 'category', 'amount', 'date'])
	};

	function selectionHandler(event: CustomEvent) {
		console.log(event.detail);
	}
</script>

<section>
	<select name="account" id="" bind:value={account_id}>
		{#each [...a_map] as [key, account]}
			<option value={key}>{account.name}</option>
		{/each}
	</select>
</section>

<section class="grid gap-5">
	{#if incomes.length > 0}
		<Table
			text="table p-2 font-token text-dark-token text-token rounded"
			interactive={true}
			on:selected={selectionHandler}
			source={tableSource}
		/>
		<a href="/addIncome" class="btn w-1/2 mx-auto variant-soft-primary uppercase">add income</a>
	{:else}
		<a href="/addIncome" class="btn w-1/2 mx-auto variant-soft-primary uppercase">add income</a>
	{/if}
</section>

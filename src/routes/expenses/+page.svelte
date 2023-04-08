<script lang="ts">
	import { accounts, StringToMap , MapToString } from '$lib/utils/store';
	import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import type { Account, Expense } from '$lib/utils/types';
	
	
	// expenses = expenses.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
	let tableSource: TableSource;
	// income_list = income_list.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

	const entries = StringToMap($accounts).entries();

	const a_map: Map<string, Account> = new Map(entries);

	let account_id: string = a_map.keys().next().value ;

	let expenses = a_map.get(account_id)?.expenses || [];

	$: {
		expenses = a_map.get(account_id)?.expenses || [];
	}

	tableSource = {
		head: [ 'Category', 'Amount', 'Date'],
		body: tableMapperValues(expenses, ['category', 'amount', 'date']),
		meta: tableMapperValues(expenses, ['Id','category', 'amount', 'date'])
	};

	function selectionHandler(event: CustomEvent) {
		console.log(event.detail);
	}
</script>

<section>
	<select name="account" id="" bind:value={account_id}>
		{#each [...a_map] as [key,account]}
			<option value={key}>{account.name}</option>
		{/each}
	</select>
</section>

<section class="grid gap-5">
	{#if expenses.length > 0}
		<Table
			text="table p-2 font-token text-dark-token text-token rounded"
			interactive={true}
			on:selected={selectionHandler}
			source={tableSource}
		/>
		<a href="/addExpense" class="btn w-1/2 mx-auto variant-soft-primary uppercase">add expense</a>
	{:else}
		<a href="/addExpense" class="btn w-1/2 mx-auto variant-soft-primary uppercase">add expense</a>
	{/if}
</section>

<script lang="ts">
	import {
		accounts,
		StringToMap,
		MapToString,
		addTabSet,
		current_account_id
	} from '$lib/utils/store';
	import {
		Accordion,
		AccordionItem,
		ListBox,
		ListBoxItem,
		Table,
		tableMapperValues
	} from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import type { Account, Expense } from '$lib/utils/types';
	import { AccountCircleFill } from 'svelte-remixicon';

	// expenses = expenses.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
	let tableSource: TableSource;
	// income_list = income_list.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

	const entries = StringToMap($accounts).entries();

	const a_map: Map<string, Account> = new Map(entries);

	let expenses = a_map.get($current_account_id)?.expenses || [];

	$: {
		expenses = a_map.get($current_account_id)?.expenses || [];
		tableSource = {
			head: ['Category', 'Amount', 'Date'],
			body: tableMapperValues(expenses, ['category', 'amount', 'date']),
			meta: tableMapperValues(expenses, ['Id', 'category', 'amount', 'date'])
		};
	}

	tableSource = {
		head: ['Category', 'Amount', 'Date'],
		body: tableMapperValues(expenses, ['category', 'amount', 'date']),
		meta: tableMapperValues(expenses, ['Id', 'category', 'amount', 'date'])
	};

	function selectionHandler(event: CustomEvent) {
		console.log(event.detail);
	}
</script>

<section class="grid gap-5 mt-4">
	{#if expenses.length > 0}
		<Accordion>
			<h4 class="text-center text-md font-heading-token uppercase text-token">Account</h4>
			<AccordionItem duration={Number(1000)} rounded="rounded-md">
				<svelte:fragment slot="lead"><AccountCircleFill class="w-8 h-8" /></svelte:fragment>
				<svelte:fragment slot="summary">
					<span class="font-token font-semibold capitalize">
						{a_map.get($current_account_id)?.name || 'account'}
					</span>
				</svelte:fragment>
				<svelte:fragment slot="content">
					<ListBox rounded="rounded" spacing="space-y-3" bind:value={$current_account_id}>
						{#each [...a_map] as [key, account]}
							<ListBoxItem
								rounded="rounded-md"
								padding="p-2 capitalize"
								bind:group={$current_account_id}
								name="accounts"
								value={account.id}>{account.name}</ListBoxItem
							>
						{/each}
					</ListBox>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
		<Table
			text="table p-2 font-token text-dark-token text-token rounded"
			interactive={true}
			on:selected={selectionHandler}
			source={tableSource}
		/>
		<a
			on:click={() => {
				$addTabSet = 1;
			}}
			href="/add"
			class="btn w-1/2 mx-auto variant-soft-primary uppercase">add expense</a
		>
	{:else if a_map.size === 0}
		<div class="grid place-content-center p-3">
			<a class="btn variant-soft-primary" href="/">Create an account</a>
		</div>
	{:else}
		<div class="grid place-content-center p-3">
			<a
				on:click={() => {
					$addTabSet = 1;
				}}
				href="/add"
				class="btn variant-soft-primary uppercase">add expense</a
			>
		</div>
	{/if}
</section>

<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		ListBox,
		ListBoxItem,
		Table,
		tableMapperValues,
		type ModalComponent,
		modalStore,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { accounts, addTabSet, current_account_id, StringToMap } from '$lib/utils/store';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import type { Account, Income } from '$lib/utils/types';
	import { AccountCircleFill } from 'svelte-remixicon';
	import EditRecord from './EditRecord.svelte';

	let tableSource: TableSource;
	// income_list = income_list.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

	let entries = StringToMap($accounts).entries();
	let a_map: Map<string, Account> = new Map(entries);

	let incomes =
		a_map
			.get($current_account_id)
			?.incomes.sort((a, b) => Date.parse(a.date) - Date.parse(b.date)) || [];

	$: {
		incomes =
			a_map
				.get($current_account_id)
				?.incomes.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) || [];
		tableSource = {
			head: ['Category', 'Amount', 'Date'],
			body: tableMapperValues(incomes, ['category', 'amount', 'date']),
			meta: tableMapperValues(incomes, ['id', 'category', 'amount', 'date'])
		};
	}

	tableSource = {
		head: ['Category', 'Amount', 'Date'],
		body: tableMapperValues(incomes, ['category', 'amount', 'date']),
		meta: tableMapperValues(incomes, ['id', 'category', 'amount', 'date'])
	};

	$: {
		entries = StringToMap($accounts).entries();
		a_map = new Map(entries);
		incomes =
			a_map
				.get($current_account_id)
				?.incomes.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) || [];
		tableSource = {
			head: ['Category', 'Amount', 'Date'],
			body: tableMapperValues(incomes, ['category', 'amount', 'date']),
			meta: tableMapperValues(incomes, ['id', 'category', 'amount', 'date'])
		};
	}

	function selectionHandler(event: CustomEvent) {
		console.log(event.detail);
		const modalComponent: ModalComponent = {
			// Pass a reference to your custom component
			ref: EditRecord,
			// Add the component properties as key/value pairs
			props: {
				type: 'income',
				id: event.detail[0],
				category: event.detail[1],
				amount: event.detail[2],
				date: event.detail[3]
			},
			// Provide a template literal for the default component slot
			slot: '<p>Edit income</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			title: 'Edit record',
			body: ' ',
			// Pass the component directly:
			component: modalComponent
		};
		modalStore.trigger(d);
	}
</script>

<section class="grid gap-5 mt-4">
	{#if incomes.length > 0}
		<Accordion>
			<h4 class="text-center uppercase text-md font-heading-token text-token">Account</h4>
			<AccordionItem duration={Number(1000)} rounded="rounded-token">
				<svelte:fragment slot="lead"><AccountCircleFill class="w-8 h-8" /></svelte:fragment>
				<svelte:fragment slot="summary">
					<span class="font-semibold capitalize font-token">
						{a_map.get($current_account_id)?.name || 'account'}
					</span>
				</svelte:fragment>
				<svelte:fragment slot="content">
					<ListBox rounded="rounded" spacing="space-y-3" bind:value={$current_account_id}>
						{#each [...a_map] as [key, account]}
							<ListBoxItem
								rounded="rounded-token"
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
				$addTabSet = 0;
			}}
			href="/add"
			class="w-1/2 mx-auto btn capitalize rounded-token variant-filled-primary">add income</a
		>
	{:else if a_map.size === 0}
		<div class="grid p-3 place-content-center">
			<a class="btn rounded-token variant-filled-primary" href="/">Create an account</a>
		</div>
	{:else}
		<div class="grid p-3 place-content-center">
			<a
				on:click={() => {
					$addTabSet = 0;
				}}
				href="/add"
				class="btn capitalize rounded-token variant-filled-primary">add income</a
			>
		</div>
	{/if}
</section>

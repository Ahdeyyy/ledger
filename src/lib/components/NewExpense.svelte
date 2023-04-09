<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		ListBox,
		ListBoxItem,
		toastStore
	} from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	import { accounts, StringToMap, MapToString } from '$lib/utils/store';
	import type { Account, Expense } from '$lib/utils/types';
	import { AccountCircleFill, FunctionLine } from 'svelte-remixicon';

	let categories = [
		'food',
		'transport',
		'clothing',
		'housing',
		'entertainment',
		'health',
		'education',
		'other'
	];

	const entries = StringToMap($accounts).entries();
	const a_map: Map<string, Account> = new Map(entries);

	let account_id: string = a_map.keys().next().value;

	// generate random id
	let rand_ind = Math.floor(Math.random() * 9) + 2;
	let id = Math.random()
		.toString(36)
		.slice(rand_ind, rand_ind + 9);

	if (a_map.has(id)) {
		id = Math.random()
			.toString(36)
			.slice(rand_ind, rand_ind + 9);
	}

	let expense: Expense = {
		id: id,
		type: 'one-time',
		category: 'food',
		amount: 0.0,
		date: new Date().toDateString()
	};

	function createExpense() {
		// handle form submission
		if (expense.amount === undefined || expense.amount <= 0) {
			const t: ToastSettings = {
				message: 'Please enter an amount',
				background: 'variant-filled-warning',
				classes: 'rounded-md p-2 font-token text-dark-token text-token',
				timeout: 2500
			};
			toastStore.trigger(t);
			return;
		}

		// update account with new expense
		accounts.update((account) => {
			const acc = StringToMap(account);
			const a = acc.get(account_id) as Account;
			a.balance = Number(a.balance) - Number(expense.amount);
			a?.expenses.push(expense);
			acc.set(account_id, a);
			return MapToString(acc);
		});
		const t: ToastSettings = {
			message: 'Expense added',
			background: 'variant-filled-success',
			classes: 'rounded-lg p-2 font-token text-dark-token text-token',
			timeout: 2500
		};
		toastStore.trigger(t);
		expense = {
			id: id,
			type: 'one-time',
			category: 'food',
			amount: 0.0,
			date: new Date().toDateString()
		};
	}
</script>

<form
	action=""
	class="card p-5 text-token variant-soft-surface grid gap-4 rounded-md font-token text-dark-token"
	on:submit|preventDefault={createExpense}
>
	<Accordion>
		<h4 class="text-center text-md font-heading-token uppercase text-token">Account</h4>
		<AccordionItem duration={Number(1000)} rounded="rounded-md">
			<svelte:fragment slot="lead"><AccountCircleFill class="w-8 h-8" /></svelte:fragment>
			<svelte:fragment slot="summary">
				<span class="font-token font-semibold capitalize">
					{a_map.get(account_id)?.name || 'accounts'}
				</span>
			</svelte:fragment>
			<svelte:fragment slot="content">
				<ListBox rounded="rounded" spacing="space-y-3" bind:value={account_id}>
					{#each [...a_map] as [key, account]}
						<ListBoxItem
							rounded="rounded-md"
							padding="p-2 capitalize"
							bind:group={account_id}
							name="accounts"
							value={account.id}>{account.name}</ListBoxItem
						>
					{/each}
				</ListBox>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>

	<Accordion>
		<h4 class="text-center text-md font-heading-token uppercase text-token">category</h4>
		<AccordionItem duration={Number(1000)} rounded="rounded-md" bind:value={expense.category}>
			<svelte:fragment slot="lead"><FunctionLine class="w-8 h-8" /></svelte:fragment>
			<svelte:fragment slot="summary"
				><span class="font-token font-semibold capitalize">
					{expense.category}
				</span></svelte:fragment
			>
			<svelte:fragment slot="content">
				<ListBox rounded="rounded" spacing="space-y-3">
					{#each categories as category}
						<ListBoxItem
							rounded="rounded-md"
							padding="p-2 capitalize"
							bind:group={expense.category}
							name="categories"
							value={category}>{category}</ListBoxItem
						>
					{/each}
				</ListBox>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>

	<div class="input-group w-3/4 mx-auto input-group-divider grid-cols-[auto_1fr_auto] rounded-lg">
		<div class="input-group-shim uppercase p-3">{a_map.get(account_id)?.currency}</div>
		<input
			type="tel"
			placeholder="0.00"
			name="amount"
			class="input p-3"
			id="amount"
			bind:value={expense.amount}
		/>
	</div>

	<button
		type="submit"
		class="btn variant-soft-primary uppercase rounded-md w-1/3 mx-auto text-center">Add</button
	>
</form>

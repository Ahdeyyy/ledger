<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		ListBox,
		ListBoxItem,
		toastStore
	} from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	import { accounts, StringToMap, MapToString, current_account_id } from '$lib/utils/store';
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

	// generate random id
	let rand_ind = Math.floor(Math.random() * 2) + 2;
	let id = Math.random()
		.toString(36)
		.slice(rand_ind, rand_ind + 9);

	if (a_map.has(id)) {
		rand_ind = Math.floor(Math.random() * 2) + 2;
		id = Math.random()
			.toString(36)
			.slice(rand_ind, rand_ind + 9);
	}

	let expense: Expense = {
		id: id,
		category: 'food',
		amount: 0.0,
		date: new Date().toString()
	};

	function createExpense() {
		// handle form submission
		if (expense.amount === undefined || expense.amount <= 0) {
			const t: ToastSettings = {
				message: 'Please enter an amount',
				background: 'variant-soft-warning',
				classes: 'rounded-token p-2 font-token text-token',
				timeout: 2500
			};
			toastStore.trigger(t);
			return;
		}

		// update account with new expense
		accounts.update((account) => {
			const acc = StringToMap(account);
			const a = acc.get($current_account_id) as Account;
			a.balance = Number(a.balance) - Number(expense.amount);
			a?.expenses.push(expense);
			acc.set($current_account_id, a);
			return MapToString(acc);
		});
		const t: ToastSettings = {
			message: 'Expense added',
			background: 'variant-soft-success',
			classes: 'rounded-token p-2 font-token text-token',
			timeout: 2500
		};
		toastStore.trigger(t);
		expense = {
			id: Math.random()
			.toString(36)
			.slice(rand_ind, rand_ind + 9),
			category: 'food',
			amount: 0.0,
			date: new Date().toString()
		};
	}
</script>

<form
	action=""
	class="grid gap-4 p-5 mx-auto card text-token variant-soft-surface rounded-token font-token text-dark-token"
	on:submit|preventDefault={createExpense}
>
	<Accordion>
		<h4 class="text-center uppercase text-md font-heading-token text-token">Account</h4>
		<AccordionItem duration={Number(1000)} rounded="rounded-token">
			<svelte:fragment slot="lead"><AccountCircleFill class="w-8 h-8" /></svelte:fragment>
			<svelte:fragment slot="summary">
				<span class="font-semibold capitalize font-token">
					{a_map.get($current_account_id)?.name || 'accounts'}
				</span>
			</svelte:fragment>
			<svelte:fragment slot="content">
				<ListBox rounded="rounded-token" spacing="space-y-3" bind:value={$current_account_id}>
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

	<Accordion>
		<h4 class="text-center uppercase text-md font-heading-token text-token">category</h4>
		<AccordionItem duration={Number(1000)} rounded="rounded-token" bind:value={expense.category}>
			<svelte:fragment slot="lead"><FunctionLine class="w-8 h-8" /></svelte:fragment>
			<svelte:fragment slot="summary"
				><span class="font-semibold capitalize font-token">
					{expense.category}
				</span></svelte:fragment
			>
			<svelte:fragment slot="content">
				<ListBox rounded="rounded-token" spacing="space-y-3">
					{#each categories as category}
						<ListBoxItem
							rounded="rounded-token"
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

	<div
		class="input-group w-3/4 mx-auto input-group-divider grid-cols-[auto_1fr_auto] rounded-token"
	>
		<div class="p-3 input-group-shim">{a_map.get($current_account_id)?.currency}</div>
		<input
			type="tel"
			placeholder="0.00"
			name="amount"
			class="p-3 rounded input"
			id="amount"
			bind:value={expense.amount}
		/>
	</div>

	<button
		type="submit"
		class="w-1/3 mx-auto text-center btn variant-filled-primary font-token rounded-token"
		>Add</button
	>
</form>

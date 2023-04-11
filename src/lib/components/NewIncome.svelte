<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		ListBox,
		ListBoxItem,
		toastStore
	} from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { AccountCircleFill, AddLine, FunctionLine } from 'svelte-remixicon';

	import { accounts, current_account_id, MapToString, StringToMap } from '$lib/utils/store';
	import type { Account, Income } from '$lib/utils/types';

	const entries = StringToMap($accounts).entries();

	const a_map: Map<string, Account> = new Map(entries);

	let categories: string[] = ['salary', 'investment', 'business', 'other'];

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

	let income: Income = {
		id: id,
		type: 'one-time',
		category: 'salary',
		amount: 0.0,
		date: new Date().toDateString()
	};

	function createIncome() {
		// handle form submission
		if (income.amount === undefined || income.amount <= 0) {
			const t: ToastSettings = {
				message: 'Please enter a valid amount',
				background: 'variant-filled-error',
				classes: 'rounded-md p-2 font-token text-dark-token text-token',
				timeout: 2500
			};
			toastStore.trigger(t);
			return;
		}

		// update account with new income
		accounts.update((account) => {
			const acc = StringToMap(account);
			const a = acc.get($current_account_id) as Account;
			a.balance = Number(a.balance) + Number(income.amount);
			a?.incomes.push(income);
			acc.set($current_account_id, a);
			return MapToString(acc);
		});

		const t: ToastSettings = {
			message: 'Income added',
			background: 'variant-filled-success rounded-md',
			classes: 'rounded-md p-2 font-token text-dark-token text-token',
			timeout: 2500
		};
		toastStore.trigger(t);
		income = {
			id: id,
			type: 'one-time',
			category: 'salary',
			amount: 0.0,
			date: new Date().toDateString()
		};
	}
</script>

<form
	action=""
	class="card p-5 text-token variant-soft-surface grid gap-4 rounded-md font-token text-dark-token"
	on:submit|preventDefault={createIncome}
>
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

	<Accordion>
		<h4 class="text-center text-md font-heading-token uppercase text-token">category</h4>
		<AccordionItem duration={Number(1000)} rounded="rounded-md" bind:value={income.category}>
			<svelte:fragment slot="lead"><FunctionLine class="w-8 h-8" /></svelte:fragment>
			<svelte:fragment slot="summary"
				><span class="font-token font-semibold capitalize">
					{income.category}
				</span></svelte:fragment
			>
			<svelte:fragment slot="content">
				<ListBox rounded="rounded" spacing="space-y-3">
					{#each categories as category}
						<ListBoxItem
							rounded="rounded-md"
							padding="p-2 capitalize"
							bind:group={income.category}
							name="categories"
							value={category}>{category}</ListBoxItem
						>
					{/each}
				</ListBox>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>

	<div class="input-group w-3/4 mx-auto input-group-divider grid-cols-[auto_1fr_auto] rounded-lg">
		<div class="input-group-shim uppercase p-3">{a_map.get($current_account_id)?.currency}</div>
		<input
			type="tel"
			placeholder="0.00"
			name="amount"
			class="input p-3"
			id="amount"
			bind:value={income.amount}
		/>
	</div>
	<button
		class="btn  gap-x-10 rounded-md mx-auto font-token w-1/3 variant-glass-primary uppercase text-center"
		type="submit"
	>
		Add
	</button>
</form>

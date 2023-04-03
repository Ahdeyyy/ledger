<script lang="ts">
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	import { accounts, StringToMap, MapToString } from '$lib/utils/store';
	import type { Account, Expense } from '$lib/utils/types';

	let expense_type = ['recurring', 'one-time', 'loan'];

	const entries = StringToMap($accounts).entries();
	const a_map: Map<string, Account> = new Map(entries);

	let account_id: string = a_map.keys().next().value;

	// generate random id
	let id = Math.random().toString(36).substr(1, 9);

	if (a_map.has(id)) {
		id = Math.random().toString(36).substr(1, 9);
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
		if (expense.amount === undefined) {
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
			a.balance -= expense.amount;
			a?.expenses.push(expense);
			acc.set(account_id, a);
			return MapToString(acc);
		});
	}
</script>

<form
	action=""
	class="card rounded p-10 grid gap-3 place-items-center text-token font-token text-dark-token"
	on:submit|preventDefault={createExpense}
>
	<header class="card-header uppercase font-heading-token">Add Expense</header>
	<section>
		<select name="account" id="" class="select" bind:value={account_id}>
			{#each [...a_map] as [key, account]}
				<option value={key}>{account.name}</option>
			{/each}
		</select>
	</section>
	<section class="p-2 grid gap-2">

		<div>
			<label class="label rounded uppercase" for="description">
				<span>Category</span>
				<select name="" id="" class="select" bind:value={expense.category}>
					<option value="food">Food</option>
					<option value="transport">Transport</option>
					<option value="entertainment">Entertainment</option>
					<option value="clothing">Clothing</option>
					<option value="health">Health</option>
					<option value="education">Education</option>
					<option value="other">Other</option>
				</select>
			</label>
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-lg">
			<div class="input-group-shim uppercase">USD</div>
			<input
				type="number"
				placeholder="amount"
				name="amount"
				class="input"
				step="0.01"
				min="1"
				bind:value={expense.amount}
			/>
		</div>
	</section>
	<button
		type="submit"
		class="btn variant-soft-primary uppercase rounded-token w-1/2 mx-auto text-center">Add</button
	>
</form>

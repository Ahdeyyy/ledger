<script lang="ts">
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	import { accounts, MapToString, StringToMap } from '$lib/utils/store';
	import type { Account, Income } from '$lib/utils/types';

	let income_type = ['recurring', 'one-time'];

	const entries = StringToMap($accounts).entries();

	const a_map: Map<string, Account> = new Map(entries);

	let account_id: string = a_map.keys().next().value;

	let id = Math.random().toString(36).substr(1, 9);

	if (a_map.has(id)) {
		id = Math.random().toString(36).substr(1, 9);
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
		if (income.amount === undefined || income.amount === 0.0) {
			const t: ToastSettings = {
				message: 'Please enter an amount',
				background: 'variant-filled-warning',
				classes: 'rounded-md p-2 font-token text-dark-token text-token',
				timeout: 2500
			};
			toastStore.trigger(t);
			return;
		}

		// update account with new income
		accounts.update((account) => {
			const acc = StringToMap(account);
			const a = acc.get(account_id) as Account;
			a.balance += income.amount;
			a?.incomes.push(income);
			acc.set(account_id, a);
			return MapToString(acc);
		});

		console.log($accounts);
	}
</script>


<form
action=""
class="card p-5 grid gap-3 place-items-center text-token font-token text-dark-token"
on:submit|preventDefault={createIncome}
>
<header class="card-header uppercase font-heading-token">Add Income</header>
<section>
	<select name="account" id="" class="select" bind:value={account_id}>
		{#each [...a_map] as [key, account]}
			<option value={key}>{account.name}</option>
		{/each}
	</select>
</section>
<section class="p-4 grid gap-2">

		<div>
			<label class="label rounded uppercase" for="category">
				<span>Category</span>
				<select class="select" name="category" id="category" bind:value={income.category}>
					<option value="salary">Salary</option>
					<option value="business">Business</option>
					<option value="investment">Investment</option>
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
				step="0.01"
				class="input"
				id="amount"
				bind:value={income.amount}
			/>
		</div>
	</section>
	<button
		class="btn rounded-token variant-soft-primary uppercase w-1/2 mx-auto text-center"
		type="submit">Add</button
	>
</form>

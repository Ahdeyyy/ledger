<script lang="ts">
	import { MapToString, StringToMap, accounts, current_account_id } from '$lib/utils/store';
	import type { Account, Expense, Income } from '$lib/utils/types';

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let category: string, amount: number, id: string, date: string, type: string;
	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';
	
	const entries = StringToMap($accounts).entries();

	const a_map: Map<string, Account> = new Map(entries);

	let record: Income | Expense = {
		category: category,
		amount: amount,
		id: id,
		date: date,
		type: type 
	};

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(record);
		if (type === 'expense') {
			accounts.update((account) => {
				const acc = StringToMap(account);
				const a = acc.get($current_account_id) as Account;
				let previous = a.expenses.find((expense) => expense.id === record.id) as Expense;
				a.balance = Number(a.balance) + Number(previous.amount || 0);
				a.balance = Number(a.balance) - Number(record.amount);
				a.expenses.forEach((expense) => {
					if (expense.id === record.id) {
						expense.category = record.category;
						expense.amount = record.amount;
						expense.date = record.date;
					}
				});
				acc.set($current_account_id, a);
				return MapToString(acc);
			});
		} else {
			accounts.update((account) => {
				const acc = StringToMap(account);
				const a = acc.get($current_account_id) as Account;
				let previous = a.incomes.find((expense) => expense.id === record.id) as Expense;
				a.balance = Number(a.balance) - Number(previous.amount || 0);
				a.balance = Number(a.balance) + Number(record.amount);
				a.incomes.forEach((income) => {
					if (income.id === record.id) {
						income.category = record.category;
						income.amount = record.amount;
						income.date = record.date;
					}
				});
				acc.set($current_account_id, a);
				return MapToString(acc);
			});
		}

		modalStore.close();
	}
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

<div class="modal-example-form {cBase}">
	<header class={cHeader}>{$modalStore[0]?.title ?? '(title missing)'}</header>
	<article>{$modalStore[0]?.body ?? '(body missing)'}</article>
	<!-- Enable for debugging: -->
	<!-- <pre>{JSON.stringify(formData, null, 2)}</pre> -->
	<form class="modal-form {cForm}">
		<label class="label">
			<span>Category</span>
			<input
				class="input"
				type="text"
				bind:value={record.category}
				placeholder="Enter category..."
			/>
		</label>
		<label class="label">
			<span>Amount</span>
			<div
				class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-token"
			>
				<div class="input-group-shim uppercase">{a_map.get($current_account_id)?.currency}</div>
				<input
					type="tel"
					placeholder="0.00"
					name="amount"
					class="input rounded"
					id="amount"
					bind:value={record.amount}
				/>
			</div>
		</label>
	</form>
	<!-- prettier-ignore -->
	<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Edit</button>
    </footer>
</div>

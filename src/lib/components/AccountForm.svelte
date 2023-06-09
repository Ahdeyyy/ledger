<script lang="ts">
	import { accounts, MapToString, StringToMap } from '$lib/utils/store';
	import type { Account } from '$lib/utils/types';
	import { modalStore } from '@skeletonlabs/skeleton';
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	type formAct = 'Create' | 'Edit';
	export let action = 'Create';
	// Stores
	// Form Data
	export let id = '';
	export let name = 'Cash';
	export let balance = 0;
	export let currency = 'USD';
	let formData = {
		id: id,
		name: name,
		balance: balance,
		currency: currency
	};

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		const objs = StringToMap($accounts);

		const entries: [string, Account][] = Object.entries(objs);

		const a_map: Map<string, Account> = new Map(entries);

		if (action === 'Create') {
			let rand_ind = Math.floor(Math.random() * 9);
			let id = Math.random()
				.toString(36)
				.slice(rand_ind, rand_ind + 9);

			if (a_map.has(id)) {
				id = Math.random()
					.toString(36)
					.slice(rand_ind, rand_ind + 9);
			}
			const new_account: Account = {
				id: id,
				name: formData.name,
				balance: formData.balance,
				currency: formData.currency,
				incomes: [],
				expenses: []
			};

			accounts.update((a) => {
				const acc = StringToMap(a);
				acc.set(id, new_account);
				return MapToString(acc);
			});
			modalStore.close();
		} else {
			let new_account: Account = {
				id: id,
				name: formData.name,
				balance: formData.balance,
				currency: formData.currency,
				incomes: [],
				expenses: []
			};

			accounts.update((a) => {
				const acc = StringToMap(a);
				new_account.incomes = acc.get(id)?.incomes || [];
				new_account.expenses = acc.get(id)?.expenses || [];
				acc.set(id, new_account);
				return MapToString(acc);
			});
			modalStore.close();
		}
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

	<form class="modal-form {cForm}">
		<label class="label">
			<span>Name</span>
			<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
		</label>
		<label class="label">
			<span>Balance</span>
			<input
				class="input"
				type="tel"
				bind:value={formData.balance}
				placeholder="Enter balance..."
			/>
		</label>
		<label class="label">
			<span>Currency</span>
			<input
				class="input"
				type="text"
				bind:value={formData.currency}
				placeholder="Enter currency..."
			/>
		</label>
	</form>
	<!-- prettier-ignore -->
	<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>{action} Account</button>
    </footer>
</div>

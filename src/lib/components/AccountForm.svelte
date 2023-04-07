<script lang="ts">
	import { accounts, MapToString, StringToMap } from '$lib/utils/store';
	import type { Account } from '$lib/utils/types';
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';
	// Form Data
	const formData = {
		name: 'Cash',
		balance: 0,
		currency: 'USD'
	};
	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		let rand_ind = Math.floor(Math.random() * 9);
		let id = Math.random()
			.toString(36)
			.slice(rand_ind, rand_ind + 9);
		const objs = StringToMap($accounts);

		const entries: [string, Account][] = Object.entries(objs);

		const a_map: Map<string, Account> = new Map(entries);

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
		console.log($accounts);
		localStorage.setItem('accounts', JSON.stringify($accounts));
		console.log(localStorage.getItem('accounts'));
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

	<form class="modal-form {cForm}">
		<label class="label">
			<span>Name</span>
			<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
		</label>
		<label class="label">
			<span>Balance</span>
			<input
				class="input"
				type="number"
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
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
    </footer>
</div>

<script lang="ts">
	import {
		accounts,
		StringToMap,
		getMonthlyData,
		current_account_id,
		MapToString
	} from '$lib/utils/store';

	import type { Account, Expense, Income } from '$lib/utils/types';
	import AccountForm from '$lib/components/AccountForm.svelte';
	import RecordList from '$lib/components/RecordList.svelte';

	import {
		modalStore,
		ListBox,
		ListBoxItem,
		Accordion,
		AccordionItem
	} from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { AccountCircleFill, AddLine, DeleteBin6Line, EditBoxLine } from 'svelte-remixicon';
	//@ts-expect-error
	import Chart from 'svelte-frappe-charts';

	const modalComponent: ModalComponent = {
		// Pass a reference to your custom component
		ref: AccountForm,
		// Add the component properties as key/value pairs
		props: { background: 'bg-red-500' },
		// Provide a template literal for the default component slot
		slot: '<p>Add new account</p>'
	};
	const d: ModalSettings = {
		title: 'Create Account',
		body: 'Create a new account',
		type: 'component',
		// Pass the component directly:
		component: modalComponent
	};

	function openModal() {
		modalStore.trigger(d);
	}

	let entries = StringToMap($accounts).entries();
	let a_map: Map<string, Account> = new Map(entries);

	let account: Account = {
		name: '',
		incomes: [],
		expenses: [],
		balance: 0.0,
		id: '',
		currency: 'USD'
	};
	let total_monthly_income: number = 0.0;
	let total_monthly_expense: number = 0.0;
	let current_month = new Date().getMonth();

	let monthly_income: Income[] = [];
	let monthly_expense: Expense[] = [];
	let pie_expense_data: any = {
		labels: [],
		datasets: []
	};
	let pie_income_data: any = {
		labels: [],
		datasets: []
	};

	if (a_map.size > 0) {
		$current_account_id = a_map.keys().next().value;
		account = a_map.get($current_account_id) as Account;
		account.incomes.forEach((income) => {
			if (new Date(income.date).getMonth() === current_month) {
				monthly_income.push(income);
				total_monthly_income += Number(income.amount);
			}
		});
		account.expenses.forEach((expense) => {
			if (new Date(expense.date).getMonth() === current_month) {
				monthly_expense.push(expense);
				total_monthly_expense += Number(expense.amount);
			}
		});

		pie_expense_data = getMonthlyData(monthly_expense);
		pie_income_data = getMonthlyData(monthly_income);
		monthly_income = monthly_income.slice(0, 10);
		monthly_expense = monthly_expense.slice(0, 10);
	}

	$: {
		entries = StringToMap($accounts).entries();
		a_map = new Map(entries);
		if (($current_account_id === undefined || $current_account_id === '') && a_map.size > 0)
			$current_account_id = a_map.keys().next().value;
		account = a_map.get($current_account_id) as Account;
		total_monthly_income = 0.0;
		total_monthly_expense = 0.0;
		monthly_income = [];
		monthly_expense = [];
		if (a_map.size > 0) {
			account.incomes.forEach((income) => {
				if (new Date(income.date).getMonth() === current_month) {
					monthly_income.push(income);
					total_monthly_income += Number(income.amount);
				}
			});
			account.expenses.forEach((expense) => {
				if (new Date(expense.date).getMonth() === current_month) {
					monthly_expense.push(expense);
					total_monthly_expense += Number(expense.amount);
				}
			});
		}
		pie_expense_data = getMonthlyData(monthly_expense);
		pie_income_data = getMonthlyData(monthly_income);
		monthly_income = monthly_income.slice(0, 10);
		monthly_expense = monthly_expense.slice(0, 10);
	}

	function edit_account(account: Account) {
		const modalComponent: ModalComponent = {
			// Pass a reference to your custom component
			ref: AccountForm,
			// Add the component properties as key/value pairs
			props: {
				id: account.id,
				name: account.name,
				currency: account.currency,
				balance: account.balance,
				action: 'Edit'
			},
			// Provide a template literal for the default component slot
			slot: '<p>Add new account</p>'
		};
		const d: ModalSettings = {
			title: 'Edit Account',
			body: 'Edit account',
			type: 'component',
			// Pass the component directly:
			component: modalComponent
		};
		modalStore.trigger(d);
	}

	function delete_account(account: Account) {
		accounts.update((accounts) => {
			let a_map: Map<string, Account> = StringToMap(accounts);
			a_map.delete(account.id);
			return MapToString(a_map);
		});
		$current_account_id = '';
	}
	const confirm_delete: ModalSettings = {
	type: 'confirm',
	// Data
	title: 'Please Confirm',
	body: 'Are you sure you wish to proceed?',
	// TRUE if confirm pressed, FALSE if cancel pressed
	
};

</script>

{#if a_map.size > 0}
	<Accordion>
		<AccordionItem duration={Number(1000)} rounded="rounded-md">
			<svelte:fragment slot="lead"><AccountCircleFill class="w-8 h-8" /></svelte:fragment>
			<svelte:fragment slot="summary">Accounts</svelte:fragment>
			<svelte:fragment slot="content">
				<ListBox rounded="rounded" spacing="space-y-3" bind:value={$current_account_id}>
					{#each [...a_map] as [key, account]}
						<ListBoxItem
							rounded="rounded-md "
							padding="p-2"
							bind:group={$current_account_id}
							name="accounts"
							value={account.id}
						>
							<article
								class="grid align-middle grid-flow-col place-content-center grid-cols-8 gap-x-6"
							>
								<span class="col-span-7 align-baseline mt-1">
									{account.name}
								</span>
								<div
									class="btn-group variant-surface-filled align-middle rounded-md grid grid-flow-col place-content-center"
								>
									<button
										on:click={() => {
											confirm_delete.response = (confirm) => {
												if (confirm) {
													delete_account(account);
												}
											};
											modalStore.trigger(confirm_delete);
											
										}}
									>
										<DeleteBin6Line class="w-4 h-4" />
									</button>
									<button
										on:click={() => {
											edit_account(account);
										}}
									>
										<EditBoxLine class="w-4 h-4" />
									</button>
								</div>
							</article>
						</ListBoxItem>
					{/each}
				</ListBox>
				<button
					on:click={openModal}
					type="button"
					class="grid grid-flow-col place-content-center rounded-md grid-cols-6 btn variant-soft-primary"
				>
					<span><AddLine class="w-6 h-6" /></span>
					<span class="col-span-5">Create Account</span>
				</button>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>

	<h3 class="text-center font-bold text-xl mt-5 uppercase">{account.name}</h3>

	<section class="grid grid-cols-3 gap-4 mt-5">
		<div class="card rounded-md grid gap-3 variant-soft-surface p-4">
			<header class="font-extrabold font-token text-xl">Balance</header>
			<p class="font-token text-token">{account.balance} {account.currency}</p>
		</div>

		<article class="card p-4 rounded-md grid gap-3 variant-soft-surface">
			<header class="font-extrabold font-token text-xl">Monthly income</header>
			<p class="font-token text-token">{total_monthly_income} {account.currency}</p>
		</article>

		<article class="card p-4 rounded-md grid gap-3 variant-soft-surface">
			<header class="font-extrabold font-token text-xl">Monthly expense</header>
			<p class="font-token text-token">{total_monthly_expense} {account.currency}</p>
		</article>
	</section>

	{#if pie_expense_data.labels.length > 0}
		<!-- content here -->
		<h3 class="text-xl text-token font-token mt-4 mb-4 text-center">Monthly Expense</h3>
		<section class="grid grid-cols-3 mt-5 gap-4">
			<div class="variant-glass-secondary rounded-lg">
				<Chart maxSlices="4" data={pie_expense_data} type="donut" />
			</div>
			<div class="col-span-2">
				<RecordList records={monthly_expense} currency={account.currency} />
			</div>
		</section>
	{/if}
	{#if pie_income_data.labels.length > 0}
		<!-- content here -->
		<h3 class="text-xl text-token font-token mt-4 mb-4 text-center">Monthly income</h3>
		<section class="grid grid-cols-3 mt-5 gap-4">
			<div class="variant-glass-secondary rounded-lg">
				<Chart maxSlices="4" data={pie_income_data} type="donut" />
			</div>
			<div class="col-span-2">
				<RecordList records={monthly_income} currency={account.currency} />
			</div>
		</section>
	{/if}
{:else}
	<section class="grid place-content-center gap-10">
		<p class="font-semibold font-heading-token text-5xl">Get started, create an account.</p>
		<button
			on:click={openModal}
			type="button"
			class="btn rounded-md text-center variant-soft-primary"
		>
			<span class="col-span-7">Create Account</span>
		</button>
	</section>
{/if}

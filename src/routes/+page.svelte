<script lang="ts">
	import { accounts, StringToMap, getMonthlyExpenseData } from '$lib/utils/store';

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
	import { AccountCircleFill, AddLine } from 'svelte-remixicon';
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

	const entries = StringToMap($accounts).entries();
	const a_map: Map<string, Account> = new Map(entries);

	let account_id: string;
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

	if (a_map.size > 0) {
		account_id = a_map.keys().next().value;
		account = a_map.get(account_id) as Account;
		account.incomes.forEach((income) => {
			if (new Date(income.date).getMonth() === current_month) {
				monthly_income.push(income);
				total_monthly_income += income.amount;
			}
		});
		account.expenses.forEach((expense) => {
			if (new Date(expense.date).getMonth() === current_month) {
				monthly_expense.push(expense);
				total_monthly_expense += expense.amount;
			}
		});

		pie_expense_data = getMonthlyExpenseData(monthly_expense);
	}

	$: {
		account = a_map.get(account_id) as Account;
		console.log(account_id);
		total_monthly_income = 0.0;
		total_monthly_expense = 0.0;
		monthly_income = [];
		monthly_expense = [];
		account.incomes.forEach((income) => {
			if (new Date(income.date).getMonth() === current_month) {
				monthly_income.push(income);
				total_monthly_income += income.amount;
			}
		});
		account.expenses.forEach((expense) => {
			if (new Date(expense.date).getMonth() === current_month) {
				monthly_expense.push(expense);
				total_monthly_expense += expense.amount;
			}
		});

		pie_expense_data = getMonthlyExpenseData(monthly_expense);
	}
</script>

{#if a_map.size > 0}
	<Accordion>
		<AccordionItem rounded="rounded-md">
			<svelte:fragment slot="lead"><AccountCircleFill class="w-8 h-8" /></svelte:fragment>
			<svelte:fragment slot="summary">Accounts</svelte:fragment>
			<svelte:fragment slot="content">
				<ListBox rounded="rounded" spacing="space-y-3" bind:value={account_id}>
					{#each [...a_map] as [key, account]}
						<ListBoxItem
							rounded="rounded-md"
							padding="p-2"
							bind:group={account_id}
							name="accounts"
							value={account.id}>{account.name}</ListBoxItem
						>
					{/each}
				</ListBox>
				<button on:click={openModal} type="button" class="btn variant-soft-primary">
					<span><AddLine class="w-6 h-6" /></span>
					<span>Create Account</span>
				</button>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>

	<h3 class="text-center font-bold text-xl mt-5">{account.name}</h3>

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

	<h3 class="text-xl text-token font-token mt-4 mb-4 text-center">Expenses</h3>
	<section class="grid grid-cols-3 mt-5 gap-4">
		<div class="variant-glass-secondary rounded-md">
			<Chart maxSlices="4" data={pie_expense_data} type="donut" />
		</div>
		<div class="col-span-2">
			<RecordList records={monthly_expense} currency={account.currency} />
		</div>
	</section>
{:else}
	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="lead"><AccountCircleFill class="w-6 h-6" /></svelte:fragment>
			<svelte:fragment slot="summary">Accounts</svelte:fragment>
			<svelte:fragment slot="content">
				<button on:click={openModal} type="button" class="btn variant-soft-primary">
					<span><AddLine class="w-4 h-4" /></span>
					<span>Create Account</span>
				</button>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
{/if}

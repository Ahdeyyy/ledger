<script lang="ts">
	import { AppShell, Modal, Toast, AppRail, AppRailTile } from '@skeletonlabs/skeleton';
	import { DashboardFill, AddLine, LineChartLine } from 'svelte-remixicon';

	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { page } from '$app/stores';

	let pages = [
		{
			path: '/',
			label: '',
			icon: DashboardFill,
			class: ''
		},

		{
			path: '/addIncome',
			label: 'Add Income',
			icon: AddLine,
			class: 'text-green-600'
		},
		{
			path: '/addExpense',
			label: 'Add Expense',
			icon: AddLine,
			class: 'text-red-600'
		},
		{
			path: '/incomes',
			label: 'Incomes',
			icon: LineChartLine,
			class: 'text-green-600'
		},
		{
			path: '/expenses',
			label: 'Expenses',
			icon: LineChartLine,
			class: 'text-red-600'
		}
	]

</script>

<Modal />
<Toast />
<AppShell slotSidebarLeft="w-24">
	<svelte:fragment slot="sidebarLeft">
		<!-- Insert the list: -->
		<AppRail width="w-full" background="variant-soft-surface">

			{#each pages as item}
				<AppRailTile
					label={item.label}
					tag="a"
					class={item.path === $page.url.pathname ? '!bg-primary-500' : ''}
					href={item.path}
				>
					<svelte:component this={item.icon} class="w-10 h-10 {item.class}" />
					<page.icon class="w-10 h-10 {item.class}" />
				</AppRailTile>
			

			{/each}

		</AppRail>
		<!-- <nav class="list-nav">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/about">About</a></li>
				<li><a href="/addIncome">Add Income</a></li>
				<li><a href="/addExpense">Add Expense</a></li>
				<li><a href="/incomes">Incomes</a></li>
				<li><a href="/expenses">Expenses</a></li>
			</ul>
		</nav> -->
		<!-- --- -->
	</svelte:fragment>

	<div class="container h-full mx-auto p-6">
		<slot />
	</div>
</AppShell>

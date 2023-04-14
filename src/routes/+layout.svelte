<script lang="ts">
	import { AppShell, Modal, Toast, AppRail, AppRailTile } from '@skeletonlabs/skeleton';
	import { DashboardFill, AddLine, LineChartLine } from 'svelte-remixicon';

	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
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
			path: '/add',
			label: 'New',
			icon: AddLine,
			class: 'text-soft-primary'
		},

		{
			path: '/records',
			label: 'Records',
			icon: LineChartLine
		}
	];
</script>

<Modal />
<Toast />
<AppShell slotSidebarLeft="w-24">
	<svelte:fragment slot="sidebarLeft">
		<!-- Insert the list: -->
		<AppRail width="w-full" background="variant-filled-primary-surface">
			{#each pages as item}
				<AppRailTile
					label={item.label}
					tag="a"
					class={item.path === $page.url.pathname ? '!variant-filled-primary' : ''}
					href={item.path}
				>
					<svelte:component this={item.icon} class="w-10 h-10 {item.class}" />
					<page.icon class="w-10 h-10 {item.class}" />
				</AppRailTile>
			{/each}
		</AppRail>
	</svelte:fragment>

	<div class="container h-full mx-auto p-6">
		<slot />
	</div>
</AppShell>

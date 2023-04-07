<script lang="ts">
	import type { Income, Expense } from '$lib/utils/types';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { InformationLine } from 'svelte-remixicon';

	export let records: Expense[] | Income[] = [];
	export let currency: string = '';
</script>

<article>
	<Accordion>
		{#each records as record}
			<AccordionItem rounded="rounded-md">
				<svelte:fragment slot="lead"><InformationLine class="w-6 h-6" /></svelte:fragment>
				<svelte:fragment slot="summary">{record.amount} {currency}</svelte:fragment>
				<svelte:fragment slot="content">
					<p class="font-token text-token flex justify-between">
						<span>{record.id}</span>
						<span>{record.category} </span>
						<span>{record.amount} {currency}</span>
						<span>{record.date}</span>
					</p>
				</svelte:fragment>
			</AccordionItem>
		{/each}
	</Accordion>
</article>

<script lang="ts">
	import { page } from '$app/stores';
</script>

<section class="grid h-screen font-semibold place-content-center">
	<p>
		<span class="text-9xl">
			{$page.status}
		</span>
		<span class="text-3xl">
			{$page.error?.message}
		</span>
	</p>
</section>

<script>
	import { markdownConverter } from "../lib.js";

	export let description;
</script>

<hr>
<div class="markdown">
	{@html markdownConverter.makeHtml(description)}
</div>
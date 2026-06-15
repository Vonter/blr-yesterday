import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

type Params = { duration: number };

// Crossfade two layers stacked in one cell: the incoming layer fades up on top (z-index 2) while
// the outgoing layer is held fully opaque underneath (z-index 1) until it unmounts. Holding the
// bottom layer keeps the combined opacity at 100% throughout, so the swap never dips through a
// translucent background — the flash two independent opacity fades would produce at the crossover.
// `cubicOut` matches the panel's CSS height transition so opacity and resize ease on one curve.
export const crossIn = (_node: Element, { duration }: Params): TransitionConfig => ({
	duration,
	easing: cubicOut,
	css: (t) => `opacity: ${t}; z-index: 2`
});

export const crossOut = (_node: Element, { duration }: Params): TransitionConfig => ({
	duration,
	css: () => `opacity: 1; z-index: 1`
});

// Reveal an element by animating its whole box (height/padding/border) alongside opacity, so the
// surrounding layout grows open as it fades in rather than jumping to full height first — and
// reverses cleanly on the way out. `cubicOut` keeps it on the same curve as the rest of the panel.
export const reveal = (node: Element, { duration }: Params): TransitionConfig => {
	const s = getComputedStyle(node);
	const px = (value: string) => parseFloat(value) || 0;
	const [h, pt, pb, bt, bb] = [
		s.height,
		s.paddingTop,
		s.paddingBottom,
		s.borderTopWidth,
		s.borderBottomWidth
	].map(px);
	return {
		duration,
		easing: cubicOut,
		css: (t) =>
			`overflow: hidden; opacity: ${t};` +
			`height: ${t * h}px;` +
			`padding-top: ${t * pt}px; padding-bottom: ${t * pb}px;` +
			`border-top-width: ${t * bt}px; border-bottom-width: ${t * bb}px;`
	};
};

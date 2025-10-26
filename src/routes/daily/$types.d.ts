import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type RouteParams = {};

export type PageServerData = null;
export type PageData = Expand<{
	days: Array<{
		files: string[];
		description: string;
	}>;
}>;

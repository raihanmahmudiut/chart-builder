// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	declare namespace svelteHTML {
        interface HTMLAttributes<T> {
            'on:drop-item'?: CompositionEventHandler<T>;
        }
    }
}

export {};

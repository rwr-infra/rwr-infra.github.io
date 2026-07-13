// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://rwr-infra.uk',
	output: 'static',
	integrations: [
		starlight({
			title: 'RWR Infra',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/rwr-infra' }],
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
				zh: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'index' },
					],
				},
				{
					label: 'Tools',
					autogenerate: { directory: 'tools' },
				},
				{
					label: 'Guides',
					items: [
						{ label: 'RWR Toolbox Manual', slug: 'guides/rwr-toolbox-manual' },
					],
				},

			],
		}),
	],
});

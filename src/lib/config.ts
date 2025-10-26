export interface YearData {
	year: number;
	label: string;
	url: string;
	default?: boolean;
}

export interface SiteConfig {
	siteInfo: {
		name: string;
		cityName: string;
		description: string;
		author: string;
		canonicalUrl: string;
		ogImage: string;
		keywords: string;
		socialLinks: {
			instagram?: string;
			github?: string;
		};
	};
	mapConfig: {
		initialCenter: [number, number]; // [longitude, latitude]
		initialZoom: number;
		bounds: [[number, number], [number, number]]; // [[west, south], [east, north]]
		defaultYearIndex: number; // Index of the default year in enabledYears array (years with default !== false)
	};
	availableYears: YearData[];
	aboutContent: {
		introduction: string;
		mapsSection: {
			title: string;
			items: Array<{
				label: string;
				description: string;
			}>;
		};
		archivesSection?: {
			title: string;
			content: string;
		};
		howToUseSection: {
			title: string;
			items: string[];
		};
		contributeSection: {
			title: string;
			content: string; // HTML string
		};
	};
}

// Configuration for BLR
export const config: SiteConfig = {
	siteInfo: {
		name: 'BLR Yesterday',
		cityName: 'Bangalore',
		description:
			"Explore Bangalore's transformation through historical maps and archival documents.",
		author: 'Vivek Matthew',
		canonicalUrl: 'https://blryesterday.com',
		ogImage: 'https://blryesterday.com/sharecard.jpg',
		keywords: 'blr, bangalore, bengaluru, history, maps, archives, documents',
		socialLinks: {
			instagram: 'https://www.instagram.com/blr.on.this.day/',
			github: 'https://github.com/Vonter/blr-yesterday'
		}
	},
	mapConfig: {
		initialCenter: [77.59, 12.98], // Bangalore coordinates
		initialZoom: 14,
		bounds: [
			[77, 12.5], // Southwest coordinates
			[78.5, 13.5] // Northeast coordinates
		],
		defaultYearIndex: 6 // Default to index 6 in the enabled years
	},
	availableYears: [
		{ year: 1791, label: '1790', url: 'https://maps.blryesterday.com/1791/{z}/{x}/{y}.png' },
		{ year: 1843, label: '1840', url: 'https://maps.blryesterday.com/1843/{z}/{x}/{y}.png' },
		{ year: 1854, label: '1850', url: 'https://maps.blryesterday.com/1854/{z}/{x}/{y}.png' },
		{ year: 1884, label: '1880', url: 'https://maps.blryesterday.com/1884/{z}/{x}/{y}.png' },
		{ year: 1898, label: '1900', url: 'https://maps.blryesterday.com/1898/{z}/{x}/{y}.png' },
		{
			year: 1910,
			label: '1910',
			url: 'https://maps.blryesterday.com/1910/{z}/{x}/{y}.png',
			default: false
		},
		{ year: 1927, label: '1920', url: 'https://maps.blryesterday.com/1927/{z}/{x}/{y}.png' },
		{ year: 1948, label: '1940', url: 'https://maps.blryesterday.com/1948/{z}/{x}/{y}.png' },
		{ year: 1969, label: '1960', url: 'https://maps.blryesterday.com/1969/{z}/{x}/{y}.png' },
		{
			year: 1958,
			label: '1960 (Region)',
			url: 'https://maps.blryesterday.com/1958/{z}/{x}/{y}.png',
			default: false
		},
		{ year: 1983, label: '1980', url: 'https://maps.blryesterday.com/1983/{z}/{x}/{y}.png' },
		{
			year: 1978,
			label: '1980 (Region)',
			url: 'https://maps.blryesterday.com/1978/{z}/{x}/{y}.png',
			default: false
		},
		{ year: 2002, label: '2000', url: 'https://maps.blryesterday.com/2002/{z}/{x}/{y}.png' },
		{
			year: 2003,
			label: '2000 (Region)',
			url: 'https://maps.blryesterday.com/2003/{z}/{x}/{y}.png'
		},
		{
			year: 2009,
			label: '200x',
			url: 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/10/{z}/{y}/{x}'
		},
		{
			year: 2015,
			label: '2015',
			url: 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/31026/{z}/{y}/{x}',
			default: false
		},
		{
			year: 2025,
			label: 'Today',
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
		},
		{
			year: 2999,
			label: 'OpenStreetMap',
			url: 'https://maps.blryesterday.com/2999/{z}/{x}/{y}.png',
			default: false
		}
	],
	aboutContent: {
		introduction:
			"Explore Bangalore's transformation through historical maps and archival documents.",
		mapsSection: {
			title: 'About the Maps',
			items: [
				{
					label: '1790',
					description: 'Published in 1791 (Plan of the Siege of Bangalore, Lord Cornwallis)'
				},
				{
					label: '1840',
					description: 'Published in 1843 (Plan of the Cantonment of Bangalore, B.C. Regel)'
				},
				{
					label: '1850',
					description: 'Published in 1854 (Pharoah & Co., Madras; J. & C. Walker)'
				},
				{
					label: '1880',
					description:
						'Published in 1884 (Multiple individuals, unknown organization; scans courtesy <a href="https://mod.org.in/" class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Mod Foundation archives</a>)'
				},
				{
					label: '1900',
					description: 'Published in 1935 (John Bartholomew)'
				},
				{
					label: '1910',
					description: 'Published in 1910 (Litho. School 2nd Q.V.O.S. & M in Bangalore)'
				},
				{
					label: '1920',
					description: 'Published in 1927 (Survey of India)'
				},
				{
					label: '1940',
					description:
						'Surveyed 1935-36. Published in 1948 (Survey of India; scans courtesy <a href="https://mod.org.in/" class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Mod Foundation archives</a>)'
				},
				{
					label: '1960',
					description:
						'Surveyed 1960-61. Published in 1969 (Survey of India; scans courtesy <a href="https://mod.org.in/" class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Mod Foundation archives</a>)'
				},
				{
					label: '1960 (Region)',
					description: 'Published in 1958 (Survey of India)'
				},
				{
					label: '1980',
					description:
						'Surveyed 1979-80. Published in 1983 (Survey of India; scans courtesy <a href="https://mod.org.in/" class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Mod Foundation archives</a>)'
				},
				{
					label: '1980 (Region)',
					description: 'Published in 1978 (Survey of India)'
				},
				{
					label: '2000',
					description:
						'Surveyed 1997-99. Published in 2002 (Survey of India; scans courtesy <a href="https://bengawalk.com" class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Bengawalk</a>)'
				},
				{
					label: '2000 (Region)',
					description:
						'Surveyed across multiple decades in the late 20th Century. Major details updated around 2000. Published in 2011 (Survey of India; scans courtesy <a href="https://bengawalk.com" class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Bengawalk</a>)'
				},
				{
					label: '200x',
					description:
						'Satellite images captured in different areas across multiple years through the 2000s (ESRI)'
				},
				{
					label: '2015',
					description:
						'Satellite images captured in different areas across multiple years prior to 2015 (ESRI)'
				},
				{
					label: 'Today',
					description: 'Satellite images captured after 2022 (ESRI)'
				},
				{
					label: 'Background',
					description:
						'<a href="https://openstreetmap.in" class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">OpenStreetMap</a> (OpenStreetMap contributors)'
				}
			]
		},
		archivesSection: {
			title: 'From the Archives',
			content: 'Coming Soon!'
		},
		howToUseSection: {
			title: 'How to Use',
			items: [
				'Use the arrow buttons to switch between different years',
				'Zoom and pan around to explore different areas of the city',
				'Use the locate button on the bottom right to jump to your current location',
				'Select the gear icon to open the settings menu and enable more options'
			]
		},
		contributeSection: {
			title: 'Want to Contribute?',
			content:
				'Interested in helping us improve this project by contributing historical maps or documents? Contact us on <a href="https://www.instagram.com/blr.on.this.day/" class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Instagram</a> or check out the <a href="https://github.com/Vonter/blr-yesterday" class="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">GitHub repository</a>.'
		}
	}
};

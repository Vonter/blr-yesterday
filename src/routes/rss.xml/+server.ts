import { Feed } from 'feed';
import dailyData from '../../../static/daily.json';

export const prerender = true;

interface DailyEntry {
	files: string[];
	description: string;
}

function parseFilenameDate(filename: string): Date | null {
	const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})_UTC/);
	if (!match) return null;

	const [, year, month, day] = match;
	return new Date(`${year}-${month}-${day}T00:00:00Z`);
}

function getDailyFeedItems() {
	const items: Array<{
		title: string;
		description: string;
		link: string;
		date: Date;
		image?: string;
	}> = [];

	(dailyData.days as DailyEntry[]).forEach((day) => {
		// Skip entries with no files
		if (!day.files || day.files.length === 0) {
			return;
		}

		// Get the date from the first file
		const firstFile = day.files[0];
		const date = parseFilenameDate(firstFile);

		if (!date) {
			return;
		}

		// Create a title from the description or date
		const title =
			day.description ||
			date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});

		// Build description with all images
		let description = '';
		if (day.files.length > 0) {
			day.files.forEach((file) => {
				description += `https://media.blryesterday.com/daily/${file}\n`;
			});
		}

		items.push({
			title,
			description: description.trim(),
			link: `https://blryesterday.com/daily`,
			date,
			image: day.files[0] ? `https://media.blryesterday.com/daily/${day.files[0]}` : undefined
		});
	});

	// Sort by date descending (most recent first)
	items.sort((a, b) => b.date.getTime() - a.date.getTime());

	return items;
}

export async function GET() {
	const feed = new Feed({
		title: 'BLR Yesterday',
		description:
			"Explore Bangalore's transformation through historical maps and archival documents.",
		id: 'https://blryesterday.com/daily',
		link: 'https://blryesterday.com/daily',
		language: 'en',
		favicon: 'https://blryesterday.com/favicon.png',
		copyright: `© ${new Date().getFullYear().toString()} BLR Yesterday. All rights reserved.`,
		generator: 'Feed for Node.js',
		feedLinks: {
			rss: 'https://blryesterday.com/rss.xml'
		},
		author: {
			name: 'BLR Yesterday',
			link: 'https://blryesterday.com/'
		},
		image: 'https://blryesterday.com/sharecard.jpg',
		ttl: 1440 // 24 hours
	});

	const dailyItems = getDailyFeedItems();

	dailyItems.forEach((item) => {
		feed.addItem({
			title: item.title,
			description: item.description,
			link: item.link,
			date: item.date,
			...(item.image && {
				image: item.image,
				enclosure: {
					url: item.image,
					type: 'image/jpeg'
				}
			})
		});
	});

	return new Response(feed.rss2(), {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/rss+xml'
		}
	});
}

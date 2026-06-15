import { Feed } from 'feed';
import dailyData from '../../../static/daily.json';

export const prerender = true;

interface DailyEntry {
	files: string[];
	description: string;
}

const mediaUrl = (file: string) => `https://media.blryesterday.com/daily/${file}`;

function parseFilenameDate(filename: string): Date | null {
	const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})/);
	return match ? new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`) : null;
}

// Most-recent-first feed items, one per dated daily entry that has at least one file.
function getDailyFeedItems() {
	return (dailyData.days as DailyEntry[])
		.flatMap((day) => {
			const date = day.files?.length ? parseFilenameDate(day.files[0]) : null;
			if (!date) return [];

			const title =
				day.description ||
				date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

			return [
				{
					title,
					description: day.files.map(mediaUrl).join('\n'),
					link: 'https://blryesterday.com/daily',
					date,
					image: mediaUrl(day.files[0])
				}
			];
		})
		.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function GET() {
	const feed = new Feed({
		title: 'BLR Yesterday',
		description: "Explore Bangalore's history through old maps, photos and archival documents.",
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

interface DailyEntry {
	files: string[];
	description: string;
}

interface DailyData {
	days: DailyEntry[];
}

export async function load({ fetch }) {
	try {
		const response = await fetch('/daily.json');
		if (!response.ok) {
			throw new Error(`Failed to fetch daily data: ${response.statusText}`);
		}
		const data: DailyData = await response.json();

		// Reverse the array to show most recent first
		const reversedDays = [...data.days].reverse();

		return {
			days: reversedDays
		};
	} catch (error) {
		console.error('Error loading daily data:', error);
		return {
			days: []
		};
	}
}

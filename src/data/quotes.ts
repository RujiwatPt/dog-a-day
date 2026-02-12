/**
 * Motivational quotes collection
 */

const motivationalQuotes = [
	"Every dog has its day, and today is yours!",
	"Be the person your dog thinks you are.",
	"Life is better with a dog by your side.",
	"Chase your dreams like a dog chases a ball.",
	"Wag more, bark less.",
	"The best therapist has fur and four legs.",
	"Dogs teach us to live in the moment.",
	"Happiness is a warm puppy.",
	"Love is a four-legged word.",
	"Dogs leave paw prints on our hearts.",
	"Be loyal, be kind, be like a dog.",
	"Every day is a new adventure when you have a dog.",
	"Dogs remind us what matters most: love and loyalty.",
	"Life's ruff, but you've got this!",
	"Unleash your potential today!",
	"Stay pawsitive!",
	"You're pawsome just the way you are!",
	"Keep calm and pet a dog.",
	"Today's forecast: 100% chance of tail wags.",
	"Be someone's reason to smile today, like a dog is yours.",
];

/**
 * Get a random motivational quote
 */
export function getRandomQuote(): string {
	return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

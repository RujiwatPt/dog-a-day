/**
 * Landing page HTML template
 */

export function getLandingPageHTML(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="Get your daily dose of pawsitivity with random dog photos and motivational quotes">
	<title>Dog-a-Day | Daily Dose of Pawsitivity</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			min-height: 100vh;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20px;
			color: #333;
		}

		.container {
			max-width: 600px;
			width: 100%;
			background: white;
			border-radius: 24px;
			box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
			overflow: hidden;
			animation: fadeIn 0.6s ease-out;
		}

		@keyframes fadeIn {
			from {
				opacity: 0;
				transform: translateY(20px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}

		.header {
			padding: 32px 32px 24px;
			text-align: center;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
		}

		.header h1 {
			font-size: 2.5rem;
			font-weight: 700;
			margin-bottom: 8px;
			letter-spacing: -0.5px;
		}

		.header p {
			font-size: 1rem;
			opacity: 0.95;
			font-weight: 400;
		}

		.content {
			padding: 32px;
		}

		.dog-container {
			position: relative;
			width: 100%;
			min-height: 400px;
			max-height: 500px;
			background: #f5f5f5;
			border-radius: 16px;
			overflow: hidden;
			margin-bottom: 24px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.dog-image {
			width: 100%;
			height: 100%;
			object-fit: contain;
			transition: opacity 0.3s ease;
		}

		.dog-image.loading {
			opacity: 0;
		}

		.loading-spinner {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 48px;
			height: 48px;
			border: 4px solid #f3f3f3;
			border-top: 4px solid #667eea;
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}

		@keyframes spin {
			0% { transform: translate(-50%, -50%) rotate(0deg); }
			100% { transform: translate(-50%, -50%) rotate(360deg); }
		}

		.quote-container {
			background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
			padding: 24px;
			border-radius: 16px;
			margin-bottom: 24px;
			min-height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.quote {
			font-size: 1.25rem;
			font-weight: 500;
			line-height: 1.6;
			color: #2d3748;
		}

		.button {
			width: 100%;
			padding: 16px 32px;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			border: none;
			border-radius: 12px;
			font-size: 1.1rem;
			font-weight: 600;
			cursor: pointer;
			transition: all 0.3s ease;
			box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
		}

		.button:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
		}

		.button:active {
			transform: translateY(0);
		}

		.button:disabled {
			opacity: 0.6;
			cursor: not-allowed;
			transform: none;
		}

		@media (max-width: 640px) {
			.header h1 {
				font-size: 2rem;
			}

			.quote {
				font-size: 1.1rem;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>🐕 Dog-a-Day</h1>
			<p>Your daily dose of pawsitivity</p>
		</div>
		<div class="content">
			<div class="dog-container">
				<div class="loading-spinner"></div>
				<img id="dogImage" class="dog-image loading" alt="Random dog" />
			</div>
			<div class="quote-container">
				<p id="quote" class="quote"></p>
			</div>
			<button id="newDogBtn" class="button">Get Another Dog! 🎉</button>
		</div>
	</div>

	<script>
		(function() {
			'use strict';
			
			const dogImage = document.getElementById('dogImage');
			const quote = document.getElementById('quote');
			const newDogBtn = document.getElementById('newDogBtn');
			const spinner = document.querySelector('.loading-spinner');

			// Track current request to prevent race conditions
			let currentRequest = null;

			async function loadNewDog() {
				try {
					// Cancel previous request if still pending
					if (currentRequest) {
						currentRequest.aborted = true;
					}

					// Create new request tracker
					const requestId = Date.now();
					currentRequest = { id: requestId, aborted: false };

					// UI: Show loading state
					newDogBtn.disabled = true;
					dogImage.classList.add('loading');
					spinner.style.display = 'block';

					// Fetch API with cache busting
					const response = await fetch('/api/dog?_=' + requestId, {
						cache: 'no-store',
						headers: {
							'Cache-Control': 'no-cache, no-store, must-revalidate',
							'Pragma': 'no-cache'
						}
					});

					// Check if this request was superseded
					if (currentRequest.id !== requestId || currentRequest.aborted) {
						return;
					}

					if (!response.ok) {
						throw new Error('HTTP error! status: ' + response.status);
					}

					const data = await response.json();

					// Preload image with timeout and error handling
					await new Promise(function(resolve, reject) {
						const img = new Image();
						const timeout = setTimeout(function() {
							reject(new Error('Image load timeout'));
						}, 10000);

						img.onload = function() {
							clearTimeout(timeout);
							resolve();
						};

						img.onerror = function() {
							clearTimeout(timeout);
							reject(new Error('Image failed to load'));
						};

						// Add cache busting to image URL
						const imageUrl = new URL(data.image);
						imageUrl.searchParams.set('_', requestId);
						img.src = imageUrl.toString();
					});

					// Check again if request was superseded during image load
					if (currentRequest.id !== requestId || currentRequest.aborted) {
						return;
					}

					// Update DOM with new data
					const imageUrl = new URL(data.image);
					imageUrl.searchParams.set('_', requestId);
					dogImage.src = imageUrl.toString();
					quote.textContent = data.quote;

					// UI: Hide loading state
					dogImage.classList.remove('loading');
					spinner.style.display = 'none';
					newDogBtn.disabled = false;

				} catch (error) {
					console.error('Error loading dog:', error);
					quote.textContent = 'Oops! Something went wrong. Try again!';
					spinner.style.display = 'none';
					newDogBtn.disabled = false;
				}
			}

			// Button click handler
			newDogBtn.addEventListener('click', function() {
				loadNewDog();
			});

			// Load initial dog
			loadNewDog();
		})();
	</script>
</body>
</html>`;
}

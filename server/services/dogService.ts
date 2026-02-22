interface DogImageResponse {
  imageUrl: string;
  status: string;
}

const DOG_API_URL = process.env.DOG_API_URL || 'https://dog.ceo/api/breeds/image/random';

/**
 * Fetch a random dog image from the Dog API
 * @returns {Promise<DogImageResponse>} Dog image data
 * @throws {Error} If the API request fails
 */
export async function getRandomDogImage(): Promise<DogImageResponse> {
  try {
    const response = await fetch(DOG_API_URL);

    if (!response.ok) {
      throw new Error(`Dog API returned status ${response.status}`);
    }

    const data = (await response.json()) as { message: string; status: string };

    if (data.status !== 'success') {
      throw new Error('Failed to fetch dog image from API');
    }

    return {
      imageUrl: data.message,
      status: 'success'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to fetch dog image: ${errorMessage}`);
  }
}

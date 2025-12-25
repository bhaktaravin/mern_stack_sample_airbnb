export async function getListings(page = 1, limit = 20) {
    const response = await fetch(`https://mern-stack-sample-airbnb.onrender.com/api/listings?page=${page}&limit=${limit}`);
    console.log('API response status:', response.status);
    if (!response.ok) throw new Error('API error');
    return response.json();
}
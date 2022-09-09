import axios from 'axios';

const API_KEY = '21895237-aa305ef77d16e82934d36c66d';
const URL = 'https://pixabay.com/api/';

const fetchImages = async ({ searchQuery, page }) => {
  const resp = await axios.get(
    `${URL}?q=${searchQuery}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );
  return resp.data.hits;
};

const API = { fetchImages };
export default API;

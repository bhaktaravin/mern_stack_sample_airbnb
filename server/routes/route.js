import { Router } from 'express';
import { createListing, getAllListings, getListingBySlug,deleteListingByCuid} from '../controller/listingsController.js';


const router = Router();

// Define your routes here
router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.post('/listings', createListing);
router.get('/listings/:slug', getListingBySlug);
router.get('/listings', getAllListings);
router.delete('/listings/:cuid', deleteListingByCuid);



export default router;
// Generate a controller for handling listings
import Listing from '../model/listings.js';
import mongoose from 'mongoose';




// Create a new listing
export const createListing = async (req, res) => {
    try {
        const newListing = new Listing(req.body);
        const savedListing = await newListing.save();
        res.status(201).json(savedListing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a listing by slug
export const getListingBySlug = async (req, res) => {
    try {
        const listing = await Listing.findOne({ slug: req.params.slug });
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json(listing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all listings with filtering and pagination
export const getAllListings = async (req, res) => {
    try {
        console.log('Attempting to fetch listings from collection...');
        console.log('Query parameters:', req.query);
        
        // Extract query parameters
        const {
            page = 1,
            limit = 20,
            property_type,
            room_type,
            country,
            min_price,
            max_price,
            accommodates,
            bedrooms,
            bathrooms,
            search
        } = req.query;

        // Build filter object
        const filter = {};

        // Text search across name and description
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } }
            ];
        }

        // Property type filter
        if (property_type) {
            filter.property_type = { $regex: property_type, $options: 'i' };
        }

        // Room type filter
        if (room_type) {
            filter.room_type = { $regex: room_type, $options: 'i' };
        }

        // Country filter
        if (country) {
            filter['address.country'] = { $regex: country, $options: 'i' };
        }

        // Price range filter (handle $numberDecimal format)
        if (min_price || max_price) {
            const priceFilter = {};
            if (min_price) {
                priceFilter.$gte = { $numberDecimal: min_price };
            }
            if (max_price) {
                priceFilter.$lte = { $numberDecimal: max_price };
            }
            filter.price = priceFilter;
        }

        // Accommodates filter
        if (accommodates) {
            filter.accommodates = { $gte: parseInt(accommodates) };
        }

        // Bedrooms filter
        if (bedrooms) {
            filter.bedrooms = { $gte: parseInt(bedrooms) };
        }

        // Bathrooms filter (handle $numberDecimal format)
        if (bathrooms) {
            filter.bathrooms = { $gte: { $numberDecimal: bathrooms } };
        }

        console.log('Applied filters:', JSON.stringify(filter, null, 2));

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get total count with filters
        const totalCount = await Listing.countDocuments(filter);
        console.log('Total documents matching filter:', totalCount);

        // Get filtered and paginated listings
        const listings = await Listing.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ _id: 1 }); // Sort by _id for consistent pagination

        console.log('Number of listings fetched:', listings.length);

        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / parseInt(limit));
        const hasNextPage = parseInt(page) < totalPages;
        const hasPrevPage = parseInt(page) > 1;

        res.status(200).json({
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages,
            hasNextPage,
            hasPrevPage,
            fetched: listings.length,
            listings: listings
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a listing by cuid
export const deleteListingByCuid = async (req, res) => {
    try {
        const deletedListing = await Listing.findOneAndDelete({ cuid: req.params.cuid });
        if (!deletedListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export default {
    createListing,
    getListingBySlug,
    getAllListings,
    deleteListingByCuid,
};

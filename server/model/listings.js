import mongoose from "mongoose";

// Schema that matches the actual MongoDB document structure
const listingSchema = new mongoose.Schema({
    _id: String, // In your data, _id is a string, not ObjectId
    slug: { type: String, unique: true, index: true },
    listing_url: String,
    name: String,
    summary: String,
    space: String,
    description: String,
    neighborhood_overview: String,
    notes: String,
    transit: String,
    access: String,
    interaction: String,
    house_rules: String,
    property_type: String,
    room_type: String,
    bed_type: String,
    minimum_nights: String, // Your data has this as string
    maximum_nights: String, // Your data has this as string
    cancellation_policy: String,
    last_scraped: Date,
    calendar_last_scraped: Date,
    first_review: Date,
    last_review: Date,
    accommodates: Number,
    bedrooms: Number,
    beds: Number,
    number_of_reviews: Number,
    bathrooms: mongoose.Schema.Types.Mixed, // This is $numberDecimal in your data
    amenities: [String],
    price: mongoose.Schema.Types.Mixed, // This is $numberDecimal in your data
    weekly_price: mongoose.Schema.Types.Mixed,
    extra_people: mongoose.Schema.Types.Mixed,
    guests_included: mongoose.Schema.Types.Mixed,
    images: {
        thumbnail_url: String,
        medium_url: String,
        picture_url: String, // Your actual field name
        xl_picture_url: String
    },
    host: {
        host_id: String,
        host_url: String,
        host_name: String,
        host_location: String,
        host_about: String,
        host_thumbnail_url: String,
        host_picture_url: String,
        host_neighbourhood: String,
        host_is_superhost: Boolean,
        host_has_profile_pic: Boolean,
        host_identity_verified: Boolean,
        host_listings_count: Number,
        host_total_listings_count: Number,
        host_verifications: [String]
    },
    address: {
        street: String,
        suburb: String,
        government_area: String,
        market: String,
        country: String,
        country_code: String,
        location: {
            type: String,
            coordinates: [Number],
            is_location_exact: Boolean
        }
    },
    availability: {
        availability_30: Number,
        availability_60: Number,
        availability_90: Number,
        availability_365: Number
    },
    review_scores: {
        review_scores_accuracy: Number,
        review_scores_cleanliness: Number,
        review_scores_checkin: Number,
        review_scores_communication: Number,
        review_scores_location: Number,
        review_scores_value: Number,
        review_scores_rating: Number
    },
    reviews: [{
        _id: String,
        date: Date,
        listing_id: String,
        reviewer_id: String,
        reviewer_name: String,
        comments: String
    }]
}, { strict: false }); // Allow additional fields not defined in schema

// Specify the collection name explicitly for the sample_airbnb database
export default mongoose.model("Listing", listingSchema, "listingsAndReviews");
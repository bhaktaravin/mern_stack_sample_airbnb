<script setup>
import { onMounted, ref } from 'vue';

const showModal = ref(false);
const selectedListing = ref(null);

function openModal(listing) {
  selectedListing.value = listing;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedListing.value = null;
}
import { getListings } from '../services/api';
import "./Home.css";

const listings = ref([]);
const currentPage = ref(1);
const hasNextPage = ref(false);
const hasPrevPage = ref(false);
const totalPages = ref(1);

async function fetchListings(page = 1) {
  try {
    const response = await getListings(page);
    listings.value = response.listings;
    hasNextPage.value = response.hasNextPage;
    hasPrevPage.value = response.hasPrevPage;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Failed to fetch listings:', error);
  }
}

onMounted(() => {
  fetchListings(currentPage.value);
});

function nextPage() {
  if (hasNextPage.value) {
    currentPage.value++;
    fetchListings(currentPage.value);
  }
}

function prevPage() {
  if (hasPrevPage.value && currentPage.value > 1) {
    currentPage.value--;
    fetchListings(currentPage.value);
  }
}
</script>

<template>
  <div>
    <div class="card-list">
      <div v-for="item in listings" :key="item._id" class="card" @click="openModal(item)" style="cursor:pointer;">
        <img v-if="item.images && item.images.picture_url" :src="item.images.picture_url" alt="Listing image" class="card-img" />
        <div class="card-info">
          <div class="card-title">{{ item.name }}</div>
          <div class="card-location">{{ item.address?.country || 'Unknown location' }}</div>
          <div class="card-price">{{ item.price?.$numberDecimal ? `$${item.price.$numberDecimal}` : 'Price N/A' }}</div>
          <div class="card-rating">
            <span v-if="item.number_of_reviews">★</span>
            <span v-if="item.number_of_reviews">{{ item.number_of_reviews }} reviews</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for listing details -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">&times;</button>
        <img v-if="selectedListing?.images?.picture_url" :src="selectedListing.images.picture_url" alt="Listing image" style="width:100%;border-radius:8px;max-height:300px;object-fit:cover;" />
        <h2>{{ selectedListing?.name }}</h2>
        <p><strong>Location:</strong> {{ selectedListing?.address?.country || 'Unknown location' }}</p>
        <p><strong>Price:</strong> {{ selectedListing?.price?.$numberDecimal ? `$${selectedListing.price.$numberDecimal}` : 'N/A' }}</p>
        <p><strong>Reviews:</strong> {{ selectedListing?.number_of_reviews || 0 }}</p>
        <p><strong>Summary:</strong> {{ selectedListing?.summary || selectedListing?.description }}</p>
        <p><strong>Bedrooms:</strong> {{ selectedListing?.bedrooms || 'N/A' }}</p>
        <p><strong>Bathrooms:</strong> {{ selectedListing?.bathrooms?.$numberDecimal || selectedListing?.bathrooms || 'N/A' }}</p>
        <p><strong>Property Type:</strong> {{ selectedListing?.property_type || 'N/A' }}</p>
        <p><strong>Amenities:</strong> {{ selectedListing?.amenities?.join(', ') || 'N/A' }}</p>
      </div>
    </div>
    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: #fff;
      padding: 2rem;
      border-radius: 12px;
      max-width: 400px;
      width: 90vw;
      position: relative;
      box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    }
    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
    }
    <button @click="prevPage" :disabled="!hasPrevPage">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="nextPage" :disabled="!hasNextPage">Next</button>
  </div>
</template>
"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function DatabaseTest() {
  const profileStore = useProfileStore();
  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();
  
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testProfileLoad = async () => {
    addResult("Testing profile load...");
    try {
      await profileStore.loadProfile();
      addResult(`✅ Profile loaded! Found ${profileStore.pets.length} pets`);
    } catch (error) {
      addResult(`❌ Profile load failed: ${error}`);
    }
  };

  const testCartLoad = async () => {
    addResult("Testing cart load...");
    try {
      await cartStore.loadCart();
      addResult(`✅ Cart loaded! Found ${cartStore.items.length} items`);
    } catch (error) {
      addResult(`❌ Cart load failed: ${error}`);
    }
  };

  const testWishlistLoad = async () => {
    addResult("Testing wishlist load...");
    try {
      addResult(`✅ Wishlist loaded! Found ${wishlistStore.items.length} items`);
    } catch (error) {
      addResult(`❌ Wishlist load failed: ${error}`);
    }
  };

  const testAddPet = async () => {
    addResult("Testing add pet to DB...");
    try {
      await profileStore.addPetToDB({
        name: "Test Pet",
        breed: "Test Breed",
        type: "dog",
        gender: "M",
        dob: { date: "01", month: "01", year: "2023" },
        allergies: [],
        sensitivities: [],
        photo: null,
      });
      addResult("✅ Pet added to database!");
    } catch (error) {
      addResult(`❌ Add pet failed: ${error}`);
    }
  };

  const testAddToCart = async () => {
    addResult("Testing add item to cart...");
    try {
      await cartStore.addItemToDB({
        id: "test-item",
        name: "Test Product",
        title: "Test Product",
        price: 29.99,
        image: "/test-image.jpg",
        category: "food",
      });
      addResult("✅ Item added to cart!");
    } catch (error) {
      addResult(`❌ Add to cart failed: ${error}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Integration Test</h1>
      
      <div className="space-y-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={testProfileLoad}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load Profile
          </button>
          <button
            onClick={testCartLoad}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Load Cart
          </button>
          <button
            onClick={testWishlistLoad}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Load Wishlist
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={testAddPet}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Add Test Pet
          </button>
          <button
            onClick={testAddToCart}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Add Test Item
          </button>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
        <h2 className="font-semibold mb-2">Test Results:</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet. Click buttons above to test database integration.</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Current State:</h3>
          <p>Profile: {profileStore.isLoading ? 'Loading...' : `${profileStore.pets.length} pets`}</p>
          <p>Cart: {cartStore.isLoading ? 'Loading...' : `${cartStore.items.length} items`}</p>
          <p>Wishlist: {wishlistStore.items.length} items</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">API Status:</h3>
          <p>Backend: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}</p>
          <p>Auth Token: {localStorage.getItem('wanya_token') ? 'Present' : 'Not found'}</p>
        </div>
      </div>
    </div>
  );
}

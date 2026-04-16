"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { 
  ArrowLeft, Heart, Share2, Star, ChevronDown, ChevronUp, 
  Truck, Shield, RefreshCw, Package, Plus, Minus, Send,
  ThumbsUp, MessageSquare, User as UserIcon, CreditCard
} from "lucide-react";
import Link from "next/link";
import QuantityModal from "../cart/QuantityModal";
import { useWishlistStore } from "@/store/useWishlistStore";
import Button from "../ui/Button";
import { useNotificationStore } from "@/store/useNotificationStore";
import QuantitySelector from "../cart/QuantitySelector";
import ProductReviews from "./ProductReviews";
import { getProductImage, PLACEHOLDER_IMAGE } from "@/lib/image";
import { useTranslations } from "next-intl"
export type Product = {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  imageUrl?: string;
  description?: string;
  rating?: number;
  category?: string;
  inStock?: boolean;
  type?: 'product' | 'service' | 'bento';
  numReviews?: number;
  brand?: string;
  features?: string[];
  ingredients?: string[];
  nutritionalInfo?: {
    protein?: string;
    fat?: string;
    fiber?: string;
    moisture?: string;
  };
  stock?: number;
  originalPrice?: number;
};

type Review = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
};

type Props = {
  product: Product;
  similarProducts?: Product[];
};

export default function ProductDetails({ product, similarProducts = [] }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [selectedPack, setSelectedPack] = useState("1kg");
  const [openDetails, setOpenDetails] = useState(false);
  const [openQuantityModal, setOpenQuantityModal] = useState(false);
  const s = useTranslations("system");
  const t = useTranslations("product");
  const n = useTranslations("notifications")
  const productId = product.id || product._id;
  const productImage = getProductImage(product);

  const wishlistStore = useWishlistStore();
  const isLiked = wishlistStore.isInWishlist(productId || "");
  const router = useRouter();
  const cartStore = useCartStore();
  const isInCart = cartStore.items.some((item) => item.id === productId);
  const { addNotification } = useNotificationStore();

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text:n("check"),
          url,
        });
      } catch {
        console.log(n("shareCancel"));
      }
    } else {
      await navigator.clipboard.writeText(url);
      addNotification({ title: n("link"), message: n("copied"), type: "success", read: false });
    }
  };

  const handleBuyNow = () => {
    if (!productId) return;
    
    // Add to cart first
    cartStore.addItem({
      id: productId,
      name: product.name,
      title: product.name,
      price: product.price,
      image: productImage,
      category: product.category,
      rating: product.rating || 0,
    });

    if (quantity > 1) {
      cartStore.updateQuantity(productId, quantity);
    }

    // Then redirect to cart/checkout
    router.push('/cart');
  };

  const handleAddToCart = () => {
    if (!productId) return;
    
    setOpenQuantityModal(true);
  };

  const handleQuantityConfirm = (confirmedQuantity: number) => {
    if (!productId) return;
    
    // addItem in store expects Omit<CartItem, 'quantity'>
    cartStore.addItem({
      id: productId,
      name: product.name,
      title: product.name,
      price: product.price,
      image: productImage,
      category: product.category,
      rating: product.rating || 0,
    });

    // If quantity is more than 1, update it
    if (confirmedQuantity > 1) {
      cartStore.updateQuantity(productId, confirmedQuantity);
    }
    
    addNotification({
      title: s("addedToCart"),
      message: `${product.name} ${s("addedToCart")}`,
      type: "success",
      read: false,
    });
    
    setOpenQuantityModal(false);
  };

  const renderStars = (rating: number, size = "small") => {
    const starSize = size === "small" ? 14 : size === "medium" ? 18 : 24;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={starSize}
        className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
      />
    ));
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-[#f6f2ea] min-h-screen pb-40 flex justify-center">
      <div className="w-full max-w-[600px] bg-white min-h-screen relative shadow-xl">
      
      {/* HEADER WITH IMAGE */}
      <div className="relative h-[320px] bg-white">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg"
        >
          <ArrowLeft size={18} className="text-gray-800" />
        </button>

        {/* Action Buttons */}
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            onClick={() => {
              if (!productId) return;
              wishlistStore.toggleItem({
                id: productId,
                name: product.name,
                price: product.price,
                image: productImage,
                category: product.category,
              });
            }}
            className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg"
          >
            <Heart
              size={18}
              className={isLiked ? "text-red-500 fill-red-500" : "text-gray-600"}
            />
          </button>

          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg"
          >
            <Share2 size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Stock Badge */}
        {product.inStock !== false && (
          <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {t("instock")}
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="px-4 sm:px-6 py-6 space-y-6">

        {/* PRODUCT HEADER */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-sm text-gray-500 mb-2">{t("by")} {product.brand}</p>
              )}
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating || 0, "medium")}
                  <span className="text-sm font-medium text-gray-700">
                    {product.rating || 0}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.numReviews || 0} {t("reviews")})
                </span>
              </div>
            </div>
          
            <div className="text-right">
              {discount > 0 && (
                <div className="flex items-center gap-2 justify-end mb-1">
                  <span className="text-sm text-gray-500 line-through">
                    ¥{product.originalPrice?.toLocaleString()}
                  </span>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    -{discount}%
                  </span>
                </div>
              )}
              <div className="text-xl sm:text-2xl font-bold text-[#d4a017]">
                ¥{product.price.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <Truck size={16} />
              <span>{t("freeDelivery")}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <Shield size={16} />
              <span>{t("quality")}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <RefreshCw size={16} />
              <span>{t("returns")}</span>
            </div>
          </div>
        </div>

        {/* QUANTITY SELECTOR */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{t("quantity")}</h3>
              <p className="text-sm text-gray-500">{t("select")}</p>
            </div>
            <div className="flex items-center bg-gray-50 rounded-xl px-2">
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            </div>
          </div>
        </div>

        {/* PACK SIZE (for food products) */}
        {product.category?.toLowerCase() === "foods" && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">{t("packSize")}</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { size: "1kg", price: product.price, unitPrice: product.price },
                { size: "2kg", price: product.price * 2, unitPrice: product.price },
                { size: "5kg", price: product.price * 4.5, unitPrice: product.price * 0.9 },
              ].map((pack) => (
                <button
                  key={pack.size}
                  onClick={() => setSelectedPack(pack.size)}
                  className={`border-2 rounded-xl p-4 text-center transition-all ${
                    selectedPack === pack.size
                      ? "border-[#d4a017] bg-[#fef8e7]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">{pack.size}</p>
                  <p className="text-sm text-gray-600">¥{pack.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">¥{pack.unitPrice.toLocaleString()}/kg</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCT DESCRIPTION */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setOpenDetails(!openDetails)}
            className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">{t("details")}</h3>
            {openDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {openDetails && (
            <div className="px-4 sm:px-6 pb-6 space-y-4">
              <p className="text-gray-600 leading-relaxed">
                {product.description || t("detailExample")}
              </p>
              
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{t("key")}</h4>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-[#d4a017] mt-1">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{t("ingred")}</h4>
                  <p className="text-sm text-gray-600">{product.ingredients.join(", ")}</p>
                </div>
              )}

              {product.nutritionalInfo && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{t("nutInfo")}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <ProductReviews 
          productId={productId || ""} 
          initialRating={product.rating || 0} 
        />

        {/* SIMILAR PRODUCTS */}
        {similarProducts.length > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">{t("similar")}</h3>
            <div className="grid grid-cols-2 gap-4">
              {similarProducts.slice(0, 4).map((similarProduct) => (
                <Link
                  key={similarProduct.id || similarProduct._id}
                  href={`/dashboard/shop/${similarProduct.id || similarProduct._id}`}
                  className="group"
                >
                  <div className="border border-gray-200 rounded-xl p-3 hover:border-[#d4a017] transition-colors">
                    <img
                      src={getProductImage(similarProduct)}
                      alt={similarProduct.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <h4 className="font-medium text-sm text-gray-900 group-hover:text-[#d4a017] transition-colors line-clamp-2">
                      {similarProduct.name}
                    </h4>
                    <p className="text-sm font-semibold text-[#d4a017] mt-1">
                      ¥{similarProduct.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 flex items-center gap-3 z-50 max-w-[600px] mx-auto rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.08)]">
        <div className="flex flex-col">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t("total")}</p>
          <p className="text-xl font-black text-[#d4a017]">¥{(product.price * quantity).toLocaleString()}</p>
        </div>
        
        <div className="flex flex-1 gap-2">
          <Button
            onClick={handleAddToCart}
            variant="secondary"
            className="flex-1 py-3.5 rounded-xl font-bold border-2 active:scale-95"
          >
            {t("add")}
          </Button>

          <Button
            onClick={handleBuyNow}
            className="flex-[2] py-3.5 rounded-xl font-bold shadow-lg shadow-yellow-500/30 active:scale-95"
          >
            {t("buyNow")}
          </Button>
        </div>
      </div>

      {/* QUANTITY MODAL */}
      <QuantityModal
        open={openQuantityModal}
        onClose={() => setOpenQuantityModal(false)}
        product={product}
        onConfirm={handleQuantityConfirm}
      />
      </div>
    </div>
    
);
}

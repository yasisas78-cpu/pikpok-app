export interface ProductVariantOption {
  label: string;
  value: string;
  inStock: boolean;
  colorHex?: string;
}

export interface ProductVariant {
  name: string;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  brandAvatar: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  salesCount: string;
  images: string[];
  description: string;
  features: string[];
  variants: ProductVariant[];
  stock: number;
  category: string;
  freeShipping: boolean;
  voucher?: {
    code: string;
    discountAmount: number;
    description: string;
  };
}

export interface Creator {
  name: string;
  handle: string;
  avatar: string;
  isVerified: boolean;
  followers: string;
  followingCount?: string;
  likesCount?: string;
  bio?: string;
  bannerUrl?: string;
  isFollowing?: boolean;
}

export interface CommentItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    badge?: string;
  };
  text: string;
  timeAgo: string;
  likes: number;
  isLiked?: boolean;
}

export interface VideoItem {
  id: string;
  videoUrl: string;
  posterUrl: string;
  creator: Creator;
  caption: string;
  tags: string[];
  soundTitle: string;
  soundArtist: string;
  soundCoverUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount?: string;
  postType?: 'shopping' | 'reel';
  isEcommerce?: boolean;
  product?: Product;
  badgeText?: string;
}

export interface MessageItem {
  id: string;
  senderId: string; // 'me' | creator handle
  text: string;
  timestamp: string;
  productPreview?: Product;
}

export interface ChatConversation {
  id: string;
  creator: Creator;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: MessageItem[];
}

export interface LiveStreamItem {
  id: string;
  creator: Creator;
  streamTitle: string;
  videoUrl: string;
  posterUrl: string;
  viewersCount: string;
  category: string;
  pinnedProduct?: Product;
  pinnedDiscount?: string;
}

export interface SoundTrackItem {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  usageCount: string;
  duration: string;
  category: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  totalPrice: number;
  orderNumber: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: string;
}

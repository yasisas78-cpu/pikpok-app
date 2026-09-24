export type Language = 'en' | 'ru' | 'ur';

export type ReelTab = 'foryou' | 'following' | 'friends';

export type PaymentMethod = 'cod' | 'bank' | 'jazzcash' | 'easypaisa';

export interface LocalizedString {
  en: string;
  ru: string;
  ur: string;
}

export interface Product {
  id: string;
  title: LocalizedString;
  category: string;
  categoryLabel: LocalizedString;
  pricePKR: number;
  originalPricePKR: number;
  discountPercent: number;
  image: string;
  rating: number;
  reviewsCount: number;
  soldCount: string;
  badge: LocalizedString;
  description: LocalizedString;
  features: {
    en: string[];
    ru: string[];
    ur: string[];
  };
}

export interface CommentItem {
  id: string;
  user: string;
  avatar: string;
  city: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  timeAgo: string;
  verifiedBuyer?: boolean;
}

export interface VideoPost {
  id: string;
  videoUrl: string;
  posterUrl: string;
  creator: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  description: LocalizedString;
  tags: string[];
  soundTitle: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved?: boolean;
  isFollowed: boolean;
  isFriend?: boolean;
  feedCategory?: ('foryou' | 'following' | 'friends')[];
  product: Product;
  commentsList: CommentItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AdvancePaymentProof {
  method: PaymentMethod;
  transactionId: string;
  senderAccount: string;
  bankName?: string;
  screenshotUrl?: string;
  screenshotName?: string;
}

export interface OrderDetails {
  trackingId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  date: string;
  paymentMethod: PaymentMethod;
  paymentProof?: AdvancePaymentProof;
  deliveryZone?: 'same-city' | 'major-intercity' | 'remote';
  packageWeightKg?: number;
  sellerGross?: number;
  platformCommission?: number;
  sellerPayout?: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  body: string;
  imageUrls: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface SellerWalletBalances {
  inEscrow: number;
  processingSettlement: number;
  availableBalance: number;
}

export type UserRole = 'buyer' | 'seller';

export interface AuthUser {
  id: string;
  name: string;
  username?: string;
  bio?: string;
  emailOrPhone: string;
  avatar: string;
  role: UserRole;
  method: 'google' | 'phone' | 'email';
}

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'system';
  text: string;
  timestamp: string;
  productId?: string;
  isOrderUpdate?: boolean;
}

export interface Conversation {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerShopName: string;
  sellerVerified: boolean;
  product?: {
    id: string;
    title: string;
    image: string;
    pricePKR: number;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  role?: UserRole;
  emailOrPhone?: string;
  bio: LocalizedString;
  followersCount: string;
  followingCount: number;
  totalLikesCount: string;
  streakScore: number;
  lastActiveTimestamp: number; // Unix timestamp ms
}

export interface UserUploadedVideo {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  views: string;
  likes: number;
  date: string;
  linkedProductName?: string;
}

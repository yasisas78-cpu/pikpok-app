import React, { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Star, ThumbsUp } from 'lucide-react';
import { ProductReview } from '../types';
import { supabase } from '../lib/supabase';

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
  userId?: string;
  verifiedBuyer?: boolean;
  verifiedOrderId?: string;
}

const stars = [5, 4, 3, 2, 1];

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, rating, reviewCount, userId, verifiedBuyer = false, verifiedOrderId }) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [sort, setSort] = useState<'relevance' | 'latest'>('relevance');
  const [withPhotos, setWithPhotos] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [draftRating, setDraftRating] = useState(5);
  const [draftBody, setDraftBody] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    void supabase.from('product_reviews').select('id, product_id, user_id, rating, body, verified_purchase, helpful_count, created_at, product_review_images(image_url)')
      .eq('product_id', productId)
      .then(({ data }) => {
        if (!data) return;
        setReviews(data.map((row) => ({
          id: row.id,
          productId: row.product_id,
          userId: row.user_id,
          userName: row.user_id === userId ? 'You' : 'Verified buyer',
          rating: row.rating,
          body: row.body,
          imageUrls: (row.product_review_images || []).map((image: { image_url: string }) => image.image_url),
          verifiedPurchase: row.verified_purchase,
          helpfulCount: row.helpful_count,
          createdAt: row.created_at
        })));
      });
  }, [productId, userId]);

  const visibleReviews = useMemo(() => reviews
    .filter((review) => selectedRating === null || review.rating === selectedRating)
    .filter((review) => !withPhotos || review.imageUrls.length > 0)
    .sort((a, b) => sort === 'latest'
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : b.helpfulCount - a.helpfulCount), [reviews, selectedRating, sort, withPhotos]);

  const counts = stars.map((value) => reviews.filter((review) => review.rating === value).length);
  const displayCount = reviews.length || reviewCount;
  const ratingPercent = displayCount ? Math.round((rating / 5) * 100) : 0;

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !userId || !verifiedBuyer || !verifiedOrderId || !draftBody.trim()) return;
    setIsSubmitting(true);
    const { data, error } = await supabase.from('product_reviews').insert({
      product_id: productId,
      user_id: userId,
      order_id: verifiedOrderId,
      rating: draftRating,
      body: draftBody.trim(),
      verified_purchase: true
    }).select('id, created_at').single();
    if (error || !data) {
      setMessage(error?.message || 'Review could not be submitted.');
      setIsSubmitting(false);
      return;
    }

    for (const image of reviewImages) {
      const path = `${userId}/${data.id}/${crypto.randomUUID()}-${image.name}`;
      const upload = await supabase.storage.from('review-images').upload(path, image, { contentType: image.type });
      if (!upload.error) {
        const { data: publicUrl } = supabase.storage.from('review-images').getPublicUrl(path);
        await supabase.from('product_review_images').insert({ review_id: data.id, image_url: publicUrl.publicUrl });
      }
    }
    setReviews((current) => [{ id: data.id, productId, userId, userName: 'You', rating: draftRating, body: draftBody.trim(), imageUrls: [], verifiedPurchase: true, helpfulCount: 0, createdAt: data.created_at }, ...current]);
    setDraftBody('');
    setReviewImages([]);
    setMessage('Verified review published.');
    setIsSubmitting(false);
  };

  const toggleHelpful = async (review: ProductReview) => {
    if (!supabase || !userId) return;
    const existing = review.userId === userId;
    const nextCount = Math.max(0, review.helpfulCount + (existing ? -1 : 1));
    setReviews((current) => current.map((item) => item.id === review.id ? { ...item, helpfulCount: nextCount } : item));
    if (existing) await supabase.from('review_helpful').delete().eq('review_id', review.id).eq('user_id', userId);
    else await supabase.from('review_helpful').insert({ review_id: review.id, user_id: userId });
  };

  return (
    <section className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-white">Ratings & reviews</h4>
        <span className="text-[10px] text-neutral-400">{displayCount} ratings</span>
      </div>
      <div className="flex gap-4">
        <div className="w-20 shrink-0 text-center"><p className="text-3xl font-black text-white">{rating.toFixed(1)}</p><div className="flex justify-center text-amber-400">{stars.map((star) => <Star key={star} className={`h-3 w-3 ${star <= Math.round(rating) ? 'fill-current' : ''}`} />)}</div><p className="mt-1 text-[10px] text-neutral-500">out of 5.0</p></div>
        <div className="flex-1 space-y-1">{stars.map((star, index) => <button key={star} onClick={() => setSelectedRating(selectedRating === star ? null : star)} className="flex w-full items-center gap-2 text-[10px] text-neutral-400"><span className="w-3">{star}</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-800"><div className="h-full rounded-full bg-amber-400" style={{ width: `${reviews.length ? (counts[index] / reviews.length) * 100 : ratingPercent}%` }} /></div><span className="w-4 text-right">{counts[index]}</span></button>)}</div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar"><button onClick={() => setSort('relevance')} className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${sort === 'relevance' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400'}`}>Relevance</button><button onClick={() => setSort('latest')} className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${sort === 'latest' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400'}`}>Latest</button><button onClick={() => setWithPhotos(!withPhotos)} className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${withPhotos ? 'bg-pink-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>With photos</button></div>
      {verifiedBuyer && <form onSubmit={submitReview} className="space-y-2 border-t border-neutral-800 pt-3"><div className="flex items-center gap-1">{stars.map((star) => <button type="button" key={star} onClick={() => setDraftRating(star)}><Star className={`h-4 w-4 ${star <= draftRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'}`} /></button>)}</div><textarea value={draftBody} onChange={(event) => setDraftBody(event.target.value)} placeholder="Share your verified buying experience" className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-xs text-white" /><label className="flex cursor-pointer items-center gap-2 text-[10px] text-neutral-400"><ImagePlus className="h-4 w-4" />Add review photos<input type="file" accept="image/*" multiple className="hidden" onChange={(event) => setReviewImages(Array.from(event.target.files || []))} /></label><button disabled={isSubmitting} className="rounded-xl bg-pink-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{isSubmitting ? 'Publishing...' : 'Publish verified review'}</button></form>}
      {message && <p className="text-[10px] text-emerald-400">{message}</p>}
      <div className="space-y-3">{visibleReviews.length === 0 ? <p className="py-3 text-center text-xs text-neutral-500">No reviews match these filters yet.</p> : visibleReviews.map((review) => <article key={review.id} className="border-t border-neutral-800 pt-3"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-white">{review.userName} {review.verifiedPurchase && <span className="text-emerald-400">Verified purchase</span>}</p><div className="flex text-amber-400">{stars.map((star) => <Star key={star} className={`h-3 w-3 ${star <= review.rating ? 'fill-current' : ''}`} />)}</div></div><span className="text-[10px] text-neutral-500">{new Date(review.createdAt).toLocaleDateString()}</span></div><p className="mt-1 text-xs leading-relaxed text-neutral-300">{review.body}</p>{review.imageUrls.length > 0 && <div className="mt-2 flex gap-2">{review.imageUrls.map((url) => <img key={url} src={url} alt="Customer review" className="h-14 w-14 rounded-lg object-cover" />)}</div>}<button onClick={() => toggleHelpful(review)} className="mt-2 flex items-center gap-1 text-[10px] text-neutral-500 hover:text-pink-400"><ThumbsUp className="h-3 w-3" />Helpful ({review.helpfulCount})</button></article>)}</div>
    </section>
  );
};

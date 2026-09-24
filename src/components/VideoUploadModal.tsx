import React, { useEffect, useState } from 'react';
import { Film, Upload, X } from 'lucide-react';
import { Language, Product } from '../types';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, title: string, tags: string[], product: Product) => Promise<void>;
  products: Product[];
  lang: Language;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose, onSubmit, products, lang }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const product = products.find((item) => item.id === selectedProductId) || products[0];
    if (!file || !title.trim() || !product) {
      setError('Choose a video, add a title, and select a product.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(file, title.trim(), tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean), product);
      setFile(null);
      setTitle('');
      setTagsInput('');
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to publish video.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl border border-neutral-800 bg-neutral-900 p-6 text-white shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-neutral-800 p-2 text-neutral-400 hover:text-white" aria-label="Close upload modal">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-pink-600/20 p-3 text-pink-400"><Film className="h-6 w-6" /></div>
          <div>
            <h2 className="text-lg font-black">Create a video</h2>
            <p className="text-xs text-neutral-400">Share a product moment with the PikPok community.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-700 bg-neutral-950 p-4 text-center hover:border-pink-500">
            {previewUrl ? <video src={previewUrl} className="max-h-48 rounded-xl" controls /> : <><Upload className="mb-2 h-8 w-8 text-pink-400" /><span className="text-sm font-bold">Select a video file</span><span className="mt-1 text-[11px] text-neutral-500">MP4, WebM, or MOV</span></>}
            <input type="file" accept="video/*" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>
          <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Video title" className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-3 text-sm text-white outline-none focus:border-pink-500" />
          <input value={tagsInput} onChange={(event) => setTagsInput(event.target.value)} placeholder="Tags, separated by commas" className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-3 text-sm text-white outline-none focus:border-pink-500" />
          <select value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)} className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-3 text-sm text-white outline-none focus:border-pink-500">
            {products.map((product) => <option key={product.id} value={product.id}>{product.title[lang]}</option>)}
          </select>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 py-3 text-sm font-black disabled:opacity-50">
            <Upload className="h-4 w-4" />{isSubmitting ? 'Publishing...' : 'Publish video'}
          </button>
        </form>
      </div>
    </div>
  );
};

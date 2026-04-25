import React, { useState } from 'react';
import { Star, Loader2, Send } from 'lucide-react';

interface FeedbackFormProps {
  orderId: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ orderId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setIsSuccess(true);
    } catch (error) {
      alert('Error al enviar calificación');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-900/30 text-center">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <Star className="w-6 h-6 fill-current" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-400 mb-1">¡Gracias por tus comentarios!</h3>
        <p className="text-sm text-green-700 dark:text-green-500">Valoramos mucho tu opinión para seguir mejorando.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">¿Cómo calificarías el servicio?</h3>
      
      <div className="flex items-center mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="p-1 focus:outline-none transition-transform hover:scale-110"
          >
            <Star 
              className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} 
            />
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comentarios (Opcional)</label>
        <textarea 
          rows={3} 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3"
          placeholder="¿Qué te pareció el trabajo realizado?"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || rating === 0} 
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
        Enviar Calificación
      </button>
    </form>
  );
};

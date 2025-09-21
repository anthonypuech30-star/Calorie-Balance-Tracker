import React, { useState, useRef } from 'react';
import { getCaloriesFromText, getCaloriesFromImage, CalorieEstimation } from '../services/geminiService';
import { LoadingSpinner } from './icons';

interface CalorieLogFormProps {
  onLog: (description: string, calories: number) => void;
}

const CalorieLogForm: React.FC<CalorieLogFormProps> = ({ onLog }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [confirmationData, setConfirmationData] = useState<CalorieEstimation | null>(null);
  const [editedData, setEditedData] = useState<CalorieEstimation | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setText(''); // Clear text when image is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const resetForm = () => {
    setText('');
    clearImage();
    setConfirmationData(null);
    setEditedData(null);
    setError(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !imageFile) {
      setError("Please enter a description or upload an image.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let result: CalorieEstimation;
      if (imageFile) {
        result = await getCaloriesFromImage(imageFile);
      } else {
        result = await getCaloriesFromText(text);
      }
      setConfirmationData(result);
      setEditedData(result);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedData && editedData.description && editedData.totalCalories > 0) {
      onLog(editedData.description, editedData.totalCalories);
      resetForm();
    } else {
      setError("Description cannot be empty and calories must be greater than zero.");
    }
  };

  const handleCancelEdit = () => {
    setConfirmationData(null);
    setEditedData(null);
    // Do not clear text/image so user can retry
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => prev ? { ...prev, [name]: name === 'totalCalories' ? parseInt(value, 10) || 0 : value } : null);
  };
  
  if (confirmationData && editedData) {
    return (
      <div className="bg-surface p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Confirm Your Meal</h3>
        {error && <p className="text-danger mb-4">{error}</p>}
        {imagePreview && (
          <div className="mb-4">
            <img src={imagePreview} alt="Meal preview" className="w-full h-auto max-h-48 object-cover rounded-md" />
          </div>
        )}
        <div className="mb-4 bg-background p-4 rounded-md border border-border">
            <h4 className="text-md font-semibold text-text-secondary mb-2">AI's Calorie Breakdown:</h4>
            {confirmationData.breakdown.length > 0 ? (
                <ul className="space-y-2 text-sm">
                    {confirmationData.breakdown.map((item, index) => (
                        <li key={index} className="flex justify-between items-center">
                            <span className="text-text-primary">{item.item}</span>
                            <span className="font-mono text-text-secondary">{item.calories.toLocaleString()} kcal</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-text-secondary text-sm italic">No breakdown available.</p>
            )}
        </div>
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description (Editable)</label>
            <textarea
              id="description"
              name="description"
              value={editedData.description}
              onChange={handleEditChange}
              className="w-full p-3 bg-background rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none transition"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="totalCalories" className="block text-sm font-medium text-text-secondary mb-1">Total Calories (kcal - Editable)</label>
            <input
              id="totalCalories"
              name="totalCalories"
              type="number"
              value={editedData.totalCalories}
              onChange={handleEditChange}
              className="w-full p-3 bg-background rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-primary hover:bg-primary-focus text-white font-semibold transition-colors"
            >
              Confirm & Log
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Log Your Meal</h3>
      {error && <p className="text-danger mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={text}
            onChange={(e) => {
                setText(e.target.value);
                if(e.target.value) clearImage();
            }}
            placeholder="e.g., Two slices of pepperoni pizza and a can of coke"
            className="w-full p-3 bg-background rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none transition"
            rows={3}
            disabled={isLoading || !!imageFile}
          />
        </div>
        <div className="text-center my-2 text-text-secondary">OR</div>
        <div className="mb-4">
          {imagePreview ? (
             <div className="relative">
                <img src={imagePreview} alt="Meal preview" className="w-full h-auto max-h-60 object-cover rounded-md" />
                <button 
                  type="button" 
                  onClick={clearImage}
                  disabled={isLoading}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition"
                >
                    &times;
                </button>
             </div>
          ) : (
            <label className="flex justify-center items-center w-full px-4 py-6 bg-background rounded-md border-2 border-dashed border-border cursor-pointer hover:border-primary transition">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-text-secondary" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="mt-2 block text-sm font-medium text-text-secondary">Upload a photo of your meal</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isLoading} />
            </label>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingSpinner className="w-6 h-6" /> : 'Estimate Calories'}
        </button>
      </form>
    </div>
  );
};

export default CalorieLogForm;
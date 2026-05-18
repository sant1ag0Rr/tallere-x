import React, { useState, useEffect } from 'react';
import type { InventoryItem } from '@/domain/models';
import { getInventoryUseCase } from '@/application/useCases/getInventory';
import { Package, Plus } from 'lucide-react';

interface PartsSelectorProps {
  onAddPart: (item: InventoryItem, quantity: number) => void;
}

export const PartsSelector: React.FC<PartsSelectorProps> = ({ onAddPart }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const items = await getInventoryUseCase();
        setInventory(items);
        if (items.length > 0) setSelectedItemId(items[0].id);
      } catch (error) {
        console.error("Error fetching inventory", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleAdd = () => {
    const item = inventory.find(i => i.id === selectedItemId);
    if (item && quantity > 0) {
      if (quantity > (item.stock || 0)) {
        alert('No hay suficiente stock');
        return;
      }
      onAddPart(item, quantity);
      setQuantity(1);
    }
  };

  if (loading) return <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>;

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Repuesto</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {inventory.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.stock || 0} disp.)
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-24">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cant.</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button
        onClick={handleAdd}
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors"
      >
        <Plus className="w-4 h-4 mr-1" />
        Añadir
      </button>
    </div>
  );
};

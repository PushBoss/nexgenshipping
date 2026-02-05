import { ChevronRight, Package } from 'lucide-react';
import { useState } from 'react';

export interface SubCategory {
  name: string;
  id: string;
}

export interface Category {
  name: string;
  id: string;
  subcategories?: SubCategory[];
}

export interface ProductCategory {
  name: string;
  id: string;
  categories: Category[];
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    name: 'Pharmaceutical Products',
    id: 'pharmaceutical',
    categories: [
      { name: 'Cold, Cough, Allergy & Sinus', id: 'cold-cough-allergy-sinus' },
      { name: 'Rubs & Ointments', id: 'rubs-ointments' },
      { name: 'Medicine', id: 'medicine' },
      { name: 'Eye Care', id: 'eye-care' },
      { name: 'First Aid', id: 'first-aid' },
      { name: 'Condom & Accessories', id: 'condom-accessories' },
      { name: 'Energy Tabs & Vitamins', id: 'energy-tabs-vitamins' },
      { name: 'Dental Care', id: 'dental-care' },
      { name: 'Feminine Care', id: 'feminine-care' },
      { name: 'Pest Control & Repellant', id: 'pest-control-repellant' },
      { name: 'Stomach Meds', id: 'stomach-meds' },
      { name: 'OTC Medicines', id: 'otc-medicines' },
      { name: 'Lip Care', id: 'lip-care' },
    ],
  },
  {
    name: 'Baby Products',
    id: 'baby',
    categories: [
      { name: 'Apparel', id: 'apparel' },
      { name: 'Accessories', id: 'accessories' },
    ],
  },
];

interface CategoryBrowserProps {
  onCategorySelect: (categoryId: string, subcategoryId?: string) => void;
  onClose: () => void;
}

export function CategoryBrowser({ onCategorySelect, onClose }: CategoryBrowserProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="bg-[#003366] text-white p-4 rounded-t-lg">
        <h2 className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Shop by Category
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        {PRODUCT_CATEGORIES.map((productCategory) => (
          <div key={productCategory.id} className="space-y-3">
            <h3 className="text-[#003366] pb-2 border-b border-gray-200">
              {productCategory.name}
            </h3>
            <div className="space-y-2">
              {productCategory.categories.map((category) => (
                <div key={category.id}>
                  {category.subcategories ? (
                    <>
                      <button
                        onClick={() => {
                          if (expandedCategory === category.id) {
                            setExpandedCategory(null);
                            setExpandedSubcategory(null);
                          } else {
                            setExpandedCategory(category.id);
                            setExpandedSubcategory(null);
                          }
                        }}
                        className="w-full flex items-center justify-between text-left px-3 py-2 rounded hover:bg-blue-50 transition-colors group"
                      >
                        <span className="text-sm text-gray-700 group-hover:text-[#0055AA]">
                          {category.name}
                        </span>
                        <ChevronRight
                          className={`h-4 w-4 text-gray-400 transition-transform ${expandedCategory === category.id ? 'rotate-90' : ''
                            }`}
                        />
                      </button>
                      {expandedCategory === category.id && (
                        <div className="ml-4 mt-1 space-y-1">
                          {category.subcategories.map((subcategory) => (
                            <button
                              key={subcategory.id}
                              onClick={() => {
                                onCategorySelect(category.id, subcategory.id);
                                onClose();
                              }}
                              className="w-full text-left px-3 py-1.5 rounded hover:bg-blue-50 transition-colors text-sm text-gray-600 hover:text-[#0055AA]"
                            >
                              {subcategory.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        onCategorySelect(category.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between text-left px-3 py-2 rounded hover:bg-blue-50 transition-colors group"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-[#0055AA]">
                        {category.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={onClose}
          className="w-full bg-[#003366] hover:bg-[#0055AA] text-white py-2 rounded transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
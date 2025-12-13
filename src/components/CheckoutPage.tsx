import { useState, useEffect } from 'react';
import { CreditCard, Lock, MapPin, User, Package, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from './ProductCard';
import { toast } from 'sonner';
import { Currency, convertCurrency, formatCurrency } from '../utils/currencyService';
import { isDimePayConfigured } from '../utils/dimepayService';
import { DimePayPaymentForm } from './DimePayPaymentForm';

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  onNavigate: (page: 'home' | 'cart') => void;
  onOrderComplete: () => void;
  selectedCurrency?: Currency;
}

export function CheckoutPage({ cartItems, onNavigate, onOrderComplete, selectedCurrency = 'USD' }: CheckoutPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [dimePayConfigured, setDimePayConfigured] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Removed paymentInfo state as Stripe handles this

  // Calculate totals in selected currency
  const subtotal = cartItems.reduce((sum, item) => {
    const itemCurrency = item.currency || 'USD';
    const convertedPrice = convertCurrency(item.price, itemCurrency, selectedCurrency);
    return sum + convertedPrice * item.quantity;
  }, 0);
  const tax = subtotal * 0.08;
  const shippingThreshold = convertCurrency(50, 'USD', selectedCurrency);
  const shippingBase = convertCurrency(9.99, 'USD', selectedCurrency);
  const shippingExpress = convertCurrency(19.99, 'USD', selectedCurrency);
  const shippingOvernight = convertCurrency(39.99, 'USD', selectedCurrency);
  const shippingCost = shippingMethod === 'express' 
    ? shippingExpress 
    : shippingMethod === 'overnight' 
      ? shippingOvernight 
      : subtotal > shippingThreshold ? 0 : shippingBase;
  const total = subtotal + tax + shippingCost;

  // Check if DimePay is configured
  useEffect(() => {
    const checkConfiguration = async () => {
      const configured = await isDimePayConfigured();
      setDimePayConfigured(configured);
    };
    checkConfiguration();
  }, []);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(shippingInfo).every(val => val.trim())) {
      if (!dimePayConfigured) {
        toast.error('Payment gateway not configured. Please configure DimePay in admin settings.');
        return;
      }
      setCurrentStep(2);
      toast.success('Shipping information saved');
    } else {
      toast.error('Please fill in all shipping fields');
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep(3);
    toast.success('Payment confirmed!');
  };

  const handlePlaceOrder = () => {
    toast.success('Order placed successfully! Thank you for your purchase.');
    setTimeout(() => {
      onOrderComplete();
      onNavigate('home');
    }, 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('cart')}
          className="flex items-center gap-2 text-[#003366] hover:text-[#0055AA] mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cart</span>
        </button>
        <h1 className="text-[#003366]">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              currentStep >= 1 ? 'bg-[#003366] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xs md:text-sm text-center">Shipping</span>
          </div>
          <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-[#003366]' : 'bg-gray-200'}`} />
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              currentStep >= 2 ? 'bg-[#003366] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-xs md:text-sm text-center">Payment</span>
          </div>
          <div className={`flex-1 h-1 ${currentStep >= 3 ? 'bg-[#003366]' : 'bg-gray-200'}`} />
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              currentStep >= 3 ? 'bg-[#003366] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xs md:text-sm text-center">Review</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-[#003366] mb-6">Shipping Information</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    placeholder="123 Main St, Apt 4B"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      placeholder="NY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-[#003366] mb-4">Shipping Method</h3>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="flex items-center justify-between p-4 border rounded-lg mb-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="cursor-pointer">
                          <div>
                            <p className="font-semibold">Standard Shipping</p>
                            <p className="text-sm text-gray-500">5-7 business days</p>
                          </div>
                        </Label>
                      </div>
                      <span className="font-semibold">
                        {subtotal > shippingThreshold ? 'FREE' : formatCurrency(shippingBase, selectedCurrency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg mb-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          <div>
                            <p className="font-semibold">Express Shipping</p>
                            <p className="text-sm text-gray-500">2-3 business days</p>
                          </div>
                        </Label>
                      </div>
                      <span className="font-semibold">$19.99</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="overnight" id="overnight" />
                        <Label htmlFor="overnight" className="cursor-pointer">
                          <div>
                            <p className="font-semibold">Overnight Shipping</p>
                            <p className="text-sm text-gray-500">Next business day</p>
                          </div>
                        </Label>
                      </div>
                      <span className="font-semibold">$39.99</span>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full bg-[#003366] hover:bg-[#0055AA] text-white">
                  Continue to Payment
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              {!dimePayConfigured ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">DimePay Not Configured</p>
                      <p>To accept payments, you need to:</p>
                      <ol className="list-decimal ml-4 mt-2 space-y-1">
                        <li>Go to Admin Dashboard → Payment Settings</li>
                        <li>Enter your DimePay Merchant ID, Secret Key, and Client Key</li>
                        <li>Select environment (Sandbox for testing, Production for live)</li>
                        <li>Choose fee handling (Merchant absorbs or Customer pays)</li>
                        <li>Enable the payment gateway</li>
                      </ol>
                    </div>
                  </div>
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Shipping
                  </Button>
                </div>
              ) : (
                <DimePayPaymentForm
                  amount={total}
                  currency={selectedCurrency}
                  customerEmail={shippingInfo.email}
                  customerName={shippingInfo.fullName}
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setCurrentStep(1)}
                  orderId={`order-${Date.now()}`}
                />
              )}
            </div>
          )}

          {/* Step 3: Review Order */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Shipping Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[#003366]">Shipping Details</h2>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-[#0055AA] hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">{shippingInfo.fullName}</p>
                  <p>{shippingInfo.email}</p>
                  <p>{shippingInfo.phone}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                  <p className="text-gray-600 pt-2">
                    Shipping: {shippingMethod === 'standard' ? 'Standard' : shippingMethod === 'express' ? 'Express' : 'Overnight'}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[#003366]">Payment Method</h2>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-sm text-[#0055AA] hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="h-8 w-8 text-green-600" />
                  <div className="text-sm">
                    <p className="font-semibold">DimePay Payment</p>
                    <p className="text-gray-600">Payment confirmed and secured by DimePay</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-[#003366] mb-4">Order Items</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm line-clamp-2">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(
                            convertCurrency(item.price, item.currency || 'USD', selectedCurrency) * item.quantity,
                            selectedCurrency
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold"
                >
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-[#003366] mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span>Items ({cartItems.length}):</span>
                <span>{formatCurrency(subtotal, selectedCurrency)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    formatCurrency(shippingCost, selectedCurrency)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>{formatCurrency(tax, selectedCurrency)}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold">Order Total:</span>
                <span className="text-xl font-bold text-[#DC143C]">
                  {formatCurrency(total, selectedCurrency)}
                </span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
              <div className="flex items-start gap-2">
                <div className="text-green-600 mt-0.5">✓</div>
                <p>Your order qualifies for secure checkout and buyer protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

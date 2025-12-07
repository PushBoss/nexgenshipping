import { User, Mail, Phone, MapPin, Shield, CreditCard, Bell, Package, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { useState } from 'react';

interface AccountPageProps {
  onNavigateToOrders: () => void;
  onNavigateToWishlist: () => void;
  isAdmin?: boolean;
  onNavigateToAdmin?: () => void;
}

export function AccountPage({ onNavigateToOrders, onNavigateToWishlist, isAdmin, onNavigateToAdmin }: AccountPageProps) {
  const [accountInfo, setAccountInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
  });

  const [shippingAddress, setShippingAddress] = useState({
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    smsAlerts: true,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Address updated successfully!');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Notification preferences updated successfully!');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-[#003366] mb-2">Your Account</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Quick Actions Sidebar */}
        <div className="md:col-span-1">
          <Card className="p-4">
            <h3 className="text-[#003366] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={onNavigateToOrders}
                variant="outline"
                className="w-full justify-start"
              >
                <Package className="h-4 w-4 mr-2" />
                Your Orders
              </Button>
              <Button
                onClick={onNavigateToWishlist}
                variant="outline"
                className="w-full justify-start"
              >
                <Package className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
              {isAdmin && (
                <Button
                  onClick={onNavigateToAdmin}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              )}
            </div>
          </Card>

          {/* Account Summary */}
          <Card className="p-4 mt-4">
            <h3 className="text-[#003366] mb-4">Account Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-900">Jan 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="text-gray-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Wishlist Items</span>
                <span className="text-gray-900">5</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#003366] w-12 h-12 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[#003366]">Personal Information</h2>
                    <p className="text-sm text-gray-600">Update your personal details</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={accountInfo.firstName}
                        onChange={(e) => setAccountInfo({ ...accountInfo, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={accountInfo.lastName}
                        onChange={(e) => setAccountInfo({ ...accountInfo, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={accountInfo.email}
                        onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={accountInfo.phone}
                        onChange={(e) => setAccountInfo({ ...accountInfo, phone: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#003366] w-12 h-12 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[#003366]">Shipping Address</h2>
                    <p className="text-sm text-gray-600">Manage your default shipping address</p>
                  </div>
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900"
                    >
                      Save Address
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#003366] w-12 h-12 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[#003366]">Security Settings</h2>
                    <p className="text-sm text-gray-600">Manage your password and security options</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-gray-900 mb-2">Change Password</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      It's a good idea to use a strong password that you're not using elsewhere
                    </p>
                    <Button variant="outline">Update Password</Button>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-gray-900 mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="text-gray-900 mb-2">Payment Methods</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage your saved payment methods
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-3">
                      <CreditCard className="h-6 w-6 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm">Visa ending in 4242</p>
                        <p className="text-xs text-gray-500">Expires 12/2026</p>
                      </div>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>

                  <div>
                    <h3 className="text-gray-900 mb-2">Active Sessions</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage devices where you're currently signed in
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-900">Chrome on Windows</p>
                          <p className="text-xs text-gray-500">New York, USA • Active now</p>
                        </div>
                        <span className="text-xs text-green-600">Current</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#003366] w-12 h-12 rounded-full flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[#003366]">Notification Preferences</h2>
                    <p className="text-sm text-gray-600">Choose how you want to hear from us</p>
                  </div>
                </div>

                <form onSubmit={handleSaveNotifications} className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">Order Updates</h3>
                      <p className="text-sm text-gray-600">
                        Get notifications about your order status and delivery
                      </p>
                    </div>
                    <Switch
                      checked={notifications.orderUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, orderUpdates: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">Promotions & Offers</h3>
                      <p className="text-sm text-gray-600">
                        Receive emails about special deals and promotions
                      </p>
                    </div>
                    <Switch
                      checked={notifications.promotions}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, promotions: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">Newsletter</h3>
                      <p className="text-sm text-gray-600">
                        Get our weekly newsletter with tips and product updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newsletter}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newsletter: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">SMS Alerts</h3>
                      <p className="text-sm text-gray-600">
                        Receive text messages for important account updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, smsAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
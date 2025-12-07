import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'delivered' | 'in-transit' | 'processing' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface OrdersPageProps {
  onProductClick: (productId: string) => void;
}

export function OrdersPage({ onProductClick }: OrdersPageProps) {
  // Mock orders data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'NG-2025-001234',
      date: 'October 15, 2025',
      status: 'delivered',
      total: 156.78,
      trackingNumber: 'TRK123456789',
      items: [
        {
          id: 'baby-1',
          name: 'Premium Baby Diapers - Size 3',
          quantity: 2,
          price: 45.99,
          image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
        },
        {
          id: 'pharma-1',
          name: 'Multivitamin Supplement',
          quantity: 1,
          price: 34.99,
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        },
      ],
    },
    {
      id: '2',
      orderNumber: 'NG-2025-001189',
      date: 'October 10, 2025',
      status: 'in-transit',
      total: 89.99,
      trackingNumber: 'TRK987654321',
      estimatedDelivery: 'October 20, 2025',
      items: [
        {
          id: 'baby-2',
          name: 'Baby Bottle Set',
          quantity: 1,
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1587070021185-c64c5d3d1b71?w=400',
        },
      ],
    },
    {
      id: '3',
      orderNumber: 'NG-2025-000987',
      date: 'October 5, 2025',
      status: 'processing',
      total: 234.50,
      estimatedDelivery: 'October 22, 2025',
      items: [
        {
          id: 'pharma-2',
          name: 'Pain Relief Medication',
          quantity: 3,
          price: 78.17,
          image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
        },
      ],
    },
  ];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-transit':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'cancelled':
        return <Package className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      delivered: 'bg-green-100 text-green-800 border-green-200',
      'in-transit': 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-orange-100 text-orange-800 border-orange-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels = {
      delivered: 'Delivered',
      'in-transit': 'In Transit',
      processing: 'Processing',
      cancelled: 'Cancelled',
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {labels[status]}
      </Badge>
    );
  };

  const allOrders = orders;
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedOrders = orders.filter(o => o.status === 'delivered');

  const renderOrders = (orderList: Order[]) => {
    if (orderList.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No orders found</p>
          <p className="text-sm text-gray-500">Your orders will appear here</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orderList.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4 pb-4 border-b">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[#003366]">Order {order.orderNumber}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  {getStatusIcon(order.status)}
                  <span>Placed on {order.date}</span>
                </div>
                {order.trackingNumber && (
                  <p className="text-sm text-gray-600">
                    Tracking: <span className="text-[#003366] font-mono">{order.trackingNumber}</span>
                  </p>
                )}
                {order.estimatedDelivery && order.status !== 'delivered' && (
                  <p className="text-sm text-gray-600">
                    Estimated Delivery: <span className="text-[#003366]">{order.estimatedDelivery}</span>
                  </p>
                )}
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl text-[#DC143C]">${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div 
                    className="w-20 h-20 bg-gray-100 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                    onClick={() => onProductClick(item.id)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="text-gray-900 mb-1 cursor-pointer hover:text-[#003366] transition-colors line-clamp-2"
                      onClick={() => onProductClick(item.id)}
                    >
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
              {order.status === 'in-transit' && (
                <Button variant="outline" className="flex-1">
                  Track Package
                </Button>
              )}
              {order.status === 'delivered' && (
                <>
                  <Button variant="outline" className="flex-1">
                    Buy Again
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Leave Review
                  </Button>
                </>
              )}
              <Button variant="outline" className="flex-1">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-[#003366] mb-2">Your Orders</h1>
        <p className="text-gray-600">View and track your orders</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-6">
          <TabsTrigger value="all">All Orders ({allOrders.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderOrders(allOrders)}
        </TabsContent>

        <TabsContent value="active">
          {renderOrders(activeOrders)}
        </TabsContent>

        <TabsContent value="completed">
          {renderOrders(completedOrders)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Shield, Truck, Award, Heart, Users, Globe } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#003366] to-[#0055AA] text-white rounded-lg shadow-lg p-6 md:p-12 mb-8">
        <div className="max-w-3xl">
          <h1 className="mb-4 md:mb-6">About Nex-Gen Shipping Agency</h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
            An innovative online-based distribution company built on over 20 years of collective experience 
            in the logistics and distribution industry. We're your trusted partner for OTC pharmaceuticals, 
            vitamins, baby products, and essential lifestyle items.
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-[#DC143C] hover:shadow-md transition-shadow">
          <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-[#DC143C]" />
          </div>
          <h3 className="text-[#003366] mb-3">Integrity</h3>
          <p className="text-gray-600">
            We operate with transparency and honesty in every transaction, ensuring you can trust 
            every product and service we provide.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-[#FF9900] hover:shadow-md transition-shadow">
          <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Truck className="h-6 w-6 text-[#FF9900]" />
          </div>
          <h3 className="text-[#003366] mb-3">Reliability</h3>
          <p className="text-gray-600">
            Timely delivery and consistent service are at the heart of our operations. 
            We ensure your products arrive when you need them.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-[#003366] hover:shadow-md transition-shadow">
          <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Award className="h-6 w-6 text-[#003366]" />
          </div>
          <h3 className="text-[#003366] mb-3">Quality Assurance</h3>
          <p className="text-gray-600">
            Only the best and most trusted brands make it to our inventory. Every product meets 
            regulatory standards and quality expectations.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-[#003366] mb-4">Our Story</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Established in 2024, Nex-Gen Shipping Agency is built on over 20 years of collective 
              experience in the logistics and distribution industry. Headquartered in Florida, United States, 
              we have rapidly positioned ourselves as a trusted name in the e-commerce and OTC pharmaceutical 
              supply chain.
            </p>
            <p>
              We specialize in the distribution and online sale of Over-the-Counter (OTC) medicines, vitamins, 
              baby clothes, and accessories, ensuring fast, reliable, and secure delivery to customers across 
              the country and beyond.
            </p>
            <p>
              Our commitment to quality products, efficient logistics, and exceptional customer service sets 
              us apart as a modern leader in the digital marketplace. We serve retail pharmacies, individual 
              consumers, and online shoppers worldwide.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-[#003366] mb-6">Our Mission & Vision</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-[#DC143C] mb-2">Mission</h3>
              <p className="text-sm text-gray-700">
                To provide accessible, affordable, and reliable distribution of everyday health and 
                lifestyle products through seamless online shopping and efficient delivery solutions.
              </p>
            </div>
            <div>
              <h3 className="text-[#003366] mb-2">Vision</h3>
              <p className="text-sm text-gray-700">
                To become the Caribbean's most trusted and innovative online distributor of pharmaceutical, 
                baby and lifestyle products, connecting households and retailers to essential goods with 
                speed and care.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products & Services */}
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-12">
        <h2 className="text-[#003366] mb-6 text-center">Our Products & Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-[#DC143C]" />
            </div>
            <h3 className="text-[#003366] mb-2">OTC Medicines & Vitamins</h3>
            <p className="text-gray-600 text-sm">
              Safe, reliable, and approved medications and supplements for everyday wellness
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-[#FF9900]" />
            </div>
            <h3 className="text-[#003366] mb-2">Baby Products</h3>
            <p className="text-gray-600 text-sm">
              Comfortable, high-quality baby apparel and accessories to support parents and infants
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-[#003366]" />
            </div>
            <h3 className="text-[#003366] mb-2">Worldwide Delivery</h3>
            <p className="text-gray-600 text-sm">
              Efficient worldwide shipping with 24/7 online ordering and dedicated customer support
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-lg p-6 md:p-8 mb-12">
        <h3 className="text-[#003366] mb-6 text-center">Our Core Values</h3>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-[#DC143C] mb-2">Customer Focus</h4>
            <p className="text-sm text-gray-700">
              Our customers' needs guide every decision we make. Your satisfaction is our priority.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-[#003366] mb-2">Innovation</h4>
            <p className="text-sm text-gray-700">
              We embrace technology to improve efficiency and enhance the online shopping experience.
            </p>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 text-center">
        <h3 className="text-[#003366] mb-4">Experience & Expertise</h3>
        <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
          With over two decades of experience in distribution and logistics, Nex-Gen Shipping Agency's 
          team brings deep industry knowledge, strong supplier relationships, and a proven record of 
          excellence. Our background in pharmaceutical distribution ensures that every product meets 
          regulatory standards and reaches customers in perfect condition.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span className="bg-blue-50 px-4 py-2 rounded-full">20+ Years Experience</span>
          <span className="bg-red-50 px-4 py-2 rounded-full">Florida Headquarters</span>
          <span className="bg-orange-50 px-4 py-2 rounded-full">Worldwide Shipping</span>
          <span className="bg-blue-50 px-4 py-2 rounded-full">Quality Assured</span>
        </div>
      </div>
    </div>
  );
}

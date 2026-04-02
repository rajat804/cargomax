"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Download,
  MapPin,
  Calendar,
  DollarSign,
  Weight,
  Box,
  Phone,
  Mail,
  User,
  AlertTriangle,
  Thermometer,
  Shield,
  PenSquare,
} from "lucide-react";
import { format } from "date-fns";

const API_URL = process.env.NEXT_PUBLIC_BASE_URI || "http://localhost:4000";

interface Shipment {
  _id: string;
  trackingId: string;
  shipmentType: string;
  priority: string;
  pickupDate: string;
  deliveryDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  estimatedCost: number;
  totalWeight: number;
  totalValue: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
  specialInstructions?: string;
  insuranceRequired: boolean;
  signatureRequired: boolean;
  temperatureControlled: boolean;
  fragile: boolean;
  carrier: string;
  service: string;
  originAddress: {
    company: string;
    contactName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
  };
  destinationAddress: {
    company: string;
    contactName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    value: number;
    category: string;
    hazardous: boolean;
  }>;
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch all shipments
  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/createshipments/all`);
      const data = await response.json();

      if (data.success) {
        setShipments(data.data);
        setFilteredShipments(data.data);
      } else {
        console.error("Failed to fetch shipments:", data.message);
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Search and filter
  useEffect(() => {
    let filtered = shipments;

    if (searchTerm) {
      filtered = filtered.filter(
        (shipment) =>
          shipment.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((shipment) => shipment.status === statusFilter);
    }

    setFilteredShipments(filtered);
  }, [searchTerm, statusFilter, shipments]);

  // Delete shipment
  const deleteShipment = async (id: string) => {
    if (confirm("Are you sure you want to delete this shipment?")) {
      try {
        const response = await fetch(`${API_URL}/api/createshipments/delete/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          alert("✅ Shipment deleted successfully!");
          fetchShipments();
        } else {
          alert("❌ Failed to delete shipment: " + data.message);
        }
      } catch (error) {
        console.error("Error deleting shipment:", error);
        alert("❌ Network error! Failed to delete shipment.");
      }
    }
  };

  // Calculate total cost breakdown
  const calculateTotalCost = (shipment: Shipment) => {
    const baseShipping = 15;
    const weightCharge = (shipment.totalWeight || 0) * 2.5;
    let priorityCharge = 0;
    if (shipment.priority === "express") priorityCharge = 14.99;
    if (shipment.priority === "overnight") priorityCharge = 34.99;
    
    const insuranceCharge = shipment.insuranceRequired ? (shipment.totalValue || 0) * 0.01 : 0;
    const signatureCharge = shipment.signatureRequired ? 5 : 0;
    const temperatureCharge = shipment.temperatureControlled ? 25 : 0;
    const fragileCharge = shipment.fragile ? 10 : 0;
    
    const total = baseShipping + weightCharge + priorityCharge + insuranceCharge + 
                  signatureCharge + temperatureCharge + fragileCharge;
    
    return {
      baseShipping,
      weightCharge,
      priorityCharge,
      insuranceCharge,
      signatureCharge,
      temperatureCharge,
      fragileCharge,
      total
    };
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 text-white">⏳ Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500 text-white">✅ Confirmed</Badge>;
      case "in_transit":
        return <Badge className="bg-purple-500 text-white">🚚 In Transit</Badge>;
      case "delivered":
        return <Badge className="bg-green-500 text-white">📦 Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 text-white">❌ Cancelled</Badge>;
      case "draft":
        return <Badge className="bg-gray-500 text-white">📝 Draft</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "express":
        return <Badge className="bg-red-100 text-red-700 border border-red-200">🚀 Express</Badge>;
      case "overnight":
        return <Badge className="bg-orange-100 text-orange-700 border border-orange-200">🌙 Overnight</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-700 border border-blue-200">📦 Standard</Badge>;
    }
  };

  const stats = {
    total: shipments.length,
    pending: shipments.filter((s) => s.status === "pending").length,
    inTransit: shipments.filter((s) => s.status === "in_transit").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">📦 All Shipments</h1>
              <p className="text-blue-200 mt-1">Manage and track all your shipments</p>
            </div>
            <Button
              onClick={fetchShipments}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Shipments</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Pending</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">In Transit</p>
                  <p className="text-3xl font-bold">{stats.inTransit}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Delivered</p>
                  <p className="text-3xl font-bold">{stats.delivered}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by Tracking ID, Customer Name or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="draft">Draft</option>
              </select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shipments Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading shipments...</p>
                </div>
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No shipments found</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Tracking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>From → To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.map((shipment) => (
                      <TableRow key={shipment._id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm font-medium">
                          {shipment.trackingId}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{shipment.customerName}</p>
                            <p className="text-xs text-gray-500">{shipment.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{shipment.shipmentType}</TableCell>
                        <TableCell>{getPriorityBadge(shipment.priority)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{shipment.originAddress?.city || "N/A"}</p>
                            <p className="text-gray-400 text-xs">→</p>
                            <p>{shipment.destinationAddress?.city || "N/A"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-600">${shipment.estimatedCost?.toFixed(2)}</span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(shipment.createdAt), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedShipment(shipment);
                                setShowDetailsModal(true);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteShipment(shipment._id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Complete Details Modal */}
      {showDetailsModal && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl w-[900px] max-h-[90vh] overflow-y-auto shadow-2xl mx-4">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Shipment Details</h2>
                  <p className="text-blue-200 text-sm">Tracking ID: {selectedShipment.trackingId}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Priority Row */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    {getStatusBadge(selectedShipment.status)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Priority</p>
                    {getPriorityBadge(selectedShipment.priority)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Shipment Type</p>
                    <Badge variant="outline" className="capitalize">{selectedShipment.shipmentType}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Created On</p>
                  <p className="text-sm font-medium">{format(new Date(selectedShipment.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{selectedShipment.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {selectedShipment.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedShipment.customerPhone}</p>
                  </div>
                </div>
              </div>

              {/* Origin & Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Origin Address */}
                <div className="border rounded-lg p-4 bg-blue-50/30">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Origin Address
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Company:</span> {selectedShipment.originAddress?.company}</p>
                    <p><span className="font-medium">Contact:</span> {selectedShipment.originAddress?.contactName}</p>
                    <p><span className="font-medium">Address:</span> {selectedShipment.originAddress?.address1}</p>
                    {selectedShipment.originAddress?.address2 && <p>{selectedShipment.originAddress.address2}</p>}
                    <p><span className="font-medium">City:</span> {selectedShipment.originAddress?.city}</p>
                    <p><span className="font-medium">State/ZIP:</span> {selectedShipment.originAddress?.state} - {selectedShipment.originAddress?.zipCode}</p>
                    <p><span className="font-medium">Phone:</span> {selectedShipment.originAddress?.phone}</p>
                    <p><span className="font-medium">Email:</span> {selectedShipment.originAddress?.email}</p>
                  </div>
                </div>

                {/* Destination Address */}
                <div className="border rounded-lg p-4 bg-purple-50/30">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-600" />
                    Destination Address
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Company:</span> {selectedShipment.destinationAddress?.company}</p>
                    <p><span className="font-medium">Contact:</span> {selectedShipment.destinationAddress?.contactName}</p>
                    <p><span className="font-medium">Address:</span> {selectedShipment.destinationAddress?.address1}</p>
                    {selectedShipment.destinationAddress?.address2 && <p>{selectedShipment.destinationAddress.address2}</p>}
                    <p><span className="font-medium">City:</span> {selectedShipment.destinationAddress?.city}</p>
                    <p><span className="font-medium">State/ZIP:</span> {selectedShipment.destinationAddress?.state} - {selectedShipment.destinationAddress?.zipCode}</p>
                    <p><span className="font-medium">Phone:</span> {selectedShipment.destinationAddress?.phone}</p>
                    <p><span className="font-medium">Email:</span> {selectedShipment.destinationAddress?.email}</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    Pickup Date
                  </h3>
                  <p>{format(new Date(selectedShipment.pickupDate), "dd MMM yyyy")}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Delivery Date
                  </h3>
                  <p>{selectedShipment.deliveryDate ? format(new Date(selectedShipment.deliveryDate), "dd MMM yyyy") : "Not specified"}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Box className="h-5 w-5 text-purple-600" />
                  Items ({selectedShipment.totalItems})
                </h3>
                <div className="space-y-3">
                  {selectedShipment.items?.map((item, index) => (
                    <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Description</p>
                          <p className="font-medium">{item.description}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p>{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Weight</p>
                          <p>{item.weight} lbs</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Value</p>
                          <p>${item.value}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Category</p>
                          <p className="capitalize">{item.category}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Dimensions</p>
                          <p>{item.dimensions?.length}×{item.dimensions?.width}×{item.dimensions?.height} in</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Hazardous</p>
                          {item.hazardous ? <Badge className="bg-red-100 text-red-700">⚠️ Hazardous Material</Badge> : <Badge variant="outline">Not Hazardous</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Services */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Special Services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedShipment.insuranceRequired && (
                    <Badge className="bg-green-100 text-green-700">✅ Insurance Coverage</Badge>
                  )}
                  {selectedShipment.signatureRequired && (
                    <Badge className="bg-blue-100 text-blue-700">✍️ Signature Required</Badge>
                  )}
                  {selectedShipment.temperatureControlled && (
                    <Badge className="bg-cyan-100 text-cyan-700">🌡️ Temperature Controlled</Badge>
                  )}
                  {selectedShipment.fragile && (
                    <Badge className="bg-yellow-100 text-yellow-700">📦 Fragile Handling</Badge>
                  )}
                  {!selectedShipment.insuranceRequired && !selectedShipment.signatureRequired && 
                   !selectedShipment.temperatureControlled && !selectedShipment.fragile && (
                    <span className="text-gray-500">No special services selected</span>
                  )}
                </div>
                {selectedShipment.carrier && (
                  <div className="mt-3 pt-3 border-t">
                    <p><span className="font-medium">Carrier:</span> {selectedShipment.carrier?.toUpperCase()}</p>
                    <p><span className="font-medium">Service Level:</span> {selectedShipment.service}</p>
                  </div>
                )}
                {selectedShipment.specialInstructions && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="font-medium">Special Instructions:</p>
                    <p className="text-sm text-gray-600">{selectedShipment.specialInstructions}</p>
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Cost Breakdown
                </h3>
                {(() => {
                  const costs = calculateTotalCost(selectedShipment);
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Base Shipping:</span>
                        <span>${costs.baseShipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Weight Charge ({selectedShipment.totalWeight} lbs × $2.50):</span>
                        <span>${costs.weightCharge.toFixed(2)}</span>
                      </div>
                      {costs.priorityCharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>{selectedShipment.priority === "express" ? "Express Service:" : "Overnight Service:"}</span>
                          <span>${costs.priorityCharge.toFixed(2)}</span>
                        </div>
                      )}
                      {costs.insuranceCharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Insurance ({selectedShipment.totalValue} × 1%):</span>
                          <span>${costs.insuranceCharge.toFixed(2)}</span>
                        </div>
                      )}
                      {costs.signatureCharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Signature Service:</span>
                          <span>${costs.signatureCharge.toFixed(2)}</span>
                        </div>
                      )}
                      {costs.temperatureCharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Temperature Control:</span>
                          <span>${costs.temperatureCharge.toFixed(2)}</span>
                        </div>
                      )}
                      {costs.fragileCharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Fragile Handling:</span>
                          <span>${costs.fragileCharge.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total Estimated Cost:</span>
                          <span className="text-green-600">${costs.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Weight className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Total Weight</p>
                  <p className="font-bold">{selectedShipment.totalWeight?.toFixed(2)} lbs</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Total Value</p>
                  <p className="font-bold">${selectedShipment.totalValue?.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Box className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Total Items</p>
                  <p className="font-bold">{selectedShipment.totalItems}</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Truck className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Estimated Cost</p>
                  <p className="font-bold text-green-600">${selectedShipment.estimatedCost?.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 rounded-b-xl bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Shipment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
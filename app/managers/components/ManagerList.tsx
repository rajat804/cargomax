// app/managers/components/ManagerList.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI || "http://localhost:4000";

export default function ManagerList() {
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URI}/api/managers`)
      .then((res) => setManagers(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Mask Phone (show last 5 digits)
  const maskPhone = (phone: string | undefined): string => {
    if (!phone) return "N/A";
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 5) return phone;
    return `xx-xx-${cleaned.slice(-5)}`;
  };

  // Mask Email
  const maskEmail = (email: string | undefined): string => {
    if (!email) return "N/A";
    const [username, domain] = email.split("@");
    if (!username || username.length <= 3) return email;
    return `${username.slice(0, 3)}...@${domain}`;
  };

  const handleEdit = (manager: any) => {
    console.log("Edit Manager:", manager);
    toast({ title: "Edit feature coming soon" });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete manager "${name}"?`)) return;

    try {
      await axios.delete(`${BASE_URI}/api/managers/${id}`);
      setManagers(managers.filter((m) => m._id !== id));
      toast({ title: "Manager deleted successfully" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete manager" });
    }
  };

  if (loading) return <p className="text-center py-10">Loading managers...</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {managers.map((manager) => (
        <Card key={manager._id} className="relative">
          <CardContent className="p-6">
            {/* 3 Dots Menu */}
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(manager)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Manager
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleDelete(manager._id, manager.name)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Manager
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="text-xl font-semibold">{manager.name}</h3>
            <p className="text-sm text-muted-foreground">{manager.position}</p>

            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Email:</strong> {maskEmail(manager.email)}</p>
              <p><strong>Phone:</strong> {maskPhone(manager.phone)}</p>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">Warehouse</p>
              <p className="font-medium">{manager.warehouse?.name || "Not Assigned"}</p>
            </div>

            <Badge 
              className="mt-4" 
              variant={manager.status === "active" ? "default" : "secondary"}
            >
              {manager.status?.toUpperCase() || "ACTIVE"}
            </Badge>
          </CardContent>
        </Card>
      ))}

      {managers.length === 0 && (
        <p className="text-center text-muted-foreground py-10 col-span-full">
          No managers found
        </p>
      )}
    </div>
  );
}
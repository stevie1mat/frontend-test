import React from "react";
import MapUsers from "@/components/UsersNearby";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";

export default function page() {
  return (
    <ProtectedLayout>
      <MapUsers />
    </ProtectedLayout>
  );
}

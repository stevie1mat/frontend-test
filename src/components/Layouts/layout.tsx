"use client";

import ProtectedLayout from "./ProtectedLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProtectedLayout>{children}</ProtectedLayout>; ;
    </>
  );
}

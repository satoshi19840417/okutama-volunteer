import React, { Suspense } from "react";

const HeroVideo = React.lazy(() => import("./components/HeroVideo"));

export default function App() {
  return (
    <div>
      {/* 他のコンテンツやヘッダーなど */}
      <Suspense fallback={<div>Loading hero video...</div>}>
        <HeroVideo />
      </Suspense>
      {/* 他のコンテンツやフッターなど */}
    </div>
  );
} 
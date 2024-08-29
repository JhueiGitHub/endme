"use client";

import { ClientSideSuspense } from "@liveblocks/react";

import { CommentsOverlay } from "@/app/apps/FigmaApp/components/comments/CommentsOverlay";

export const Comments = () => (
  <ClientSideSuspense fallback={null}>
    {() => <CommentsOverlay />}
  </ClientSideSuspense>
);

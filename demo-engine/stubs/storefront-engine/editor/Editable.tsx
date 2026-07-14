"use client";

import type { ReactNode } from "react";

/**
 * Preview stub for the engine's inline-edit wrapper. In the live storefront
 * this renders an editable surface; here it simply renders the default value
 * through the render-prop, so the theme looks exactly as a fresh tenant sees it.
 */
interface EditableProps {
  section: string;
  field: string;
  defaultValue: string;
  label?: string;
  type?: "text" | "image";
  children: (value: string, editableProps: Record<string, unknown>) => ReactNode;
}

export function Editable({ defaultValue, children }: EditableProps) {
  return <>{children(defaultValue, {})}</>;
}

export default Editable;

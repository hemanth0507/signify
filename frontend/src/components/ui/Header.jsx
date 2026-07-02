import React from "react";

export default function Header({ title, subtitle, children }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-900 mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-txt-secondary max-w-2xl">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

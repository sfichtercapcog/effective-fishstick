// components/ZohoForm.tsx
"use client";

import { useEffect } from "react";

interface ZohoFormProps {
  formId: string;
  formSrc: string;
  height?: string;
}

export default function ZohoForm({
  formId,
  formSrc,
  height = "3557px",
}: ZohoFormProps) {
  useEffect(() => {
    const container = document.getElementById(formId);

    if (container) {
      // 🧼 Clear any existing form iframe to avoid duplicates
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      const f = document.createElement("iframe");
      f.src = `${formSrc}?zf_rszfm=1`;
      f.style.border = "none";
      f.style.height = height;
      f.style.width = "90%";
      f.style.transition = "all 0.5s ease";
      f.setAttribute("aria-label", "Zoho Form");

      container.appendChild(f);
    }

    const handler = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;

      const zf_ifrm_data = event.data.split("|");
      if (zf_ifrm_data.length === 2 || zf_ifrm_data.length === 3) {
        const zf_perma = zf_ifrm_data[0];
        const newHeight = `${parseInt(zf_ifrm_data[1], 10) + 15}px`;
        const iframe = container?.getElementsByTagName("iframe")[0];

        if (
          iframe &&
          iframe.src.includes("formperma") &&
          iframe.src.includes(zf_perma) &&
          iframe.style.height !== newHeight
        ) {
          if (zf_ifrm_data.length === 3) {
            iframe.scrollIntoView();
            setTimeout(() => {
              iframe.style.height = newHeight;
            }, 500);
          } else {
            iframe.style.height = newHeight;
          }
        }
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, [formId, formSrc, height]);

  return <div id={formId} />;
}

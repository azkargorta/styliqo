import clsx from "clsx";

export function StyliqoLogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={clsx("h-10 w-10", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 18.5c0-5.8 4.7-10.5 10.5-10.5h3c5.8 0 10.5 4.7 10.5 10.5v5.7c0 2.5-1.5 4.9-3.8 6l-10.8 5.3c-2.5 1.2-5.4.2-6.6-2.3-.3-.6-.4-1.2-.4-1.8V18.5Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M18.2 12.8h11.6c3.9 0 7 3.1 7 7v4.5c0 2-1.1 3.9-2.9 4.8l-9.4 4.7c-2.7 1.3-5.9.2-7.2-2.5-.3-.6-.5-1.3-.5-2V19.8c0-3.9 3.1-7 7-7Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M19.3 20.2c2.4-2.5 6.9-2.5 9.4 0 2.4 2.5 6.9 2.5 9.4 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M20.4 37.1l16.8-8.3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}


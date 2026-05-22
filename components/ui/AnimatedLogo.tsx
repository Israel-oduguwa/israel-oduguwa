"use client";

export function AnimatedLogo() {
  return (
    <div className="group flex h-10 cursor-pointer items-center overflow-hidden">
      <div className="relative flex shrink-0 items-center">
        <svg
          width="40"
          height="40"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 text-current"
          aria-hidden="true"
        >
          <g transform="translate(82 104)">
            <path
              d="M0 0H86V315H36C16.1177 315 0 298.882 0 279V0Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M281 326C371.022 326 444 253.022 444 163C444 72.9776 371.022 0 281 0C190.978 0 118 72.9776 118 163C118 253.022 190.978 326 281 326ZM281 245C326.287 245 363 208.287 363 163C363 117.713 326.287 81 281 81C235.713 81 199 117.713 199 163C199 208.287 235.713 245 281 245Z"
              fill="currentColor"
              className="origin-center transition duration-200 group-hover:-translate-x-2 group-hover:scale-95 group-hover:opacity-0"
            />
            <circle
              cx="502"
              cy="275"
              r="43"
              className="fill-primary transition duration-200 group-hover:-translate-x-[322px]"
            />
          </g>
        </svg>
      </div>

      <span className="max-w-0 overflow-hidden whitespace-nowrap pl-0 text-xl font-bold tracking-tight text-current opacity-0 transition-[max-width,opacity,padding] duration-200 group-hover:max-w-32 group-hover:pl-2 group-hover:opacity-100">
        Israel O<span className="text-primary">.</span>
      </span>
    </div>
  );
}

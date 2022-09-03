import React from 'react';

export default function ApplicationLogo({ className, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="1000" cy="1000" r="1000" fill="#0156F3" />
      <mask id="mask0_101_27" style={{ 'mask-type': 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="2000" height="2000">
        <circle cx="1000" cy="1000" r="1000" fill="#0156F3" />
      </mask>
      <g mask="url(#mask0_101_27)">
        <path d="M304 2122H1695.5L1358.5 880H639.5L304 2122Z" fill="#F91055" />
      </g>
      <path d="M1427.5 549.5C1427.5 577.062 1402.8 620.637 1320.01 661.278C1241.55 699.792 1128.5 725.5 1000 725.5C871.503 725.5 758.451 699.792 679.993 661.278C597.202 620.637 572.5 577.062 572.5 549.5C572.5 521.938 597.202 478.364 679.993 437.722C758.451 399.208 871.503 373.5 1000 373.5C1128.5 373.5 1241.55 399.208 1320.01 437.722C1402.8 478.364 1427.5 521.938 1427.5 549.5Z" stroke="white" strokeWidth="133" />
    </svg>
  );
}

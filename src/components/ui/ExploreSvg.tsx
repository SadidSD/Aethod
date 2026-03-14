import React from 'react';

interface ExploreSvgProps {
    className?: string;
    isPressed?: boolean;
}

export const ExploreSvg = ({ className, isPressed }: ExploreSvgProps) => {
    return (
        <svg width="176" height="71" viewBox="0 0 176 71" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <g filter={isPressed ? "url(#filter_pressed)" : "url(#filter_default)"}>
                <rect x="8" y="8" width="160" height="55" rx="10" fill="#F2F1EF" />
                <rect x="5.5" y="5.5" width="165" height="60" rx="12.5" stroke="url(#paint0_explore)" strokeWidth="5" />
                <path d="M35.28 42V27.4H36.8V42H35.28ZM36.44 42V40.62H43.74V42H36.44ZM36.44 35.26V33.9H43.06V35.26H36.44ZM36.44 28.78V27.4H43.52V28.78H36.44ZM45.6908 42L49.6108 36.42V36.82L45.9308 31.42H47.5708L50.3708 35.58H50.6508L53.3108 31.42H54.8508L51.3908 36.66V36.28L55.5108 42H53.8708L50.6308 37.5H50.3708L47.2308 42H45.6908ZM57.9283 46V31.42H59.1283V35.96L58.7683 36C58.8216 34.9333 59.0483 34.0333 59.4483 33.3C59.8616 32.5667 60.4149 32.0133 61.1083 31.64C61.8149 31.2533 62.6016 31.06 63.4683 31.06C64.2416 31.06 64.9416 31.2133 65.5683 31.52C66.2083 31.8133 66.7483 32.22 67.1883 32.74C67.6416 33.2467 67.9816 33.8333 68.2083 34.5C68.4483 35.1533 68.5683 35.84 68.5683 36.56V36.84C68.5683 37.56 68.4483 38.2533 68.2083 38.92C67.9683 39.5733 67.6216 40.16 67.1683 40.68C66.7283 41.1867 66.1883 41.5933 65.5483 41.9C64.9216 42.1933 64.2149 42.34 63.4283 42.34C62.5883 42.34 61.8149 42.1533 61.1083 41.78C60.4149 41.3933 59.8483 40.8267 59.4083 40.08C58.9816 39.3333 58.7483 38.4133 58.7083 37.32L59.4283 38.82V46H57.9283ZM63.2283 41.02C64.0283 41.02 64.7149 40.8333 65.2883 40.46C65.8616 40.0733 66.3016 39.5533 66.6083 38.9C66.9149 38.2333 67.0683 37.5 67.0683 36.7C67.0683 35.8733 66.9083 35.14 66.5883 34.5C66.2816 33.8467 65.8416 33.3333 65.2683 32.96C64.6949 32.5733 64.0149 32.38 63.2283 32.38C62.5083 32.38 61.8549 32.54 61.2683 32.86C60.6816 33.18 60.2149 33.6333 59.8683 34.22C59.5349 34.7933 59.3683 35.4733 59.3683 36.26V37.24C59.3683 37.9867 59.5349 38.6467 59.8683 39.22C60.2149 39.78 60.6816 40.22 61.2683 40.54C61.8549 40.86 62.5083 41.02 63.2283 41.02ZM71.7002 42V27.4H73.2002V42H71.7002ZM70.1602 28.62V27.4H73.2002V28.62H70.1602ZM81.8284 42.34C80.9218 42.34 80.1218 42.1867 79.4284 41.88C78.7484 41.56 78.1684 41.14 77.6884 40.62C77.2218 40.0867 76.8618 39.4933 76.6084 38.84C76.3684 38.1867 76.2484 37.52 76.2484 36.84V36.56C76.2484 35.88 76.3751 35.2133 76.6284 34.56C76.8818 33.8933 77.2484 33.3 77.7284 32.78C78.2084 32.26 78.7884 31.8467 79.4684 31.54C80.1618 31.22 80.9484 31.06 81.8284 31.06C82.7218 31.06 83.5084 31.22 84.1884 31.54C84.8818 31.8467 85.4684 32.26 85.9484 32.78C86.4284 33.3 86.7884 33.8933 87.0284 34.56C87.2818 35.2133 87.4084 35.88 87.4084 36.56V36.84C87.4084 37.52 87.2884 38.1867 87.0484 38.84C86.8084 39.4933 86.4484 40.0867 85.9684 40.62C85.5018 41.14 84.9218 41.56 84.2284 41.88C83.5351 42.1867 82.7351 42.34 81.8284 42.34ZM81.8284 41C82.7084 41 83.4484 40.8067 84.0484 40.42C84.6618 40.02 85.1284 39.5 85.4484 38.86C85.7684 38.2067 85.9284 37.4867 85.9284 36.7C85.9284 35.9 85.7618 35.18 85.4284 34.54C85.1084 33.8867 84.6418 33.3733 84.0284 33C83.4151 32.6133 82.6818 32.42 81.8284 32.42C80.9884 32.42 80.2618 32.6133 79.6484 33C79.0351 33.3733 78.5618 33.8867 78.2284 34.54C77.9084 35.18 77.7484 35.9 77.7484 36.7C77.7484 37.4867 77.9084 38.2067 78.2284 38.86C78.5484 39.5 79.0084 40.02 79.6084 40.42C80.2218 40.8067 80.9618 41 81.8284 41ZM90.4673 42V31.42H91.6673V35.84H91.5473C91.5473 34.2933 91.8873 33.1533 92.5673 32.42C93.2473 31.6733 94.314 31.3 95.7673 31.3H96.1073V32.66H95.4873C94.3407 32.66 93.4673 32.96 92.8673 33.56C92.2673 34.1467 91.9673 35.0133 91.9673 36.16V42H90.4673ZM102.817 42.34C101.91 42.34 101.124 42.1867 100.457 41.88C99.7904 41.56 99.2437 41.14 98.817 40.62C98.3904 40.0867 98.0704 39.4933 97.857 38.84C97.657 38.1867 97.557 37.5133 97.557 36.82V36.54C97.557 35.86 97.657 35.1933 97.857 34.54C98.0704 33.8867 98.3904 33.3 98.817 32.78C99.2437 32.26 99.777 31.8467 100.417 31.54C101.07 31.22 101.83 31.06 102.697 31.06C103.804 31.06 104.724 31.3067 105.457 31.8C106.204 32.2933 106.764 32.9267 107.137 33.7C107.51 34.46 107.697 35.28 107.697 36.16V36.94H98.237V35.78H106.657L106.277 36.36C106.277 35.5733 106.137 34.8867 105.857 34.3C105.59 33.7 105.19 33.2333 104.657 32.9C104.137 32.5533 103.484 32.38 102.697 32.38C101.87 32.38 101.184 32.5733 100.637 32.96C100.09 33.3467 99.677 33.86 99.397 34.5C99.1304 35.14 98.997 35.8667 98.997 36.68C98.997 37.48 99.1304 38.2133 99.397 38.88C99.677 39.5333 100.097 40.0533 100.657 40.44C101.23 40.8267 101.95 41.02 102.817 41.02C103.737 41.02 104.484 40.8133 105.057 40.4C105.63 39.9733 105.984 39.4733 106.117 38.9H107.517C107.384 39.6067 107.104 40.22 106.677 40.74C106.25 41.2467 105.71 41.64 105.057 41.92C104.404 42.2 103.657 42.34 102.817 42.34Z" fill="#404040" />
                <path d="M126 40.5L136 30.5M136 30.5H126M136 30.5V40.5" stroke="url(#paint1_explore)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <filter id="filter_default" x="0" y="0" width="176" height="71" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="-1" dy="-1" />
                    <feGaussianBlur stdDeviation="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.568627 0 0 0 0 0.560784 0 0 0 0.5 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="1" dy="1" />
                    <feGaussianBlur stdDeviation="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0" />
                    <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="2" dy="2" />
                    <feGaussianBlur stdDeviation="2.5" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.568627 0 0 0 0 0.560784 0 0 0 0.5 0" />
                    <feBlend mode="normal" in2="shape" result="effect3_innerShadow" />
                </filter>
                <filter id="filter_pressed" x="0" y="0" width="176" height="71" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="3" dy="3" />
                    <feGaussianBlur stdDeviation="4" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.568627 0 0 0 0 0.560784 0 0 0 0.7 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_innerShadow" />

                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="-3" dy="-3" />
                    <feGaussianBlur stdDeviation="3" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.8 0" />
                    <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow" />
                </filter>
                <radialGradient id="paint0_explore" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(88 35.5) rotate(90) scale(27.5 80)">
                    <stop stopColor="#5A69EA" />
                    <stop offset="1" stopColor="#BF8BCA" />
                </radialGradient>
                <radialGradient id="paint1_explore" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(131 35.5) rotate(90) scale(5)">
                    <stop stopColor="#5A69EA" />
                    <stop offset="1" stopColor="#BF8BCA" />
                </radialGradient>
            </defs>
        </svg>
    );
};

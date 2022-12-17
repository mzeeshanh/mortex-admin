import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import './FullPageLoader.css';

function FullPageLoader() {
    useEffect(() => {
        AOS.init();
    }, [])

    return (
        <React.Fragment>
            {/* <div className="fullpage-loader-holder d-flex justify-content-center align-items-center">
                <div className='img-loader'>
                    <img className="img-fluid" src="https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1655727474/hex-nft/assets/mynist_s1vmud.png" alt="" />
                </div> 
            </div> */}
            <div class="center-body">
                <div>
                <svg class="loader-circle-64" viewbox="0 0 100 100">
                <g class="points">
                <circle class="crc c1" cx="50" cy="50" r="50" fill="#fff" />
                <circle class="crc ci2" cx="5" cy="50" r="4" />
                <circle class="crc ci1" cx="95" cy="50" r="4" />
                </g>
                </svg>
                </div>
            </div>
        </React.Fragment>
    );
};

export default FullPageLoader;
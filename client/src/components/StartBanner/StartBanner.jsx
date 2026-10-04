
import React from 'react';
// import { NavLink } from "react-router-dom";
import './StartBanner.css';

export default function StartBanner({bannerType}) {
 const bannerClass = `start-banner start-banner-${bannerType}`;

    return (
        <div id="banner" className='start-banner-wrp'>
            <div className={bannerClass}>
                 <div className='znak'></div>
            </div>
        </div>
    );
}

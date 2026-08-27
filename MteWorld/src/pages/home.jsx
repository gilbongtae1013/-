import { Outlet } from 'react-router-dom';

import add from '../assets/add.png';
import add2 from '../assets/add2.png';
import add3 from '../assets/add3.png';


export default function Home() {
    return (
        <div id='Home-container'>
            <div id='Home-leftside'>
                <div id='Home-profileBox'>
                    <div id='Home-profileImage'></div>
                    <span id='Home-userName'>최지누 • 1013</span>
                </div>

                <img src={add3} id='Home-add3'/>
            </div>

            <div id='Home-box'>
                <Outlet />
            </div>

            <div id='Home-rightside'>
                <img src={add} id='Home-add' />
                <img src={add2} id='Home-add2'/>
            </div>
        </div>
    );
}
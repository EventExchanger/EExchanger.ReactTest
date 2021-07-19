import React from 'react';
import logo from './logo.svg';
import './App.css';
import { DropdownTest } from './DropdownTest';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <DropdownTest isopen={true} title="dropdown1" body={<div>dropdown body 1</div>}></DropdownTest>

                    <DropdownTest title="dropdown2" body={<div>dropdown body 2</div>}></DropdownTest>
                    <DropdownTest title="dropdown3" body={<div>dropdown body 3</div>}></DropdownTest>

                </div>

                <img src={logo} className="App-logo" alt="logo" />
            </header>

        </div>
    );
}

export default App;
